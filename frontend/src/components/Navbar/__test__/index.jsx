import React from 'react';
import '../../../../../../lib/tests';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createShallow } from '@material-ui/core/test-utils';
import { Navbar, NavbarConnected } from '..';

React.useLayoutEffect = React.useEffect;
describe('Navbar', () => {
    let mount;
    before(() => {
        mount = createShallow();
    });
    it('Render with store context', () => {
        const props = {};
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);
        const store = mockStore({ reduxStore: 1 });
        const wrapper = mount(<NavbarConnected store={store} {...props} />);
        expect(wrapper.find('ContextProvider')).to.have.length(1);
        expect(wrapper.find('NavbarComponent')).to.have.length(1);
        expect(wrapper.props().children.props.reduxStore).to.equal(1);
    });
    it('render', () => {
        const wrapper = mount(<Navbar history={{}} getAppState={() => '001'} />);
        expect(wrapper.find('nav')).to.have.length(1);
        expect(wrapper.find('div')).to.have.length(3);
        expect(wrapper.find('h1')).to.have.length(1);
    });
});
