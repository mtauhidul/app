import { JSDOM } from 'jsdom';
import * as Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import jsdomGlobal from 'jsdom-global';

jsdomGlobal();
const jsdom = new JSDOM("<!doctype html><html data-console-log-level='error' data-io-log-level='error' ><body></body></html>");
const { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
class History {
    constructor() {
        this.store = [];
        this.location = {
            pathname: '',
        };
        this.listen = (param) => param;
        this.push = (item) => {
            this.store.push(item);
        };
        this.getLast = () => this.store.slice(-1).pop();
    }
}
class InterceptFunction {
    constructor() {
        this.list = [];
        this.getList = () => this.list;
        this.add = (str) => () => {
            this.list.push(str);
            return Promise.resolve(str);
        };
        this.reset = () => {
            this.list = [];
        };
    }
}
global.history = new History();
global.InterceptFunction = InterceptFunction;
class Storage {
    getItem(key) {
        return this[key] || null;
    }

    setItem(key, value) {
        this[key] = value;
    }

    removeItem(key) {
        delete this[key];
    }

    clear() {
        Object.keys(this).forEach((key) => delete this[key]);
    }
}
const sessionStorage = new Storage();
const btoa = (inp) => Buffer.from(inp).toString('base64');
const atob = (inp) => Buffer.from(inp, 'base64').toString();
Object.defineProperty(sessionStorage, 'sessionStorage', {
    value: sessionStorage, configurable: true, enumerable: true, writable: true,
});
Object.defineProperty(btoa, 'btoa', {
    value: btoa, configurable: true, enumerable: true, writable: true,
});
Object.defineProperty(atob, 'atob', {
    value: atob, configurable: true, enumerable: true, writable: true,
});
global.window.FHIR = {
    oauth2: {
        ready: (resolve, reject) => {
            resolve(null);
            reject();
        },
        settings: {
            fullSessionStorageSupport: true,
        },
    },
};
global.window.open = () => { };
global.atob = atob;
global.btoa = btoa;
global.sessionStorage = sessionStorage;
global.PUBLIC_PATH = '/';
global.__NODE_ENV__ = 'production';
global.__BUILD_ENV__ = 'test';
global.__ZIPKIN__ = 'http://zipking.example.com';
global.__Zipkin_API_V1__ = '/api/v1/spans';
global.__Zipkin_API_V2__ = '/api/v2/spans';
global.APP_VERSION = 'TEST';
global.APP_NAME = 'TEST_APP';
global.__APP_INFO__ = '';
global.__INTEROPIO_LOGGING_URL__ = '';
window.history.replaceState = () => { };
global.fetch = require('node-fetch');

global.interopion = {
    splashscreen: {
        done: () => { },
        hideSplashScreen: () => { },
        startLoading: () => { },
        errorLoading: () => { },
        show: () => { },
        progress: () => { },
        setUncaughtError: () => { },
        displayErrors: () => { },
    },
};
global.jsdom = jsdom;
Enzyme.configure({ adapter: new Adapter() });
