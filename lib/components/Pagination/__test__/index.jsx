import React from 'react';
import * as sinon from 'sinon';
import '../../../tests';
import { expect } from 'chai';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import Pagination from '..';

React.useLayoutEffect = React.useEffect;
describe('Pagination', () => {
    let mount;
    let deepMount;
    const props = {
        pageSize: 10,
        loading: false,
        currentPage: 1,
        totalItems: 22,
        maxPages: 7,
        goToPage: sinon.spy(),
        setPageSize: sinon.spy(),
    };
    before(() => {
        mount = createShallow();
        deepMount = createMount();
    });
    afterEach(() => {
        // Restore the default sandbox here
        sinon.restore();
    });
    describe('render', () => {
        it('General', () => {
            const wrapper = mount(<Pagination {...props} />);
            expect(wrapper.find('.pagination-container')).to.have.length(1);
        });
        it('renderPageMoveButtons', () => {
            const wrapper = mount(<Pagination {...props} />);
            const buttons = deepMount(wrapper.instance().renderPageMoveButtons());
            expect(buttons.find('.MuiButtonBase-root')).to.have.length(2);
        });
        it('renderButton', () => {
            const wrapper = mount(<Pagination {...props} />);
            const button = deepMount(wrapper.instance().renderButton());
            expect(button.find('.MuiButtonBase-root')).to.have.length(1);
        });
    });
    describe('Methods', () => {
        describe('helpers', () => {
            it('getTotalPages', () => {
                const wrapper = mount(<Pagination {...props} />);
                expect(wrapper.instance().getTotalPages()).to.equal(3);
            });
        });
        describe('Event handlers', () => {
            it('renderSelectValue', () => {
                const wrapper = mount(<Pagination {...props} />);
                expect(deepMount(wrapper.instance().renderSelectValue()).find('span')).to.have.length(1);
            });
            it('goToPage', () => {
                const localProps = {
                    ...props,
                    goToPage: sinon.spy(),
                };
                const wrapper = mount(<Pagination {...localProps} />);
                wrapper.instance().openPagination();
                expect(wrapper.state().paginationOpen).to.be.true;
                wrapper.instance().goToPage(2)();
                expect(localProps.goToPage.calledOnce).to.be.true;
                expect(localProps.goToPage.getCall(0).args[0]).to.equal(2);
                expect(wrapper.state().paginationOpen).to.be.false;
            });
            it('setPageSize', () => {
                const localProps = {
                    ...props,
                    setPageSize: sinon.spy(),
                };
                const wrapper = mount(<Pagination {...localProps} />);
                wrapper.instance().openPagination();
                expect(wrapper.state().paginationOpen).to.be.true;
                wrapper.instance().setPageSize({ target: { value: 5 } });
                expect(localProps.setPageSize.calledOnce).to.be.true;
                expect(localProps.setPageSize.getCall(0).args[0]).to.equal(5);
                expect(wrapper.state().paginationOpen).to.be.false;
            });
            it('open', () => {
                const wrapper = mount(<Pagination {...props} />);
                expect(wrapper.state().paginationOpen).to.be.false;
                wrapper.instance().openPagination();
                expect(wrapper.state().paginationOpen).to.be.true;
            });
            it('close', () => {
                const wrapper = mount(<Pagination {...props} />);
                expect(wrapper.state().paginationOpen).to.be.false;
                wrapper.instance().openPagination();
                expect(wrapper.state().paginationOpen).to.be.true;
                wrapper.instance().closePagination();
                expect(wrapper.state().paginationOpen).to.be.false;
            });
            describe('movePage', () => {
                it('next', () => {
                    const localProps = {
                        ...props,
                        goToPage: sinon.spy(),
                    };
                    const wrapper = mount(<Pagination {...localProps} />);
                    wrapper.instance().movePage(1)();
                    expect(localProps.goToPage.calledOnce).to.be.true;
                    expect(localProps.goToPage.getCall(0).args[0]).to.equal(2);
                });
                it('previous', () => {
                    const localProps = {
                        ...props,
                        currentPage: 5,
                        totalItems: 220,
                        goToPage: sinon.spy(),
                    };
                    const wrapper = mount(<Pagination {...localProps} />);
                    wrapper.instance().movePage(-1)();
                    expect(localProps.goToPage.calledOnce).to.be.true;
                    expect(localProps.goToPage.getCall(0).args[0]).to.equal(4);
                });
                it('next beyond max', () => {
                    const localProps = {
                        ...props,
                        currentPage: 2,
                        totalItems: 11,
                        goToPage: sinon.spy(),
                    };
                    const wrapper = mount(<Pagination {...localProps} />);
                    wrapper.instance().movePage(1)();
                    expect(localProps.goToPage.calledOnce).to.be.true;
                    expect(localProps.goToPage.getCall(0).args[0]).to.equal(2);
                });
                it('next below min', () => {
                    const localProps = {
                        ...props,
                        goToPage: sinon.spy(),
                    };
                    const wrapper = mount(<Pagination {...localProps} />);
                    wrapper.instance().movePage(-1)();
                    expect(localProps.goToPage.calledOnce).to.be.true;
                    expect(localProps.goToPage.getCall(0).args[0]).to.equal(1);
                });
            });
        });
        describe('texts', () => {
            it('getPageText', () => {
                const wrapper = mount(<Pagination {...props} />);
                expect(wrapper.instance().getPageText()).to.equal('Page 1 of 3');
            });
            describe('getButtonText', () => {
                it('normal', () => {
                    const wrapper = mount(<Pagination {...props} />);
                    expect(wrapper.instance().getButtonText()).to.equal('1 - 11 of 22');
                });
                it('loading', () => {
                    const localProps = {
                        ...props,
                        loading: true,
                    };
                    const wrapper = mount(<Pagination {...localProps} />);
                    expect(wrapper.instance().getButtonText()).to.equal('');
                });
            });
        });
    });
});
