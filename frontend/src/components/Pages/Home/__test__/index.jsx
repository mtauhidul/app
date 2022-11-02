import React from 'react';
import '../../../../../../../lib/tests';
import { expect } from 'chai';
import * as sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createShallow } from '@material-ui/core/test-utils';
import { Home, connectedComponent as AppRedux } from '..';

React.useLayoutEffect = React.useEffect;
describe('Home', () => {
    const mount = createShallow();
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore({ reduxStore: 1 });
    const props = {
        getAppState: () => '123',
        ui: {
            initialized: true,
        },
        store,
        historyPush: sinon.spy(),
    };
    it('Render - not initialized', () => {
        const localProps = {
            ...props,
            ui: {
                initialized: false,
            },
        };
        const wrapper = mount(<Home {...localProps} />);
        expect(wrapper.find('.container.loading')).to.have.length(1);
    });
    it('Render - initialized', () => {
        const wrapper = mount(<Home {...props} />);
        expect(wrapper.find('.container')).to.have.length(1);
        expect(wrapper.find('.container.loading')).to.have.length(0);
    });
    it('Render Redux', () => {
        const wrapper = mount(<AppRedux {...props} />);
        expect(wrapper.find('ContextProvider')).to.have.length(1);
        expect(wrapper.find('HomeComponent')).to.have.length(1);
    });
    describe('Methods', () => {
        describe('onBtnClick', () => {
            it('inc', () => {
                const wrapper = mount(<Home {...props} />);
                wrapper.instance().onBtnClick('inc')();
                expect(wrapper.state().counter).to.equal(1);
            });
            it('dec', () => {
                const wrapper = mount(<Home {...props} />);
                wrapper.instance().onBtnClick('dec')();
                expect(wrapper.state().counter).to.equal(-1);
            });
            it('reset', () => {
                const wrapper = mount(<Home {...props} />);
                wrapper.instance().onBtnClick('inc')();
                wrapper.instance().onBtnClick('inc')();
                expect(wrapper.state().counter).to.equal(2);
                wrapper.instance().onBtnClick('reset')();
                expect(wrapper.state().counter).to.equal(0);
            });
        });
        it('goToPage1', () => {
            const wrapper = mount(<Home {...props} />);
            wrapper.instance().goToPage1();
            expect(props.historyPush.called).to.be.true;
        });
    });
});
