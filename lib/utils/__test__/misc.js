// declare const $: any;
import '../../tests';
import * as chai from 'chai';
import * as sinon from 'sinon';
import {
    getDeepValue, queryStringParse, paramsToQuery, clearSession, delay,
} from '../misc';

const expect = chai.expect;
describe('misc', () => {
    afterEach(() => {
        // Restore the default sandbox here
        sinon.restore();
    });
    describe('delay', () => {
        it('Execute', () => {
            delay(1).then((r) => {
                expect(r).to.be.undefined;
            });
        });
    });
    describe('getDeepValue', () => {
        it('Path exists', () => {
            const structure = {
                one: {
                    two: {
                        three: {
                            four: 4,
                        },
                    },
                },
            };
            expect(getDeepValue(structure, 'one.two.three.four')).to.equal(structure?.one?.two?.three?.four);
        });
        it("Path doesn't exists", () => {
            const structure = {};
            expect(getDeepValue(structure, 'one.two.three.four')).to.be.undefined;
        });
    });
    describe('queryStringParse', () => {
        it('empty', () => {
            expect(queryStringParse()).to.deep.equal({ '': undefined });
        });
        it('search part of URL with Question Mark', () => {
            expect(queryStringParse('?a=1&b=2&c=3')).to.deep.equal({ a: '1', b: '2', c: '3' });
        });
        it('search part of URL without Question Mark', () => {
            expect(queryStringParse('a=1&b=2&c=3')).to.deep.equal({ a: '1', b: '2', c: '3' });
        });
        it('Full URL', () => {
            expect(queryStringParse('https://example.com/?a=1&b=2&c=3')).to.deep.equal({ a: '1', b: '2', c: '3' });
        });
    });
    describe('paramsToQuery', () => {
        it('empty', () => {
            expect(paramsToQuery()).to.equal('');
        });
        it('With unique params', () => {
            expect(paramsToQuery({ a: 1, b: 2, c: 3 })).to.equal('a=1&b=2&c=3');
        });
        it('With array param', () => {
            expect(paramsToQuery({
                a: 1, b: 2, c: 3, d: [4, 5, 6],
            })).to.equal('a=1&b=2&c=3&d=4,5,6');
        });
        it('With unique repeat params', () => {
            expect(paramsToQuery({ a___1: 1, a___2: 2, a___3: 3 })).to.equal('a=1&a=2&a=3');
        });
    });
    describe('clearSession', () => {
        it('Fill session and then clear', () => {
            const o = {
                appState: 'app',
                appStatePrefix: 'pref',
                appStateSuffix: 'suff',
                smartState: 'smart',
                smartStatePrefix: 'preff',
                smartStateSuffix: 'suff',
            };
            const appSessionKey = `${o.appStatePrefix}${o.appState}${o.appStateSuffix}`;
            const smartSessionKey = `${o.smartStatePrefix}${o.smartState}${o.smartStateSuffix}`;
            sessionStorage.setItem(appSessionKey, 'app');
            sessionStorage.setItem(smartSessionKey, 'smart');
            clearSession(o);
            expect(sessionStorage.getItem(appSessionKey)).to.be.null;
            expect(sessionStorage.getItem(smartSessionKey)).to.be.null;
        });
    });
});
