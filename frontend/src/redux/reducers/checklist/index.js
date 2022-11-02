import * as types from '../../action-creators/types';
import initialState from './init';
import { mergeDeep } from '../../../../../lib/utils';

export default function (state = initialState, action = null) {
    switch (action.type) {
        case types.CHECKLIST_CHECK_CALLED_DOCTOR:
            return mergeDeep({}, state, {
                calledDoctor: { [action.payload]: !state?.calledDoctor?.[action.payload] },
            });

        case types.CHECKLIST_CHECK_REVIEW_CHART:
            return mergeDeep({}, state, {
                reviewedChart: { [action.payload]: !state?.reviewedChart?.[action.payload] },
            });

        case types.CHECKLIST_CHECK_BUNDLE:
            const { check, item } = action.payload;

            let bundle = state.bundle[check] || [];

            if (bundle.includes(item)) {
                bundle = bundle.filter((i) => i !== item)
            }
            else {
                bundle.push(item)
            }

            return mergeDeep({}, state, {
                bundle: { [check]: bundle },
            });
    }
    return state;
}
