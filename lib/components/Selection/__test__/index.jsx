import React from 'react';
import * as sinon from 'sinon';
import '../../../tests';
import { expect } from 'chai';
import { createShallow /* , createMount */ } from '@material-ui/core/test-utils';
import Selection from '..';

React.useLayoutEffect = React.useEffect;
describe('Pagination', () => {
    let mount;
    // let deepMount;
    const props = {
        selectedAllOnPage: false,
        selectedOnPage: [],
        pageSize: 10,
        select: sinon.spy(),
        deselect: sinon.spy(),
        disabled: false,
        pageItems: [],
    };
    before(() => {
        mount = createShallow();
        // deepMount = createMount();
    });
    afterEach(() => {
        // Restore the default sandbox here
        sinon.restore();
    });
    describe('render', () => {
        it('General', () => {
            const wrapper = mount(<Selection {...props} />);
            expect(wrapper.find('.pagination-container')).to.have.length(1);
        });
    });
    describe('Event handlers', () => {
        it('open', () => {
            const wrapper = mount(<Selection {...props} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
        });
        it('close', () => {
            const wrapper = mount(<Selection {...props} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
            wrapper.instance().closeMenu()();
            expect(wrapper.state().openMenu).to.be.false;
        });
        it('select all', () => {
            const localProps = {
                ...props,
                select: sinon.spy(),
            };
            const wrapper = mount(<Selection {...localProps} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
            expect(localProps.select.calledOnce).to.be.false;
            wrapper.instance().selectAll();
            expect(localProps.select.calledOnce).to.be.true;
            expect(localProps.select.getCall(0).args[0]).to.equal('all');
            expect(wrapper.state().openMenu).to.be.false;
        });
        it('deselect all', () => {
            const localProps = {
                ...props,
                deselect: sinon.spy(),
            };
            const wrapper = mount(<Selection {...localProps} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
            expect(localProps.deselect.calledOnce).to.be.false;
            wrapper.instance().deselectAll();
            expect(localProps.deselect.calledOnce).to.be.true;
            expect(localProps.deselect.getCall(0).args[0]).to.equal('all');
            expect(wrapper.state().openMenu).to.be.false;
        });
        it('select page', () => {
            const localProps = {
                ...props,
                pageItems: [1, 2, 3, 4],
                select: sinon.spy(),
            };
            const wrapper = mount(<Selection {...localProps} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
            expect(localProps.select.calledOnce).to.be.false;
            wrapper.instance().selectPage();
            expect(localProps.select.calledOnce).to.be.true;
            expect(localProps.select.getCall(0).args[0]).to.deep.equal(localProps.pageItems);
            expect(wrapper.state().openMenu).to.be.false;
        });
        it('deselect page', () => {
            const localProps = {
                ...props,
                pageItems: [1, 3, 4],
                deselect: sinon.spy(),
            };
            const wrapper = mount(<Selection {...localProps} />);
            expect(wrapper.state().openMenu).to.be.false;
            wrapper.instance().openMenu()();
            expect(wrapper.state().openMenu).to.be.true;
            expect(localProps.deselect.calledOnce).to.be.false;
            wrapper.instance().deselectPage();
            expect(localProps.deselect.calledOnce).to.be.true;
            expect(localProps.deselect.getCall(0).args[0]).to.deep.equal(localProps.pageItems);
            expect(wrapper.state().openMenu).to.be.false;
        });
        describe('onCheckboxChange', () => {
            it('select', () => {
                const localProps = {
                    ...props,
                    selectedAllOnPage: false,
                    pageItems: [1, 2, 3, 4, 5],
                    select: sinon.spy(),
                };
                const wrapper = mount(<Selection {...localProps} />);
                wrapper.instance().onCheckboxChange();
                expect(localProps.select.getCall(0).args[0]).to.deep.equal(localProps.pageItems);
            });
            it('deselect', () => {
                const localProps = {
                    ...props,
                    selectedAllOnPage: true,
                    pageItems: [1, 3, 4],
                    deselect: sinon.spy(),
                };
                const wrapper = mount(<Selection {...localProps} />);
                wrapper.instance().onCheckboxChange();
                expect(localProps.deselect.getCall(0).args[0]).to.deep.equal(localProps.pageItems);
            });
        });
    });
});
