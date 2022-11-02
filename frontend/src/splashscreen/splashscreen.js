import './splashscreen.less';
import copy from 'text-copy';
import { getAppState } from '../lib/misc';
import { mergeDeep } from '../../../lib/utils';
// Polyfill for remove() in IE
(function (arr) {
    arr.forEach((item) => {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            },
        });
    });
}([Element.prototype, CharacterData.prototype, DocumentType.prototype]));
// Polyfill for prepend() in IE
(function (arr) {
    arr.forEach((item) => {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                const argArr = Array.prototype.slice.call(arguments); const
                    docFrag = document.createDocumentFragment();
                argArr.forEach((argItem) => {
                    const isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });
                this.insertBefore(docFrag, this.firstChild);
            },
        });
    });
}([Element.prototype, Document.prototype, DocumentFragment.prototype]));
export default class Splashscreen extends Object {
    constructor(props) {
        super(props);
        this.CONFIG = {
            total: 0,
            progress: 0,
            showSplashScreen: true,
            $body: document.querySelector('body'),
            $splashDiv: document.createElement('div'),
            $appName: document.createElement('h1'),
            $logoDiv: document.createElement('div'),
            $loadingList: document.createElement('ul'),
            $loadingItem: document.createElement('li'),
            $traceIdItem: document.createElement('li'),
            $spinner: document.createElement('div'),
            $launchButton: document.createElement('div'),
            loadingList: [],
            $error: document.createElement('div'),
            $traceId: document.createElement('div'),
            splashScreenSelector: null,
            logo: null,
            name: '',
            splashScreenStyle: null,
            autoHideAfter: null,
            launch: null,
        };
        this.createTraceIdDiv = () => {
            this.CONFIG.$traceId.classList.add('trace-id-text');
            this.CONFIG.$traceId.classList.add('fade-in');
        };
        this.createSpinner = () => {
            // $spinner: $("<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>"),
            const divBounce1 = document.createElement('div');
            divBounce1.classList.add('bounce1');
            const divBounce2 = document.createElement('div');
            divBounce1.classList.add('bounce2');
            const divBounce3 = document.createElement('div');
            divBounce1.classList.add('bounce3');
            this.CONFIG.$spinner.classList.add('spinner');
            this.CONFIG.$spinner.appendChild(divBounce1);
            this.CONFIG.$spinner.appendChild(divBounce2);
            this.CONFIG.$spinner.appendChild(divBounce3);
        };
        this.createLogoEl = () => {
            const logoImg = document.createElement('img');
            logoImg.src = this.CONFIG.logo;
            logoImg.alt = this.CONFIG.name;
            this.CONFIG.$logoDiv.classList.add('interopion-splashscreen-logo');
            this.CONFIG.$logoDiv.appendChild(logoImg);
        };
        this.setLoadingListClasses = () => {
            this.CONFIG.$loadingList.classList.add('interopion-splashscreen-loading-list');
        };
        this.createLoadingItem = () => {
            this.CONFIG.$loadingItem.classList.add('interopion-splashscreen-loading-item');
            this.CONFIG.$loadingItem.classList.add('fade-in');
            const divSpinner = document.createElement('div');
            divSpinner.classList.add('item-spinner');
            const divSuccess = document.createElement('div');
            divSuccess.classList.add('success');
            const divError = document.createElement('div');
            divError.classList.add('error');
            const divText = document.createElement('div');
            divText.classList.add('text');
            this.CONFIG.$loadingItem.appendChild(divSpinner);
            this.CONFIG.$loadingItem.appendChild(divSuccess);
            this.CONFIG.$loadingItem.appendChild(divError);
            this.CONFIG.$loadingItem.appendChild(divText);
        };
        this.createLaunchButton = () => {
            this.CONFIG.$launchButton.classList.add('launch-button');
            this.CONFIG.$launchButton.textContent = ' Authenticate ';
        };
        this.createErrorDiv = () => {
            this.CONFIG.$error.classList.add('error-text');
            this.CONFIG.$error.classList.add('fade-in');
        };
        this.createAppNameDiv = () => {
            this.CONFIG.$appName.classList.add('interopion-splashscreen-app-name');
            this.CONFIG.$appName.innerText = this.CONFIG.name;
            this.CONFIG.$appName.style.color = this.getColor();
        };
        this.createProgressBarDiv = () => {
            const progressBarDiv = document.createElement('div');
            progressBarDiv.id = 'progress-bar';
            this.CONFIG.$loadingList.appendChild(progressBarDiv);
        };
        this.uncaughtError = false;
        this.appState = getAppState();
        this.createId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.fadeIn = (el) => {
            el.classList.add('fade-in-show');
            el.classList.remove('fade-in-hide');
            setTimeout(() => {
                el.style.display = 'block';
            }, 350);
        };
        this.fadeOut = (el) => {
            el.classList.add('fade-out-hide');
            el.classList.remove('fade-out-show');
            setTimeout(() => {
                el.style.display = 'none';
            }, 1000);
        };
        // Public methods -----------------------------------------------------------------------------
        this.setUncaughtError = () => this.uncaughtError = true;
        this.startLoading = (item) => {
            if (!item) {
                return false;
            }
            this.setLoadingListClasses();
            this.createLoadingItem();
            const $item = this.CONFIG.$loadingItem.cloneNode(true);
            const idx = this.createId;
            this.CONFIG.loadingList.push(idx);
            $item.id = `i${idx}`;
            $item.querySelector('.text') && ($item.querySelector('.text').innerHTML = item.text);
            $item.querySelector('.item-spinner') && ($item.querySelector('.item-spinner').style.backgroundColor = this.getColor());
            this.CONFIG.$loadingList.appendChild($item);
            this.CONFIG.$spinner.style.display = 'block';
            document.querySelectorAll('.spinner>div').forEach((item) => {
                item.style.backgroundColor = this.getColor();
            });
            document.querySelector('.item-spinner') && (document.querySelector('.item-spinner').style.backgroundColor = this.getColor());
            return idx;
        };
        this.showTraceId = (item) => {
            if (!item) {
                return false;
            }
            this.createTraceIdDiv();
            const $item = this.CONFIG.$traceIdItem.cloneNode(true);
            $item.querySelectorAll('svg').forEach((itm) => {
                itm.style.fill = this.getColor();
            });
            $item.querySelectorAll('.trace-btn').forEach((itm) => {
                itm.style.borderColor = this.getColor();
            });
            const idx = this.createId;
            this.CONFIG.loadingList.push(idx);
            $item.id = `i${idx}`;
            $item.querySelectorAll('.trace').forEach((itm) => {
                itm.textContent = item.traceId;
            });
            $item.querySelectorAll('.trace-btn').forEach((itm) => {
                itm.removeEventListener('click', () => { });
                itm.addEventListener('onclick', () => {
                    copy(item.traceId);
                });
            });
            if (!item.traceId) {
                $item.querySelectorAll('.trace-btn').forEach((itm) => {
                    itm.style.display = 'none';
                });
            }
            else {
                $item.querySelectorAll('.trace-btn').forEach((itm) => {
                    itm.style.display = 'block';
                });
            }
            $item.querySelectorAll('.text').forEach((itm) => {
                itm.textContent = item.text;
            });
            this.CONFIG.$loadingList.appendChild($item);
            this.CONFIG.$spinner.style.display = 'none';
            return idx;
        };
        this.initProgressBar = () => {
            this.createProgressBarDiv();
            const $progress = document.querySelector('#progress-bar');
            if ($progress) {
                $progress.style.width = '0%';
                $progress.style.height = '10px';
                $progress.style.background = this.getColor();
            }
        };
        this.progress = () => {
            const $progress = document.querySelector('#progress-bar');
            this.CONFIG.progress += 1;
            $progress.style.width = `${((this.CONFIG.progress / this.CONFIG.total) * 100)}%`;
        };
        this.doneLoading = (itemId) => {
            if (this.CONFIG.loadingList.includes(itemId)) {
                document.querySelector(`#i${itemId}>.item-spinner`).style.display = 'none';
                document.querySelector(`#i${itemId}>.success`).style.display = 'block';
                this.CONFIG.loadingList.splice(this.CONFIG.loadingList.indexOf(itemId), 1);
                this.shouldHideSpinner();
            }
        };
        this.errorLoading = (itemId, error) => {
            if (this.CONFIG.loadingList.includes(itemId)) {
                if (document.querySelector(`#i${itemId}>.item-spinner`)) {
                    document.querySelector(`#i${itemId}>.item-spinner`).style.display = 'none';
                }
                if (document.querySelector(`#i${itemId}>.error`)) {
                    document.querySelector(`#i${itemId}>.error`).style.display = 'block';
                }
                if (error) {
                    this.createErrorDiv();
                    this.CONFIG.$error.textContent = error;
                    this.CONFIG.$splashDiv.appendChild(this.CONFIG.$error);
                }
                this.CONFIG.loadingList.splice(this.CONFIG.loadingList.indexOf(itemId), 1);
                this.shouldHideSpinner();
            }
        };
        this.removeLoadingItem = (itemId) => {
            if (this.CONFIG.loadingList.includes(itemId)) {
                document.querySelector(`#i${itemId}`).remove();
                this.CONFIG.loadingList.splice(this.CONFIG.loadingList.indexOf(itemId), 1);
            }
        };
        this.show = () => {
            this.fadeIn(this.CONFIG.$splashDiv);
        };
        this.done = () => {
            this.displayErrors(this.appState);
            if (!this.uncaughtError) {
                this.fadeOut(this.CONFIG.$splashDiv);
            }
        };
        this.init = (_CONFIG) => {
            mergeDeep(this.CONFIG, _CONFIG);
            if (this.CONFIG.showSplashScreen) {
                this.createSplashScreenDiv();
                if (this.CONFIG.autoHideAfter) {
                    setTimeout(() => this.removeSplashScreenDiv(), this.CONFIG.autoHideAfter);
                }
            }
        };
        this.drawLaunchButton = () => {
            const launchURL = this.CONFIG.launch;
            this.CONFIG.$spinner.style.display = 'none';
            this.CONFIG.$launchButton.removeEventListener('onclick', () => { });
            this.CONFIG.$launchButton.addEventListener('onclick', this.onLaunchClick(launchURL));
            this.CONFIG.$launchButton.style.display = 'block';
        };
        this.clear = () => {
            if (document.querySelectorAll('.interopion-splashscreen-loading-item').length) {
                document.querySelectorAll('.interopion-splashscreen-loading-item').forEach((itm) => {
                    itm.remove();
                });
            }
            if (document.querySelectorAll('.interopion-splashscreen-trace-id').length) {
                document.querySelectorAll('.interopion-splashscreen-trace-id').forEach((itm) => {
                    itm.remove();
                });
            }
        };
        this.displayErrors = (appState) => {
            this.clear();
            const registeredErrors = `registeredErrors/${appState}`;
            const registered = JSON.parse(sessionStorage.getItem(registeredErrors) || '{}');
            const registeredKeys = Object.keys(registered);
            const errorTitleId = this.startLoading({
                text: 'Error occurred please try again in a few minutes.', // <br/>If error persists please report it to support using tracer id(s):`
            });
            this.errorLoading(errorTitleId, '');
            const shouldShowDetails = __BUILD_ENV__ === 'local' || __BUILD_ENV__ === 'dev' || __BUILD_ENV__ === 'development' || __BUILD_ENV__ === 'test' || __BUILD_ENV__ === 'uat';
            registeredKeys.forEach((key) => {
                const item = registered[key];
                this.showTraceId({
                    traceId: item.traceId,
                    text: shouldShowDetails ? `(${item.message})` : '',
                });
            });
            if (registeredKeys.length) {
                this.setUncaughtError();
                this.show();
            }
        };
        // Private methods ----------------------------------------------------------------------------
        this.getColor = () => (this.CONFIG.splashScreenStyle ? this.CONFIG.splashScreenStyle.color : '#000') || '#000';
        this.onLaunchClick = (launchURL) => () => {
            sessionStorage.clear();
            window.location.replace(launchURL);
        };
        this.createSplashScreenDiv = () => {
            this.CONFIG.$splashDiv.classList.add('interopion-splashscreen');
            if (this.CONFIG.splashScreenSelector) {
                this.CONFIG.$splashDiv[this.CONFIG.splashScreenSelector.type] = this.CONFIG.splashScreenSelector.value;
            }
            if (this.CONFIG.logo) {
                this.createLogoEl();
                this.CONFIG.$splashDiv.appendChild(this.CONFIG.$logoDiv);
            }
            this.createAppNameDiv();
            this.CONFIG.$splashDiv.appendChild(this.CONFIG.$appName);
            if (this.CONFIG.splashScreenStyle) {
                Object.keys(this.CONFIG.splashScreenStyle).forEach((key) => {
                    this.CONFIG.$splashDiv.style[key] = this.CONFIG.splashScreenStyle[key];
                });
            }
            this.CONFIG.$body.prepend(this.CONFIG.$splashDiv);
            if (this.CONFIG.loadingList.length === 0) {
                this.CONFIG.$splashDiv.appendChild(this.CONFIG.$loadingList);
                this.createSpinner();
                this.CONFIG.$splashDiv.appendChild(this.CONFIG.$spinner);
                this.createLaunchButton();
                this.CONFIG.$splashDiv.appendChild(this.CONFIG.$launchButton);
                this.CONFIG.$spinner.querySelectorAll('div').forEach((itm) => {
                    itm.style.backgroundColor = this.getColor();
                });
                this.CONFIG.$launchButton.style.display = 'none';
            }
        };
        this.shouldHideSpinner = () => {
            const thisConfig = this.CONFIG;
            setTimeout(() => {
                if (thisConfig.loadingList.length === 0) {
                    thisConfig.$spinner.style.display = 'none';
                }
            }, 1000);
        };
        this.removeSplashScreenDiv = () => {
            this.CONFIG.$splashDiv.remove();
        };
    }
}
window.interopion = window.interopion || {};
window.interopion.splashscreen = new Splashscreen();
