import FHIR from 'fhirclient';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import fhirInitState from '../../redux/reducers/fhir/init';

const InitLoader = (props) => {
  const smartError = () => {
    Promise.resolve(null).then(() => {
      props.fhir_Reset();
      props.fhir_SetSmart({ status: 'error', data: fhirInitState.smart.data });
      // props.fhir_SetSampleData();
    });
  };

  React.useEffect(() => {
    const page = window.location.pathname
      .split('/')
      .filter((i) => !!i)
      .pop();
    if (page === 'patient') {
      props.historyPush('/home', props, `/${props.uuid}`);
    }

    new Promise(async (resolve, reject) => {
      const params = new URLSearchParams(window.location.search);
      const state = params.get('state');

      const appState = props.getAppState();

      const stored = sessionStorage.getItem(state);

      let tokenPromise;

      if (stored) {
        const token = JSON.parse(stored);

        const remote = await props.fetchData(
          '/api/flagged-conditions',
          {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `${token.tokenResponse.token_type} ${token.tokenResponse.access_token}`,
          },
          {
            method: 'POST',
            body: JSON.stringify({
              serverUrl: token.serverUrl,
              id_token: token.tokenResponse.id_token,
              patients: token?.tokenResponse?.patient
                ? [token.tokenResponse.patient]
                : [],
            }),
          }
        );

        tokenPromise = Promise.resolve({ token, remote });
      } else {
        tokenPromise = props
          .fetchData(
            `/api/init`,
            {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            {
              method: 'POST',
              body: JSON.stringify({
                state,
                appState,
              }),
            }
          )
          .then(async (data) => {
            const remote = data[state];
            if (remote) {
              const token = {
                key: remote.key,
                serverUrl: remote.serverUrl,
                tokenResponse: remote.tokenResponse,
              };

              sessionStorage.setItem(state, JSON.stringify(token));

              return { token, remote };
            }
            return {};
          });
      }

      return tokenPromise
        .then(async ({ token, remote }) => {
          interopion.splashscreen.done();

          const smart = FHIR.client(token);
          const flaggedConditions = remote.patientsData;
          const user = await props.getUser(remote.practitionerData);
          const patients = await props.getPatientDemographics(
            smart,
            Object.keys(remote.patientsData).map((key) => ({
              ...remote.patientsData[key].patient,
              riskType: remote.patientsData[key].type,
              bundleId: remote.patientsData[key].bundleId,
              careBundles: remote.patientsData[key].careBundles,
            }))
          );

          if (smart?.patient?.id) {
            props.fhir_SetParsedPatientDemographics(patients);
          } else {
            props.fhir_SetParsedPatients(patients);
          }

          props.fhir_SetFlaggedConditions(flaggedConditions);
          props.fhir_SetUser(user);

          return resolve(smart);
        })
        .catch((e) => reject(e));
    })
      .then((smart) => {
        let context = null;
        const interopioContext =
          smart?.state?.tokenResponse?.interopioContext || '{}';
        const htmlEl = document.getElementsByTagName('html')[0];
        try {
          context = JSON.parse(interopioContext);
        } catch {
          context = {};
        }
        if (smart) {
          smart.interopioContext = context;
        }
        if (context.consoleLogLevel) {
          htmlEl.setAttribute(
            'data-console-log-level',
            context.consoleLogLevel
          );
        }
        if (context.ioLogLevel) {
          htmlEl.setAttribute('data-io-log-level', context.ioLogLevel);
        }
        props.fhir_SetSmart({ status: 'ready', data: smart });
        props.ui_SetInitialized();
      })
      .catch((e) => {
        console.warn('ERROR', e);
        smartError(e);
      });
  }, []);

  return null;
};

InitLoader.propTypes = {
  fhir: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  fhir_Reset: PropTypes.func.isRequired,
  fhir_SetSampleData: PropTypes.func.isRequired,
  fhir_SetSmart: PropTypes.func.isRequired,
};

export default InitLoader;
