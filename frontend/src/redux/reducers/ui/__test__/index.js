// import * as chai from "chai";
// const expect = chai.expect;
import { expect } from 'chai';
// import "./../../../../../lib/tests";
import * as types from '../../../action-creators/types';
import initialState from '../init';
import reducer from '..';
import { mergeDeep } from '../../../../../../../lib/utils';

describe('ui Redux Reducer', () => {
    describe('Handles Initialization Task', () => {
        it('returns the initial state', () => {
            expect(reducer(undefined, {})).to.deep.equal(initialState);
        });
    });
    describe(`Handles ${types.UI_SET_CLIENT_WIDTH}`, () => {
        it('sets clientWidth', () => {
            const action = {
                type: types.UI_SET_CLIENT_WIDTH,
                payload: 1024,
            };
            const expected = mergeDeep({}, initialState, { clientWidth: action.payload });
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_SET_FOOTER_HEIGHT}`, () => {
        it('sets clientWidth', () => {
            const action = {
                type: types.UI_SET_FOOTER_HEIGHT,
                payload: 50,
            };
            const expected = mergeDeep({}, initialState, { footerHeight: action.payload });
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_SET_THEME}`, () => {
        it('sets theme', () => {
            const action = {
                type: types.UI_SET_THEME,
                payload: { palette: { myColor: '#af7f4f' } },
            };
            const expected = mergeDeep({}, initialState, { theme: action.payload });
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_SET_RETINA}`, () => {
        it('sets retina', () => {
            const action = {
                type: types.UI_SET_RETINA,
                payload: true,
            };
            const expected = mergeDeep({}, initialState, { retina: action.payload });
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_SET_INITIALIZED}`, () => {
        it('Set initilizied', () => {
            const action = {
                type: types.UI_SET_INITIALIZED,
                payload: true,
            };
            const expected = {
                ...initialState,
                initialized: true,
            };
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
        it('Set not initilizied', () => {
            const action = {
                type: types.UI_SET_INITIALIZED,
                payload: false,
            };
            const expected = {
                ...initialState,
                initialized: false,
            };
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_SET_SNACKBAR_MESSAGE}`, () => {
        it('Simple', () => {
            const action = {
                type: types.UI_SET_SNACKBAR_MESSAGE,
                payload: 'message',
            };
            const expected = {
                ...initialState,
                snackbarMessage: 'message',
            };
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
        it('Complex - without different timeout', () => {
            const action = {
                type: types.UI_SET_SNACKBAR_MESSAGE,
                payload: { msg: 'message - 2' },
            };
            const expected = {
                ...initialState,
                snackbarMessage: 'message - 2',
            };
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
        it('Complex - with different timeout', () => {
            const action = {
                type: types.UI_SET_SNACKBAR_MESSAGE,
                payload: { msg: 'message - 3', timeout: 1500 },
            };
            const expected = {
                ...initialState,
                snackbarMessage: 'message - 3',
                snackbarMessageTimeout: 1500,
            };
            expect(reducer(initialState, action)).to.deep.equal(expected);
        });
    });
    describe(`Handles ${types.UI_HIDE_SNACKBAR_MESSAGE}`, () => {
        it('Complex - with different timeout', () => {
            const setAction = {
                type: types.UI_SET_SNACKBAR_MESSAGE,
                payload: { msg: 'message - 3', timeout: 1500 },
            };
            const hideAction = {
                type: types.UI_HIDE_SNACKBAR_MESSAGE,
            };
            const expectedSet = {
                ...initialState,
                snackbarMessage: 'message - 3',
                snackbarMessageTimeout: 1500,
            };
            expect(reducer(initialState, setAction)).to.deep.equal(expectedSet);
            expect(reducer(initialState, hideAction)).to.deep.equal(initialState);
        });
    });
    describe('Do Not Handle Unsubscribed Actions', () => {
        it('returns unchanged state', () => {
            const action = {
                type: '__UNSUBSCRIBED_ACTION__',
                payload: '__PAYLOAD__',
            };
            const state = mergeDeep({}, initialState, { currentLanguage: 'bg' });
            const expected = state;
            expect(reducer(state, action)).to.deep.equal(expected);
        });
    });
});
