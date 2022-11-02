import React from 'react';
import '../../../../../../lib/tests';
import { expect } from 'chai';
// import configStore from "./../../../../redux";
import { createShallow } from '@material-ui/core/test-utils';
import Footer from '..';

React.useLayoutEffect = React.useEffect;
// import { Provider } from "react-redux";
describe('Footer', () => {
    let mount;
    before(() => {
        mount = createShallow();
    });
    it('render', () => {
        const wrapper = mount(<Footer />);
        expect(wrapper.find('div')).to.have.length(1);
        expect(wrapper.find('footer')).to.have.length(1);
        expect(wrapper.find('strong')).to.have.length(1);
        expect(wrapper.find('a')).to.have.length(1);
    });
    describe('Methods', () => {
        describe('refFooter', () => {
            it('Changed', () => {
                const result = [];
                const props = {
                    ui: {
                        footerHeight: 10,
                    },
                    ui_SetFooterHeight: (i) => result.push(i),
                };
                const wrapper = mount(<Footer {...props} />);
                wrapper.instance().refFooter()({ offsetHeight: 13 });
                expect(result).to.deep.equal([13]);
            });
            it('Not Changed', () => {
                const result = [];
                const props = {
                    ui: {
                        footerHeight: 10,
                    },
                    ui_SetFooterHeight: (i) => result.push(i),
                };
                const wrapper = mount(<Footer {...props} />);
                wrapper.instance().refFooter()({ offsetHeight: 10 });
                expect(result).to.deep.equal([]);
            });
        });
    });
});
