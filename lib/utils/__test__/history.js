// declare const $: any;
import '../../tests';
import * as chai from 'chai';
import { historyPush, historyReplace } from '../history';

const expect = chai.expect;
describe('lib/utils/history', () => {
    describe('historyPush', () => {
        it('With specified prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: [],
            };
            const prefix = 'prefix1';
            const paths = ['/newPath1', '/newPath2', '/newPath3'];
            paths.forEach((path) => {
                historyPush(path, props, prefix);
            });
            expect(props.history).to.deep.equal(paths.map((p) => `${prefix}${p}?state=123`));
        });
        it('With match prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: [],
                match: {
                    params: {
                        state: 'prefix2',
                    },
                },
            };
            const paths = ['/newPath1', '/newPath2', '/newPath3'];
            paths.forEach((path) => {
                historyPush(path, props);
            });
            expect(props.history).to.deep.equal(paths.map((p) => `prefix2${p}?state=123`));
        });
        it('Without prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: [],
            };
            const paths = ['/newPath1', '/newPath2', '/newPath3'];
            paths.forEach((path) => {
                historyPush(path, props);
            });
            expect(props.history).to.deep.equal(paths.map((p) => `${p}?state=123`));
        });
        it('Without prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {};
            const paths = ['/newPath1', '/newPath2', '/newPath3'];
            paths.forEach((path) => {
                historyPush(path, props);
            });
            expect(props.history).to.be.undefined;
        });
    });
    describe('historyReplace', () => {
        class History extends Object {
            constructor(props) {
                super(props);
                this.replace = (newValue) => {
                    this.value = newValue;
                };
                this.value = '';
            }
        }
        it('With specified prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: new History(),
            };
            const prefix = 'prefix1';
            const path = '/replacedPath';
            historyReplace(path, props, prefix);
            expect(props.history.value).to.equal(`${prefix}/replacedPath?state=123`);
        });
        it('With match prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: new History(),
                match: {
                    params: {
                        state: 'prefix2',
                    },
                },
            };
            const path = '/replacedPath';
            historyReplace(path, props);
            expect(props.history.value).to.equal('prefix2/replacedPath?state=123');
        });
        it('Without prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {
                history: new History(),
            };
            const path = '/replacedPath';
            historyReplace(path, props);
            expect(props.history.value).to.equal('/replacedPath?state=123');
        });
        it('Without prefix', () => {
            const jsdom = global.jsdom;
            jsdom.reconfigure({ url: 'http://localhost?state=123' });
            const props = {};
            const path = '/replacedPath';
            historyReplace(path, props);
            expect(props.history).to.be.undefined;
        });
    });
});
