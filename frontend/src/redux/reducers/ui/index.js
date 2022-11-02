import * as types from '../../action-creators/types'
import initialState from './init'
import { mergeDeep } from '../../../../../lib/utils'

export default function (state = initialState, action = null) {
    switch (action.type) {
        case types.UI_SET_CLIENT_WIDTH:
            return mergeDeep({}, state, { clientWidth: action.payload })
        case types.UI_SET_CLIENT_HEIGHT:
            return mergeDeep({}, state, { clientHeight: action.payload })
        case types.UI_SET_FOOTER_HEIGHT:
            return mergeDeep({}, state, { footerHeight: action.payload })
        case types.UI_SET_INITIALIZED:
            return mergeDeep({}, state, { initialized: action.payload })
        case types.UI_SET_RETINA:
            return mergeDeep({}, state, { retina: action.payload })
        case types.UI_SET_THEME:
            return mergeDeep({}, state, { theme: action.payload })
        case types.UI_HIDE_SNACKBAR_MESSAGE: {
            const defaultTimeout = initialState.snackbarMessageTimeout
            return mergeDeep({}, state, { snackbarMessage: '', snackbarMessageTimeout: defaultTimeout })
        }
        case types.UI_SET_SNACKBAR_MESSAGE: {
            const defaultTimeout = initialState.snackbarMessageTimeout
            const message = action.payload.msg || action.payload
            const timeout = action.payload.timeout === undefined ? defaultTimeout : action.payload.timeout
            return mergeDeep({}, state, { snackbarMessage: message, snackbarMessageTimeout: timeout })
        }
        case types.UI_SET_LOGGED_OUT: {
            return mergeDeep({}, state, { loggedOut: action.payload })
        }
        case types.UI_SET_LOGGED_OUT_AUTO: {
            return mergeDeep({}, state, { loggedOutAuto: action.payload })
        }
        case types.UI_SET_ALL_PATIENTS_TAB: {
            return mergeDeep({}, state, { allPatientsTab: action.payload })
        }
        case types.UI_SET_NAVIGATION_HEIGHT: {
            return mergeDeep({}, state, { navigationHeight: action.payload })
        }
        case types.UI_SET_NAVIGATION_HEIGHT_GENERAL: {
            return mergeDeep({}, state, { navigationHeightGeneral: action.payload })
        }
        case types.UI_SET_OPENED_MODAL: {
            return mergeDeep({}, state, { openedModal: action.payload })
        }
        case types.UI_SET_MODAL_HEADING_HEIGHT: {
            return mergeDeep({}, state, { modalHeadingHeight: action.payload })
        }
        case types.UI_SET_MODAL_WIDTH: {
            return mergeDeep({}, state, { modalWidth: action.payload })
        }

        case types.UI_SET_STAGE_SCROLL_TOP: {
            return mergeDeep({}, state, { stageScroll: action.payload })
        }

        case types.UI_SET_PATIENT_INFO_TAB: {
            return mergeDeep({}, state, { patientInfoTab: action.payload })
        }

        case types.UI_SET_PATIENY_HEADING_CONTAINER_HEIGHT: {
            return mergeDeep({}, state, { patientHeadingContainerHeight: action.payload })
        }

        case types.UI_SET_SCROLLED_INTO_VIEW: {
            return mergeDeep({}, state, { scrolledIntoView: action.payload })
        }

        case types.UI_SET_ERROR_MESSAGE: {
            return mergeDeep({}, state, { errorMessage: action.payload || '' })
        }

        case types.UI_SET_ERROR_DETAILS: {
            return mergeDeep({}, state, { errorDetails: action.payload || null })
        }
    }
    return state
}
