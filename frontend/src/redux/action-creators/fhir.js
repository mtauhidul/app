import * as types from './types'

export function fhir_Reset() {
    return { type: types.FHIR_RESET }
}
export function fhir_SetContext(payload) {
    return {
        type: types.FHIR_SET_CONTEXT,
        payload,
    }
}
export function fhir_SetUser(payload) {
    return {
        type: types.FHIR_SET_USER,
        payload,
    }
}
export function fhir_SetMeta(payload) {
    return {
        type: types.FHIR_SET_META,
        payload,
    }
}
export function fhir_SetParsedPatientDemographics(payload) {
    return {
        type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
        payload,
    }
}
export function fhir_SetSampleData() {
    return { type: types.FHIR_SET_SAMPLE_DATA }
}
export function fhir_SetSmart(payload) {
    return {
        type: types.FHIR_SET_SMART,
        payload,
    }
}
export function fhir_SetParsedPatients(payload) {
    return {
        type: types.FHIR_SET_PARSED_PATIENTS,
        payload,
    }
}
export function fhir_SetPatientMedicalData(payload) {
    return {
        type: types.FHIR_SET_PATIENT_MEDICAL_DATA,
        payload,
    }
}
export function fhir_SetSearchKeyword(payload) {
    return {
        type: types.FHIR_SET_SEARCH_KEYWORDS,
        payload,
    }
}
export function fhir_SetSearchSort(payload) {
    return {
        type: types.FHIR_SET_SEARCH_SORT,
        payload,
    }
}
export function fhir_ToggleSearchFilter(payload) {
    return {
        type: types.FHIR_TOGGLE_SEARCH_FILTER,
        payload,
    }
}
export function fhir_SetSearchFilter(payload) {
    return {
        type: types.FHIR_SET_SEARCH_FILTER,
        payload,
    }
}

export function fhir_SetSearchStartDate(payload) {
    return {
        type: types.FHIR_SET_SEARCH_START_DATE,
        payload,
    }
}

export function fhir_SetSearchEndDate(payload) {
    return {
        type: types.FHIR_SET_SEARCH_END_DATE,
        payload,
    }
}

export function fhir_ResetSearchFilter() {
    return { type: types.FHIR_RESET_SEARCH_FILTER }
}

export function fhir_SetPatientChart(payload) {
    return {
        type: types.FHIR_SET_PATIENT_CHART,
        payload,
    }
}

export function fhir_SetPatientNotificationAsRead(payload) {
    return {
        type: types.FHIR_SET_PATIENT_NOTIFICATION_AS_READ,
        payload,
    }
}

export function fhir_SetFlaggedConditions(payload) {
    return {
        type: types.FHIR_SET_FLAGGED_CONDITIONS,
        payload,
    }
}
