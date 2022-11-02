import { DateTime } from 'luxon';
import { mergeDeep, splitSearch } from '../../../../../lib/utils';
import * as types from '../../action-creators/types';
import initialState from './init';
import sampleData from './sample-data';

export default function (state = initialState, action = null) {
  switch (action.type) {
    case types.FHIR_RESET:
      return mergeDeep({}, initialState);
    case types.FHIR_SET_CONTEXT: {
      const newState = mergeDeep({}, state);
      newState.context = action.payload;
      return newState;
    }
    case types.FHIR_SET_USER: {
      const newState = mergeDeep({}, state);
      newState.parsed.user = {
        status: 'ready',
        data: action.payload,
      };
      return newState;
    }
    case types.FHIR_SET_META: {
      const newState = mergeDeep({}, state);
      newState.meta = { status: 'ready', ...action.payload };
      return newState;
    }
    case types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS: {
      const newState = mergeDeep({}, state);
      newState.parsed.patientDemographics = {
        status: 'ready',
        data: action.payload,
      };
      return newState;
    }
    case types.FHIR_SET_SAMPLE_DATA:
      return mergeDeep({}, state, { ...sampleData[0] });
    case types.FHIR_SET_SMART: {
      const newState = mergeDeep({}, state);
      newState.smart = action.payload;
      return newState;
    }
    case types.FHIR_SET_PARSED_PATIENTS: {
      const newState = mergeDeep({}, state);
      newState.parsed.patientList = {
        ...newState.parsed.patientList,
        search: {
          ...newState.parsed.patientList.search,
          total: action.payload.total,
        },
        status: 'ready',
        data: action.payload.data,
      };
      return newState;
    }
    case types.FHIR_SET_PATIENT_MEDICAL_DATA: {
      const newState = mergeDeep({}, state);
      const { smartId, resourceType, data } = action.payload;

      newState.patientData[smartId] = {
        ...(newState?.patientData?.[smartId] || {}),
        [resourceType]: data,
      };

      return newState;
    }
    case types.FHIR_SET_SEARCH_KEYWORDS: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientList.search.keywords = splitSearch(action.payload);

      return newState;
    }
    case types.FHIR_SET_SEARCH_SORT: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientList.search.sort = action.payload;

      return newState;
    }
    case types.FHIR_TOGGLE_SEARCH_FILTER: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientList.search.filter[action.payload] =
        !newState.parsed.patientList.search.filter[action.payload];

      return newState;
    }
    case types.FHIR_SET_SEARCH_FILTER: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientList.search.filter = action.payload;

      return newState;
    }

    case types.FHIR_SET_SEARCH_START_DATE: {
      const newState = mergeDeep({}, state);
      newState.parsed.patientList.search.startDate = DateTime.fromISO(
        action.payload
      ).toFormat('yyyy-MM-dd');
      return newState;
    }

    case types.FHIR_SET_SEARCH_END_DATE: {
      const newState = mergeDeep({}, state);
      newState.parsed.patientList.search.endDate = DateTime.fromISO(
        action.payload
      ).toFormat('yyyy-MM-dd');
      return newState;
    }

    case types.FHIR_RESET_SEARCH_FILTER: {
      const newState = mergeDeep({}, state);
      newState.parsed.patientList.search.startDate = null;
      newState.parsed.patientList.search.endDate = null;
      newState.parsed.patientList.search.filter = {};

      return newState;
    }

    case types.FHIR_SET_PATIENT_CHART: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientDemographics.data.vitals = action.payload.vitals;
      newState.parsed.patientDemographics.data.labs = action.payload.labs;

      return newState;
    }

    case types.FHIR_SET_PATIENT_NOTIFICATION_AS_READ: {
      const newState = mergeDeep({}, state);

      newState.parsed.patientDemographics.data.notification =
        newState.parsed.patientDemographics.data.notification.map((item) => {
          if (item.id === action.payload) {
            item.viewed = DateTime.now().toISO();
          }
          return item;
        });

      return newState;
    }

    case types.FHIR_SET_FLAGGED_CONDITIONS: {
      const newState = mergeDeep({}, state);

      const patientInContextId =
        newState?.parsed?.patientDemographics?.data?.smartId;

      const data = action.payload;

      newState.flaggedConditions = {
        status: 'ready',
        data,
      };

      newState.parsed.patientList.data = newState.parsed.patientList.data.map(
        (patient) => {
          const id = patient.smartId;

          const { conds, details: condsDetails, riskScore: risk } = data[id];

          return {
            ...patient,
            risk,
            conds,
            condsDetails,
          };
        }
      );

      if (patientInContextId) {
        const { conds, details } = data[patientInContextId];

        const risk = conds.reduce(
          (reduced, cond) => Math.max(details?.[cond]?.risk || 0, reduced),
          0
        );

        newState.parsed.patientDemographics.data.conds = conds;
        newState.parsed.patientDemographics.data.condsDetails = details;
        newState.parsed.patientDemographics.data.risk = risk;
      }

      return newState;
    }
  }
  return state;
}
