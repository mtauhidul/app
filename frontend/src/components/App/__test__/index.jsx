import React from 'react';
import * as sinon from 'sinon';
import '../../../../../../lib/tests';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createShallow } from '@material-ui/core/test-utils';
import { App, connectedComponent as AppRedux } from '..';

React.useLayoutEffect = React.useEffect;
describe('App', () => {
    let mount;
    const props = {
        // fhir_Reset: () => {},
        // fhir_SetSmart: () => {},
        getAppState: () => '00001',
        ui: {
            loggedOut: false,
        },
        history: {
            listen: () => () => { },
        },
    };
    before(() => {
        mount = createShallow();
    });
    afterEach(() => {
        // Restore the default sandbox here
        sinon.restore();
    });
    it('Render with store context', () => {
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);
        const store = mockStore({ reduxStore: 1 });
        const wrapper = mount(<AppRedux store={store} {...props} />);
        expect(wrapper.find('ContextProvider')).to.have.length(1);
        expect(wrapper.find('App')).to.have.length(1);
        expect(wrapper.props().children.props.reduxStore).to.equal(1);
    });
    it('Render with appState', () => {
        const wrapper = mount(<App {...props} />);
        expect(wrapper.find('.stage')).to.have.length(1);
    });
    it('Render without appState', () => {
        const propsLocal = {
            ...props,
            uuid: '00TEST',
            getAppState: sinon.spy(),
            historyPush: sinon.spy(),
        };
        const wrapper = mount(<App {...propsLocal} />);
        expect(wrapper.find('.stage')).to.have.length(1);
        expect(propsLocal.getAppState.called).to.be.true;
        expect(propsLocal.historyPush.called).to.be.true;
    });
    it('Mount and unmount', () => {
        const wrapper = mount(<App {...props} />);
        const spied = sinon.spy(window, 'removeEventListener');
        wrapper.unmount();
        expect(spied.called).to.be.true;
    });
    describe('Methods', () => {
        describe('refStage', () => {
            it('Changed', () => {
                const propsLocal = {
                    ...props,
                    ui: {
                        clientWidth: 10,
                    },
                    ui_SetClientWidth: sinon.spy(),
                };
                const wrapper = mount(<App {...propsLocal} />);
                wrapper.instance().refStage()({ clientWidth: 13 });
                expect(propsLocal.ui_SetClientWidth.called).to.be.true;
            });
            it('Not Changed', () => {
                const propsLocal = {
                    ...props,
                    ui: {
                        clientWidth: 10,
                    },
                    ui_SetClientWidth: sinon.spy(),
                };
                const wrapper = mount(<App {...propsLocal} />);
                wrapper.instance().refStage()({ clientWidth: 10 });
                expect(propsLocal.ui_SetClientWidth.called).to.be.false;
            });
        });
        it('onResize', () => {
            const propsLocal = {
                ...props,
                ui: {
                    clientWidth: 10,
                },
                ui_SetClientWidth: sinon.spy(),
            };
            const wrapper = mount(<App {...propsLocal} />);
            const wrapInstance = wrapper.instance();
            const spied = sinon.spy(wrapInstance, 'forceUpdate');
            wrapInstance.onResize();
            expect(spied.called).to.be.true;
        });
    });
});
