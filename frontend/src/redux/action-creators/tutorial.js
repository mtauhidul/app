import * as types from './types';

export function tutorial_Reset() {
    return { type: types.TUTORIAL_RESET };
}
export function tutorial_SetOpen() {
    return { type: types.TUTORIAL_SET_OPEN };
}
export function tutorial_SetClose() {
    return { type: types.TUTORIAL_SET_CLOSE };
}
export function tutorial_Next() {
    return { type: types.TUTORIAL_NEXT };
}

export function tutorial_Back() {
    return { type: types.TUTORIAL_BACK };
}
