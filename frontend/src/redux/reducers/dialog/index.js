import * as types from '../../action-creators/types';
import initialState from './init';
import { mergeDeep } from '../../../../../lib/utils';

export default function (state = initialState, action = null) {
    switch (action.type) {
        case types.DIALOG_RESET:
            return mergeDeep({}, initialState);
        case types.DIALOG_SET_OPEN:
            return mergeDeep({}, state, {
                open: true,
                headingType: action.payload.headingType,
                contentType: action.payload.contentType,
            });
    }
    return state;
}
