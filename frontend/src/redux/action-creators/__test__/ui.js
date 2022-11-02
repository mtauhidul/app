import { expect } from 'chai';
// import "./../../../../../lib/tests";
import * as types from '../types';
import * as ac from '../ui';

describe('ui Redux Action Creators', () => {
    describe('ui_SetClientWidth(width?: number): reduxAction', () => {
        it('returns a Redux action object with a default payload', () => {
            expect(ac.ui_SetClientWidth()).to.deep.equal({
                type: types.UI_SET_CLIENT_WIDTH,
                payload: 800,
            });
        });
        it('returns a Redux action object with a payload', () => {
            expect(ac.ui_SetClientWidth(1024)).to.deep.equal({
                type: types.UI_SET_CLIENT_WIDTH,
                payload: 1024,
            });
        });
    });
    describe('ui_SetFooterHeight(width?: number): reduxAction', () => {
        it('returns a Redux action object with a default payload', () => {
            expect(ac.ui_SetFooterHeight()).to.deep.equal({
                type: types.UI_SET_FOOTER_HEIGHT,
                payload: 100,
            });
        });
        it('returns a Redux action object with a payload', () => {
            expect(ac.ui_SetFooterHeight(50)).to.deep.equal({
                type: types.UI_SET_FOOTER_HEIGHT,
                payload: 50,
            });
        });
    });
    describe('ui_SetTheme(theme: object): reduxAction', () => {
        it('returns a Redux action object with a payload', () => {
            expect(ac.ui_SetTheme({
                palette: { myColor: '#af7f4f' },
            })).to.deep.equal({
                type: types.UI_SET_THEME,
                payload: {
                    palette: { myColor: '#af7f4f' },
                },
            });
        });
    });
    describe('ui_SetRetina(void): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.ui_SetRetina()).to.deep.equal({
                type: types.UI_SET_RETINA,
                payload: undefined,
            });
        });
    });
    describe('ui_SetInitialized(void): redux Action', () => {
        it('returns a Redux action object without given payload', () => {
            expect(ac.ui_SetInitialized()).to.deep.equal({
                type: types.UI_SET_INITIALIZED,
                payload: true,
            });
        });
        it('returns a Redux action object with payload - true', () => {
            expect(ac.ui_SetInitialized(true)).to.deep.equal({
                type: types.UI_SET_INITIALIZED,
                payload: true,
            });
        });
        it('returns a Redux action object with payload - false', () => {
            expect(ac.ui_SetInitialized(false)).to.deep.equal({
                type: types.UI_SET_INITIALIZED,
                payload: false,
            });
        });
    });
    describe('ui_HideSnackbarMessage(void): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.ui_HideSnackbarMessage()).to.deep.equal({
                type: types.UI_HIDE_SNACKBAR_MESSAGE,
            });
        });
    });
    describe('ui_SetSnackbarMessage(payload): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.ui_SetSnackbarMessage('message')).to.deep.equal({
                type: types.UI_SET_SNACKBAR_MESSAGE,
                payload: 'message',
            });
        });
    });
});
