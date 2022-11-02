import * as types from './types';

export function checklist_CheckCalledDoctor(payload) {
    return { type: types.CHECKLIST_CHECK_CALLED_DOCTOR, payload };
}

export function checklist_CheckReviewChart(payload) {
    return { type: types.CHECKLIST_CHECK_REVIEW_CHART, payload }
}

export function checklist_CheckBundle(payload) {
    return { type: types.CHECKLIST_CHECK_BUNDLE, payload }
}
