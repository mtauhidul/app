import jwtDecode from 'jwt-decode';
import { DateTime } from 'luxon';
import {
  ui_SetErrorDetails,
  ui_SetErrorMessage,
} from '../../frontend/src/redux/action-creators/ui';
import { store } from '../../frontend/src/redux/index';
import { shouldUseZipkin } from './misc.jsx';
import { recorder } from './recorder';

import { parsePatient, parseUser } from './fhir-parsers';

const wrapFetch = require('zipkin-instrumentation-fetch');
const { Tracer, ExplicitContext } = require('zipkin');

export const displayError = (
  message,
  url = '',
  options = {},
  res = null,
  details = null
) => {
  if (store.getState().ui.errorMessage !== message) {
    store.dispatch(ui_SetErrorMessage(message));
    const loaderId = interopion.splashscreen.startLoading({ text: message });
    interopion.splashscreen.errorLoading(loaderId);

    if (res) {
      res
        .clone()
        .text()
        .then((text) => {
          store.dispatch(
            ui_SetErrorDetails({
              text,
              url,
              options,
            })
          );
        });
    } else if (details) {
      store.dispatch(
        ui_SetErrorDetails({
          text: details,
        })
      );
    }
  }
};

const getTracer = () => {
  if (getTracer.tracer) {
    return getTracer.tracer;
  }
  const ctxImpl = new ExplicitContext();
  const localServiceName = `${APP_NAME}-${__BUILD_ENV__ || 'test'}`;
  const tracer = new Tracer({
    ctxImpl,
    recorder: recorder(localServiceName),
    localServiceName,
  });
  getTracer.tracer = tracer;
  return tracer;
};

export const fetchWrapper = (url, options = undefined) => {
  if (shouldUseZipkin()) {
    return wrapFetch(fetch, { tracer: getTracer() })(url, options);
  }
  return fetch(url, options);
};
export const fetchData = (url, headers = null, config = {}) => {
  const method = config.method || 'GET';
  const options = { method };
  if (headers) {
    options.headers = headers;
  }
  if (config.body) {
    options.body = config.body;
  }
  if (config.mode) {
    options.mode = config.mode;
  }
  if (config.cache) {
    options.cache = config.cache;
  }

  const [token = null] = (
    headers?.Authorization ||
    headers?.authorization ||
    ''
  )
    .split(' ')
    .slice(-1);

  if (token) {
    try {
      const { exp } = jwtDecode(token);

      if (exp) {
        const nowUTC = DateTime.now().toUTC();
        const expDate = DateTime.fromSeconds(exp).toUTC();

        if (expDate.toMillis() - nowUTC.toMillis() <= 0) {
          displayError(
            'Session has expired, please relaunch the app',
            url,
            options
          );
          return Promise.resolve({});
        }
      }
    } catch {
      /** pass */
    }
  }

  return fetchWrapper(url, options)
    .then((res) => {
      // if (res.status === 401 || res.status === 403 || res.status === 405) {
      //   displayError(
      //     'Authrization problem, please relaunch the app',
      //     url,
      //     options,
      //     res
      //   );
      //   return res.text();
      // }
      // if (res.status > 499) {
      //   displayError(
      //     'There was an error prossing a query, please relaunch the app',
      //     url,
      //     options,
      //     res
      //   );
      //   return res.text();
      // }
      // if (res.status > 399) {
      //   displayError(
      //     'There was an error prossing a query, please relaunch the app',
      //     url,
      //     options,
      //     res
      //   );
      //   return res.json().then((error) => {
      //     throw { status: res.status, error: error.error };
      //   });
      // }
      return res.text();
    })
    .then((res) => {
      let result = {};
      try {
        if (res) {
          result = JSON.parse(res);
        }
      } catch (err1) {
        try {
          if (res) {
            result = JSON.parse(res.replace(/ 0+(?![. }])/g, ' '));
          }
        } catch (err2) {
          console.warn(`"${res}" is not a valid JSON.`);
        }
      }
      return result;
    });
};
export const drain = (
  url,
  headers,
  count = 0,
  priorResult = {},
  parentResolve = null,
  followLinks = true
) =>
  new Promise((resolve, reject) =>
    fetchData(url, headers)
      .then((result) => {
        let currentResult = result;
        if (parentResolve && currentResult && currentResult.entry) {
          currentResult.entry = currentResult.entry.concat(
            priorResult.entry || []
          );
        } else {
          currentResult = Object.keys(priorResult).length
            ? priorResult
            : result;
        }

        const next = (Array.isArray(result?.link) ? result?.link : []).find(
          (link = {}) => link.relation === 'next'
        );
        if (
          next &&
          result &&
          result.entry &&
          result.entry.length &&
          followLinks
        ) {
          drain(
            next.url,
            headers,
            0,
            currentResult,
            parentResolve || resolve,
            followLinks
          );
        } else {
          const currentResolve = parentResolve || resolve;
          return currentResolve(currentResult);
        }
      })
      .catch((error) => {
        throw error;
      })
  );
