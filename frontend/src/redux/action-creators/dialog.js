import * as types from './types';

export function dialog_Reset() {
    return { type: types.DIALOG_RESET };
}

export function dialog_SetOpen(payload) {
    return { type: types.DIALOG_SET_OPEN, payload }
}
