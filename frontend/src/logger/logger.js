import md5 from 'md5';
import * as UUID from 'uuid';
import { getAppState } from '../lib/misc';

let appState = getAppState();
if (!appState) {
    appState = UUID.v4();
    const search = window.location.search;
    window.history.replaceState(null, '', `/${appState}${search}`);
}
class iOLog extends Object {
    constructor(xAppState) {
        super();
        /**
         * Included log types at level
         */
        this._levels = [
            ['silly'],
            ['silly', 'verbose'],
            ['silly', 'verbose', 'info'],
            ['silly', 'verbose', 'info', 'debug'],
            ['silly', 'verbose', 'info', 'debug', 'warn'],
            ['silly', 'verbose', 'info', 'debug', 'warn', 'error'],
            [], // silent level
        ];
        // Logged statements will appear only for a silly logging level environment
        this.silly = (...args) => this._performLog(args, this._levels[0], { _console: 'log', _io: 'DEBUG' });
        // Logged statements will appear only for verbose and silly logging level environment
        this.verbose = (...args) => this._performLog(args, this._levels[1], { _console: 'log', _io: 'DEBUG' });
        // Logged statements will appear only for info, verbose and silly logging level environment
        this.info = (...args) => this._performLog(args, this._levels[2], { _console: 'info', _io: 'INFO' });
        // Logged statements will appear only for debug, info, verbose and silly logging level environment
        this.debug = (...args) => this._performLog(args, this._levels[3], { _console: 'debug', _io: 'DEBUG' });
        // Logged statements will appear only for warn, debug, info, verbose and silly logging level environment
        this.warn = (...args) => this._performLog(args, this._levels[4], { _console: 'warn', _io: 'WARN' });
        // Logged statements will appear only for error, warn, debug, info, verbose and silly logging level environment
        this.error = (...args) => this._performLog(args, this._levels[5], { _console: 'error', _io: 'ERROR' });
        // Logged statements will never appear in any log (included for completeness)
        this.silent = (...args) => this._performLog(args, this._levels[6], { _console: 'log', _io: 'ERROR' });
        this._registerInSesssion = (registered, hash, registeredErrors, errorObj) => {
            const {
                message, source, lineno, colno, error, traceId,
            } = errorObj;
            registered[hash] = {
                traceId,
                count: 1,
                message,
                source,
                lineno,
                colno,
                error,
            };
            sessionStorage.setItem(registeredErrors, JSON.stringify(registered));
        };
        this._logPayload = (payload, level = 'INFO') => {
            const { accountId, environmentId, appId } = this.parsedToken;
            const URL = `${__INTEROPIO_LOGGING_URL__}/logging/apps/${accountId}/${environmentId}/${appId}/logs`;
            const appInfoType = 'bearer';
            let body;
            if (payload.length === 1) {
                body = JSON.stringify(payload[0]);
            }
            else {
                body = JSON.stringify(payload);
            }
            const content = {
                accountId,
                appId,
                body,
                containsPhi: false,
                environmentId,
                httpErrorCode: 400,
                ipAddress: '-',
                labels: '-',
                logLevel: level,
                metadata: JSON.stringify({ path: window.location.href.split('?')[0] }),
                userAgent: navigator.userAgent,
            };
            const accessToken = this.getAccessToken();
            const options = {
                method: 'POST',
                body: JSON.stringify(content),
                headers: {
                    Authorization: `${appInfoType} ${accessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            return new Promise((resolve) => {
                fetch(URL, options)
                    .then((r) => r.json())
                    .then((r) => resolve(r))
                    .catch((r) => resolve({}));
            });
        };
        this._displayErrors = (localAppState) => interopion.splashscreen.displayErrors(localAppState);
        this._postError = (errorObj) => {
            interopion.splashscreen.setUncaughtError();
            const registeredErrors = `registeredErrors/${this._appState}`;
            const hash = md5(JSON.stringify(errorObj));
            const registered = JSON.parse(sessionStorage.getItem(registeredErrors) || '{}');
            const list = Object.keys(registered);
            if (list.includes(hash)) {
                registered[hash].count += 1;
                sessionStorage.setItem(registeredErrors, JSON.stringify(registered));
                this._displayErrors(this._appState);
                return Promise.resolve({ msg: 'Already exists' });
            }
            const {
                message, source, lineno, colno,
            } = errorObj;
            const postedError = [
                message ? `MSG:  ${message}` : null,
                source ? `SRC:  ${source}` : null,
                lineno ? `LN#:  ${lineno}` : null,
                colno ? `COL#: ${colno}` : null,
            ]
                .filter((i) => !!i)
                .join('\n');
            const { accountId, environmentId, appId } = this.parsedToken;
            return this._interopioLogReporter(errorObj, registered, registeredErrors, hash, postedError, accountId, appId, environmentId);
        };
        this._interopioLogReporter = (errorObj, registered, registeredErrors, hash, postedError, accountId, appId, environmentId) => {
            const reportPromise = logger._logPayload(postedError, 'ERROR');
            return reportPromise.then((res) => {
                errorObj.traceId = res.id;
                this._registerInSesssion(registered, hash, registeredErrors, errorObj);
                this._displayErrors(this._appState);
                return res;
            });
        };
        /**
         * Parse and put into a local variable the __APP_INFO__
         */
        this._parseToken = () => {
            try {
                return JSON.parse(__APP_INFO__);
            }
            catch (_e) {
                console.error('No valid logging token parsed');
                // Use demo values if parsing fails
                return { accountId: '_demoAcc', environmentId: '_demoEnv', appId: '_demoApp' };
            }
        };
        /**
         * Get the current logging levels for console logging and interopiO logging
         */
        this._getLevels = () => ({
            consoleLogLevel: document.getElementsByTagName('html')[0].getAttribute('data-console-log-level') || 'silent',
            ioLogLevel: document.getElementsByTagName('html')[0].getAttribute('data-io-log-level') || 'silent',
        });
        this._performLog = (args, allowed, logTypes = null) => {
            const { consoleLogLevel, ioLogLevel } = this._getLevels();
            const { _console, _io } = logTypes || {};
            const result = { consoleLog: false, ioLog: false };
            if (allowed.includes(consoleLogLevel)) {
                console[_console](...args);
                result.consoleLog = true;
            }
            if (allowed.includes(ioLogLevel)) {
                this._logPayload(args, _io);
                result.ioLog = true;
            }
            return result;
        };
        this.getAccessToken = () => {
            if (this.accessToken) {
                return this.accessToken;
            }
            const params = this._getParams();
            const state = params.state || '';
            this.accessToken = JSON.parse(sessionStorage.getItem(state))?.tokenResponse?.access_token;
            return this.accessToken;
        };
        this._getParams = () => {
            const params = {};
            window.location.search.slice(1).split('&').forEach((i) => {
                const entries = i.split('=');
                params[entries[0]] = entries[1];
            });
            return params;
        };
        this._appState = xAppState;
        this.parsedToken = this._parseToken();
    }
}
const logger = new iOLog(appState);
// Capture and log any unhadnled exceptions
window.onerror = (message, _source, lineno, colno, error) => {
    const source = error ? error.stack : _source;
    return logger._postError({
        message,
        source,
        lineno,
        colno,
    });
};
// Capture and log any unhandled promise rejections
window.onunhandledrejection = (e) => {
    const message = e.reason.message;
    const source = e.reason.stack;
    return logger._postError({ message, source });
};
window.interopion = window.interopion || {};
window.interopion.log = logger;
export default logger;
