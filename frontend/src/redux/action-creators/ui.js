/* tslint:disable:max-line-length */
import * as types from './types'

export function ui_SetClientWidth(width = 800) {
    return {
        type: types.UI_SET_CLIENT_WIDTH,
        payload: width,
    }
}
export function ui_SetClientHeight(payload = 600) {
    return {
        type: types.UI_SET_CLIENT_HEIGHT,
        payload,
    }
}
export function ui_SetFooterHeight(height = 100) {
    return {
        type: types.UI_SET_FOOTER_HEIGHT,
        payload: height,
    }
}
export function ui_SetInitialized(flag = true) {
    return {
        type: types.UI_SET_INITIALIZED,
        payload: flag,
    }
}
export function ui_SetRetina() {
    const media = '(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)'
    const isRetina = (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(media).matches))
    return {
        type: types.UI_SET_RETINA,
        payload: isRetina,
    }
}
export function ui_SetTheme(theme) {
    return {
        type: types.UI_SET_THEME,
        payload: theme,
    }
}
export function ui_HideSnackbarMessage() {
    return { type: types.UI_HIDE_SNACKBAR_MESSAGE }
}
export function ui_SetSnackbarMessage(payload) {
    return {
        type: types.UI_SET_SNACKBAR_MESSAGE,
        payload,
    }
}
export function ui_SetLoggedOut(payload = true) {
    return { type: types.UI_SET_LOGGED_OUT, payload }
}

export function ui_SetLoggedOutAuto(payload = true) {
    return { type: types.UI_SET_LOGGED_OUT_AUTO, payload }
}

export function ui_SetAllPatientsTab(payload) {
    return { type: types.UI_SET_ALL_PATIENTS_TAB, payload }
}
export function ui_SetNavigationHeight(payload = 0) {
    return {
        type: types.UI_SET_NAVIGATION_HEIGHT,
        payload,
    }
}
export function ui_SetModalHeadingHeight(payload = 0) {
    return {
        type: types.UI_SET_MODAL_HEADING_HEIGHT,
        payload,
    }
}
export function ui_SetOpenedModal(payload = null) {
    return {
        type: types.UI_SET_OPENED_MODAL,
        payload,
    }
}

export function ui_SetModalWidth(payload = 0) {
    return {
        type: types.UI_SET_MODAL_WIDTH,
        payload,
    }
}

export function ui_SetPatientHeadingContainerHeight(payload = 0) {
    return {
        type: types.UI_SET_PATIENY_HEADING_CONTAINER_HEIGHT,
        payload,
    }
}

export function ui_SetStageScrollTop(payload = 0) {
    return {
        type: types.UI_SET_STAGE_SCROLL_TOP,
        payload,
    }
}

export function ui_SetPatientInfoTab(payload = '') {
    return {
        type: types.UI_SET_PATIENT_INFO_TAB,
        payload,
    }
}

export function ui_SetNavigationHeightGeneral(payload = 0) {
    return {
        type: types.UI_SET_NAVIGATION_HEIGHT_GENERAL,
        payload,
    }
}

export function ui_SetScrolledIntoView(payload) {
    return {
        type: types.UI_SET_SCROLLED_INTO_VIEW,
        payload,
    }
}

export function ui_SetErrorMessage(payload) {
    return {
        type: types.UI_SET_ERROR_MESSAGE,
        payload,
    }
}

export function ui_SetErrorDetails(payload) {
    return {
        type: types.UI_SET_ERROR_DETAILS,
        payload,
    }
}