export function fhirQuery(url, headers, options = {}) {
  const count = 100;
  const followLinks = options.followLinks;
  return drain(url, headers, count, {}, null, followLinks)
    .then((resultProp) => {
      const result = resultProp;
      if (
        result &&
        result.resourceType === 'Bundle' &&
        result.entry &&
        Array.isArray(result.entry) &&
        result.entry.length > 0
      ) {
        result.entry = result.entry.filter((entry) => {
          if (
            !entry.search ||
            (entry.search &&
              entry.search.mode &&
              entry.search.mode !== 'outcome')
          ) {
            return entry;
          }
          return null;
        });
      }
      return result;
    })
    .then((res) => (res.entry || []).map((item) => item.resource))
    .catch((error) => {
      throw error;
    });
}
export function getFHIRMetadata(smart) {
  return new Promise((resolve, reject) => {
    const capabilitiesURL = `${smart.state.serverUrl}/metadata`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetchWrapper(capabilitiesURL, { headers })
      .then((response) => response.json())
      .then((data) => {
        const FHIRVersion = data.fhirVersion;
        const capabilities = data?.rest?.[0]?.resource;
        const capabilitiesParsed = {};
        const extensions = data?.rest?.[0]?.security?.extension?.[0]?.extension;
        const tokenURLs = extensions
          ? extensions.find((item) => item.url === 'token')
          : null;
        const tokenURL = tokenURLs ? tokenURLs.valueUri : null;
        capabilities.forEach((res) => {
          const supportedInteractions = (res?.interaction || []).map(
            (interaction) => interaction.code
          );
          const interactions = {
            read: supportedInteractions.includes('read'),
            vread: supportedInteractions.includes('vread'),
            update: supportedInteractions.includes('update'),
            delete: supportedInteractions.includes('delete'),
            historyInstance: supportedInteractions.includes('history-instance'),
            historyType: supportedInteractions.includes('history-type'),
            create: supportedInteractions.includes('create'),
            searchType: supportedInteractions.includes('search-type'),
          };
          capabilitiesParsed[res.type] = interactions;
        });
        resolve({
          parsed: {
            version: FHIRVersion,
            capabilities: capabilitiesParsed,
            tokenURL,
          },
          raw: data,
        });
      });
  });
}
/**
 * Loads the Patient resource and returns it's demographics data
 * @export
 * @return§s {Promise<PatientDemographics>}
 */
export function getPatientDemographics(smart, patients) {
  return new Promise((resolve, reject) => {
    if (smart?.patient?.id) {
      const [data] = patients;

      if ('active' in data && !data.active) {
        return reject(new Error('This patient is not active'));
      }
      if (!data.birthDate) {
        return reject(new Error('Patient birthDate is required'));
      }
      if (!data.gender) {
        return reject(new Error('Patient gender is required'));
      }
      if (!data.name || !Array.isArray(data.name) || !data.name.length) {
        return reject(new Error('Patient name is required'));
      }
      try {
        const out = parsePatient(data, smart);
        return resolve(out);
      } catch (ex) {
        return reject(ex);
      }
    }

    return resolve({
      data: patients.map((data) => parsePatient(data, smart)),
      total: 0, // res.total
    });
  });
}

export function getUser({ role: { code, specialty }, user: practitioner }) {
  return new Promise((resolve, reject) => {
    const data = {
      ...practitioner,
      roleCode: code,
      roleSpecialty: specialty,
    };

    if ('active' in data && !data.active) {
      return reject(new Error('This user is not active'));
    }

    return resolve(parseUser(data));
  });
}
export const hasSearchCapability = (
  availableResources,
  resource,
  paramNames
) => {
  let names = paramNames;
  if (!Array.isArray(paramNames)) {
    names = [paramNames];
  }
  const resourceMeta =
    availableResources.find((item) => item.type === resource) || {};
  const searchParams = resourceMeta.searchParam || [];
  const result = {};
  searchParams.forEach((param) => {
    if (names.includes(param.name)) {
      result[param.name] = true;
    }
  });
  return result;
};
