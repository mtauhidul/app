// declare const $: any;
import * as chai from 'chai';
// import * as sinon from "sinon";
import '../../../../../lib/tests';
import fetchMock from 'fetch-mock';
import Logger from '../logger';

const expect = chai.expect;
const setLogLevels = (level) => () => {
    const htmlEl = document.getElementsByTagName('html')[0];
    const tempConsLog = htmlEl.getAttribute('data-console-log-level');
    const tempIoLog = htmlEl.getAttribute('data-io-log-level');
    htmlEl.setAttribute('data-tmp-console-log-level', tempConsLog);
    htmlEl.setAttribute('data-tmp-io-log-level', tempIoLog);
    htmlEl.setAttribute('data-console-log-level', level);
    htmlEl.setAttribute('data-io-log-level', level);
};
const resetLogLevels = () => {
    const htmlEl = document.getElementsByTagName('html')[0];
    htmlEl.setAttribute('data-console-log-level', htmlEl.getAttribute('data-tmp-console-log-level'));
    htmlEl.setAttribute('data-io-log-level', htmlEl.getAttribute('data-tmp-io-log-level'));
};
describe('Logger', () => {
    beforeEach(() => { });
    describe('window.onerror', () => {
        it('Error', (done) => {
            const parsedToken = Logger.parsedToken;
            const { accountId, environmentId, appId } = parsedToken;
            const URL = `${global.__INTEROPIO_LOGGING_URL__}/logging/apps/${accountId}/${environmentId}/${appId}/logs`;
            fetchMock
                .post(URL, { msg: 'onError - status' });
            window.onerror('msg', '...', '12', '12', 'err').then((res) => {
                fetchMock.restore();
                expect(res).to.deep.equal({ msg: 'onError - status' });
                done();
            });
        });
        it('Source', (done) => {
            const parsedToken = Logger.parsedToken;
            const { accountId, environmentId, appId } = parsedToken;
            const URL = `${global.__INTEROPIO_LOGGING_URL__}/logging/apps/${accountId}/${environmentId}/${appId}/logs`;
            fetchMock
                .post(URL, { msg: 'onError - status' });
            window.onerror('msg', '...', '12', '12').then((res) => {
                fetchMock.restore();
                expect(res).to.deep.equal({ msg: 'onError - status' });
                done();
            });
        });
        it('Error - multiple', (done) => {
            const parsedToken = Logger.parsedToken;
            const { accountId, environmentId, appId } = parsedToken;
            const URL = `${global.__INTEROPIO_LOGGING_URL__}/logging/apps/${accountId}/${environmentId}/${appId}/logs`;
            fetchMock
                .post(URL, { msg: 'onError - status' });
            window.onerror('msg', '...', '12', '12', 'err').then((res) => {
                fetchMock.restore();
                expect(res).to.deep.equal({ msg: 'onError - status' });
                done();
            });
            window.onerror('msg', '...', '12', '12', 'err').then((res) => {
                fetchMock.restore();
                expect(res).to.deep.equal({ msg: 'Already exists' });
                done();
            });
        });
    });
    it('window.onunhandledrejection', (done) => {
        const parsedToken = Logger.parsedToken;
        const { accountId, environmentId, appId } = parsedToken;
        const URL = `${global.__INTEROPIO_LOGGING_URL__}/logging/apps/${accountId}/${environmentId}/${appId}/logs`;
        fetchMock
            .post(URL, { msg: 'onError - promise' });
        window.onunhandledrejection({
            reason: {
                message: 'message',
                stack: 'stack',
            },
        }).then((res) => {
            fetchMock.restore();
            expect(res).to.deep.equal({ msg: 'onError - promise' });
            done();
        });
    });
    describe('Methods', () => {
        describe('_getLevels', () => {
            it('Untouched levels', () => {
                expect(Logger._getLevels()).to.deep.equal({ consoleLogLevel: 'error', ioLogLevel: 'error' });
            });
            it('Changed levels', () => {
                const htmlEl = document.getElementsByTagName('html')[0];
                const tempConsLog = htmlEl.getAttribute('data-console-log-level');
                const tempIoLog = htmlEl.getAttribute('data-io-log-level');
                htmlEl.setAttribute('data-console-log-level', 'silly');
                htmlEl.setAttribute('data-io-log-level', 'silly');
                expect(Logger._getLevels()).to.deep.equal({ consoleLogLevel: 'silly', ioLogLevel: 'silly' });
                htmlEl.setAttribute('data-console-log-level', tempConsLog);
                htmlEl.setAttribute('data-io-log-level', tempIoLog);
            });
            it('Default levels', () => {
                const htmlEl = document.getElementsByTagName('html')[0];
                const tempConsLog = htmlEl.getAttribute('data-console-log-level');
                const tempIoLog = htmlEl.getAttribute('data-io-log-level');
                htmlEl.setAttribute('data-console-log-level', '');
                htmlEl.setAttribute('data-io-log-level', '');
                expect(Logger._getLevels()).to.deep.equal({ consoleLogLevel: 'silent', ioLogLevel: 'silent' });
                htmlEl.setAttribute('data-console-log-level', tempConsLog);
                htmlEl.setAttribute('data-io-log-level', tempIoLog);
            });
        });
        describe('_parseToken', () => {
            it('Valid', () => {
                const tempToken = global.__APP_INFO__;
                global.__APP_INFO__ = '{ "accountId": "1", "environmentId": "1", "appId": "1" }';
                const parsed = Logger._parseToken();
                global.__APP_INFO__ = tempToken;
                expect(parsed).to.deep.equal({
                    accountId: '1',
                    environmentId: '1',
                    appId: '1',
                });
            });
            it('Invalid', () => {
                expect(Logger._parseToken()).to.deep.equal({
                    accountId: '_demoAcc',
                    environmentId: '_demoEnv',
                    appId: '_demoApp',
                });
            });
        });
        describe('_performLog', () => {
            describe('ConsoleLog - silly | iOLog - silly', () => {
                beforeEach(setLogLevels('silly'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - verbose | iOLog - verbose', () => {
                beforeEach(setLogLevels('verbose'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - info | iOLog - info', () => {
                beforeEach(setLogLevels('info'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - debug | iOLog - debug', () => {
                beforeEach(setLogLevels('debug'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - warn | iOLog - warn', () => {
                beforeEach(setLogLevels('warn'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - error | iOLog - error', () => {
                beforeEach(setLogLevels('error'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: true, ioLog: true });
                });
            });
            describe('ConsoleLog - silent | iOLog - silent', () => {
                beforeEach(setLogLevels('silent'));
                afterEach(resetLogLevels);
                it('silly', () => {
                    const result = Logger.silly('silly');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('verbose', () => {
                    const result = Logger.verbose('verbose');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('info', () => {
                    const result = Logger.info('info');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('debug', () => {
                    const result = Logger.debug('debug');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('warn', () => {
                    const result = Logger.warn('warn');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
                it('error', () => {
                    const result = Logger.error('error');
                    expect(result).to.deep.equal({ consoleLog: false, ioLog: false });
                });
            });
        });
    });
});
