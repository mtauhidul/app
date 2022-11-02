import * as types from '../../action-creators/types';
import initialState from './init';

import { mergeDeep } from '../../../../../lib/utils';

export default function (state = initialState, action = null) {
    switch (action.type) {
        case types.TUTORIAL_SET_OPEN: {
            const newState = mergeDeep({}, state);
            newState.open = true;
            return newState;
        }
        case types.TUTORIAL_SET_CLOSE: {
            const newState = mergeDeep({}, state);
            newState.open = false;
            return newState;
        }

        case types.TUTORIAL_NEXT: {
            const newState = mergeDeep({}, state);
            newState.index = Math.min(4, newState.index + 1);
            return newState;
        }

        case types.TUTORIAL_BACK: {
            const newState = mergeDeep({}, state);
            newState.index = Math.max(1, newState.index - 1);
            return newState;
        }

        case types.TUTORIAL_RESET: {
            return initialState
        }
    }
    return state;
}
