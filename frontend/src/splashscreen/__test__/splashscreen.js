import * as chai from 'chai';
import * as sinon from 'sinon';
import '../../../../../lib/tests';
import Splashscreen from '../splashscreen';

const expect = chai.expect;
const removeSplashScreen = () => {
    const splashscreenDivs = document.getElementsByClassName('interopion-splashscreen');
    if (splashscreenDivs && splashscreenDivs.length) {
        for (let i = 0; i < splashscreenDivs.length; i += 1) {
            const div = splashscreenDivs[i];
            div.remove();
        }
    }
};
describe('Splashscreen', () => {
    beforeEach(() => {
        removeSplashScreen();
    });
    it('Construct', () => {
        const result = new Splashscreen();
        expect(result.CONFIG.total).to.exist;
        expect(result.CONFIG.progress).to.exist;
        expect(result.CONFIG.showSplashScreen).to.exist;
        expect(result.CONFIG.$body).to.exist;
        expect(result.CONFIG.$splashDiv).to.exist;
        expect(result.CONFIG.$appName).to.exist;
        expect(result.CONFIG.$logoDiv).to.exist;
        expect(result.CONFIG.$loadingList).to.exist;
        expect(result.CONFIG.$loadingItem).to.exist;
        expect(result.CONFIG.$traceIdItem).to.exist;
        expect(result.CONFIG.$spinner).to.exist;
        expect(result.CONFIG.$launchButton).to.exist;
        expect(result.CONFIG.loadingList).to.exist;
        expect(result.CONFIG.$error).to.exist;
        expect(result.CONFIG.$traceId).to.exist;
        expect(result.CONFIG.splashScreenSelector).to.be.null;
        expect(result.CONFIG.logo).to.be.null;
        expect(result.CONFIG.name).to.exist;
        expect(result.CONFIG.splashScreenStyle).to.be.null;
        expect(result.CONFIG.autoHideAfter).to.be.null;
        expect(result.CONFIG.launch).to.be.null;
    });
    describe('Methods', () => {
        it('setUncaughtError', () => {
            const splashscreen = new Splashscreen();
            splashscreen.setUncaughtError();
            expect(splashscreen.uncaughtError).to.be.true;
        });
        describe('init', () => {
            it("Don't draw or autohide", (done) => {
                const splashscreen = new Splashscreen();
                const cfg = {
                    total: 4,
                    showSplashScreen: false,
                    autoHideAfter: 0,
                    splashScreenSelector: {
                        type: 'id',
                        value: 'splashscreen',
                    },
                    splashScreenStyle: {
                        'background-image': "url('/img/loading.png')",
                        'background-color': '#334D5B',
                        background: '#FFF',
                        color: '#222',
                    },
                    name: 'Frontend Launch',
                    logo: 'logo',
                };
                splashscreen.createSplashScreenDiv = sinon.spy();
                splashscreen.removeSplashScreenDiv = sinon.spy();
                splashscreen.init(cfg);
                expect(splashscreen.CONFIG.total).to.equal(4);
                expect(splashscreen.CONFIG.showSplashScreen).to.be.false;
                expect(splashscreen.CONFIG.autoHideAfter).to.equal(0);
                expect(splashscreen.CONFIG.splashScreenSelector).to.deep.equal({
                    type: 'id',
                    value: 'splashscreen',
                });
                expect(splashscreen.CONFIG.splashScreenStyle).to.deep.equal({
                    'background-image': "url('/img/loading.png')",
                    'background-color': '#334D5B',
                    background: '#FFF',
                    color: '#222',
                });
                expect(splashscreen.CONFIG.name).to.equal('Frontend Launch');
                expect(splashscreen.CONFIG.logo).to.equal('logo');
                expect(splashscreen.createSplashScreenDiv.called).to.be.false;
                expect(splashscreen.removeSplashScreenDiv.called).to.be.false;
                setTimeout(() => {
                    expect(splashscreen.removeSplashScreenDiv.called).to.be.false;
                    done();
                }, 1100);
            });
            it('Draw and Autohide', (done) => {
                const splashscreen = new Splashscreen();
                const cfg = {
                    total: 4,
                    showSplashScreen: true,
                    autoHideAfter: 200,
                    splashScreenSelector: {
                        type: 'id',
                        value: 'splashscreen',
                    },
                    splashScreenStyle: {
                        'background-image': "url('/img/loading.png')",
                        'background-color': '#334D5B',
                        background: '#FFF',
                        color: '#222',
                    },
                    name: 'Frontend Launch',
                    logo: 'logo',
                };
                splashscreen.createSplashScreenDiv = sinon.spy();
                splashscreen.removeSplashScreenDiv = sinon.spy();
                splashscreen.init(cfg);
                expect(splashscreen.CONFIG.total).to.equal(4);
                expect(splashscreen.CONFIG.showSplashScreen).to.be.true;
                expect(splashscreen.CONFIG.autoHideAfter).to.equal(200);
                expect(splashscreen.CONFIG.splashScreenSelector).to.deep.equal({
                    type: 'id',
                    value: 'splashscreen',
                });
                expect(splashscreen.CONFIG.splashScreenStyle).to.deep.equal({
                    'background-image': "url('/img/loading.png')",
                    'background-color': '#334D5B',
                    background: '#FFF',
                    color: '#222',
                });
                expect(splashscreen.CONFIG.name).to.equal('Frontend Launch');
                expect(splashscreen.CONFIG.logo).to.equal('logo');
                expect(splashscreen.createSplashScreenDiv.called).to.be.true;
                expect(splashscreen.removeSplashScreenDiv.called).to.be.false;
                setTimeout(() => {
                    expect(splashscreen.removeSplashScreenDiv.called).to.be.true;
                    done();
                }, 300);
            });
            it("Draw and don't autohide", (done) => {
                const splashscreen = new Splashscreen();
                const cfg = {
                    total: 4,
                    showSplashScreen: true,
                    autoHideAfter: 0,
                    splashScreenSelector: {
                        type: 'id',
                        value: 'splashscreen',
                    },
                    splashScreenStyle: {
                        'background-image': "url('/img/loading.png')",
                        'background-color': '#334D5B',
                        background: '#FFF',
                        color: '#222',
                    },
                    name: 'Frontend Launch',
                    logo: 'logo',
                };
                splashscreen.createSplashScreenDiv = sinon.spy();
                splashscreen.removeSplashScreenDiv = sinon.spy();
                splashscreen.init(cfg);
                expect(splashscreen.CONFIG.total).to.equal(4);
                expect(splashscreen.CONFIG.showSplashScreen).to.be.true;
                expect(splashscreen.CONFIG.autoHideAfter).to.equal(0);
                expect(splashscreen.CONFIG.splashScreenSelector).to.deep.equal({
                    type: 'id',
                    value: 'splashscreen',
                });
                expect(splashscreen.CONFIG.splashScreenStyle).to.deep.equal({
                    'background-image': "url('/img/loading.png')",
                    'background-color': '#334D5B',
                    background: '#FFF',
                    color: '#222',
                });
                expect(splashscreen.CONFIG.name).to.equal('Frontend Launch');
                expect(splashscreen.CONFIG.logo).to.equal('logo');
                expect(splashscreen.createSplashScreenDiv.called).to.be.true;
                expect(splashscreen.removeSplashScreenDiv.called).to.be.false;
                setTimeout(() => {
                    expect(splashscreen.removeSplashScreenDiv.called).to.be.false;
                    done();
                }, 1100);
            });
        });
        describe('createSplashScreenDiv', () => {
            it('Set selector', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    showSplashScreen: false,
                    splashScreenSelector: {
                        type: 'id',
                        value: 'splsh-id',
                    },
                });
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                expect(window.document.getElementById('splsh-id')).to.be.null;
                splashscreen.createSplashScreenDiv();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                expect(window.document.getElementById('splsh-id')).to.not.be.null;
            });
            it('Set styles', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    showSplashScreen: false,
                    splashScreenStyle: { color: 'red' },
                });
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                splashscreen.createSplashScreenDiv();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                expect(splashscreen.CONFIG.$splashDiv.css('color')).to.equal('red');
            });
            it('Without logo', () => {
                const splashscreen = new Splashscreen();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                splashscreen.createSplashScreenDiv();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
            });
            it('With logo and list', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    logo: '/img.png',
                    showSplashScreen: false,
                    $loadingList: $('<div id="loading-list"></div>'),
                    $spinner: $('<div id="spinner"></div>'),
                    $launchButton: $('<div id="launch-button"></div>'),
                });
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                splashscreen.createSplashScreenDiv();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
                expect(window.document.getElementsByTagName('img')).to.have.length(1);
                expect(window.document.getElementById('loading-list')).to.exist;
                expect(window.document.getElementById('spinner')).to.exist;
                expect(window.document.getElementById('launch-button')).to.exist;
            });
            it('Without list', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    showSplashScreen: false,
                    loadingList: [1],
                    $loadingList: $('<div id="loading-list"></div>'),
                    $spinner: $('<div id="spinner"></div>'),
                    $launchButton: $('<div id="launch-button"></div>'),
                });
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                splashscreen.createSplashScreenDiv();
                expect(window.document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
                expect(window.document.getElementsByTagName('img')).to.have.length(0);
                expect(window.document.getElementById('loading-list')).to.be.null;
                expect(window.document.getElementById('spinner')).to.be.null;
                expect(window.document.getElementById('launch-button')).to.be.null;
            });
        });
        it('show', (done) => {
            const splashscreen = new Splashscreen();
            splashscreen.CONFIG.$splashDiv.hide();
            expect(splashscreen.CONFIG.$splashDiv.css('display')).to.equal('none');
            splashscreen.show();
            setTimeout(() => {
                expect(splashscreen.CONFIG.$splashDiv.css('display')).to.not.equal('none');
                done();
            }, 350);
        });
        describe('done', () => {
            it("Hasn't uncaught error", (done) => {
                const splashscreen = new Splashscreen();
                splashscreen.CONFIG.$splashDiv.show();
                expect(splashscreen.CONFIG.$splashDiv.css('display')).to.not.equal('none');
                splashscreen.done();
                setTimeout(() => {
                    expect(splashscreen.CONFIG.$splashDiv.css('display')).to.equal('none');
                    done();
                }, 1100);
            });
            it('Has uncaught error', (done) => {
                const splashscreen = new Splashscreen();
                splashscreen.setUncaughtError();
                splashscreen.CONFIG.$splashDiv.show();
                expect(splashscreen.CONFIG.$splashDiv.css('display')).to.not.equal('none');
                splashscreen.done();
                setTimeout(() => {
                    expect(splashscreen.CONFIG.$splashDiv.css('display')).to.not.equal('none');
                    done();
                }, 1100);
            });
        });
        describe('shouldHideSpinner', () => {
            it("Hasn't list", (done) => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    loadingList: [],
                    $spinner: $('<div id="spinner"></div>'),
                });
                $('#spinner').show();
                expect(splashscreen.CONFIG.$spinner.css('display')).to.not.equal('none');
                splashscreen.shouldHideSpinner();
                setTimeout(() => {
                    expect(splashscreen.CONFIG.$spinner.css('display')).to.equal('none');
                    done();
                }, 1100);
            });
            it('Has list', (done) => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    loadingList: [1],
                    $spinner: $('<div id="spinner"></div>'),
                });
                $('#spinner').show();
                expect(splashscreen.CONFIG.$spinner.css('display')).to.not.equal('none');
                splashscreen.shouldHideSpinner();
                setTimeout(() => {
                    expect(splashscreen.CONFIG.$spinner.css('display')).to.not.equal('none');
                    done();
                }, 1100);
            });
        });
        it('removeSplashScreenDiv', () => {
            const splashscreen = new Splashscreen();
            splashscreen.init();
            expect(document.getElementsByClassName('interopion-splashscreen')).to.have.length(1);
            splashscreen.removeSplashScreenDiv();
            expect(document.getElementsByClassName('interopion-splashscreen')).to.have.length(0);
        });
        describe('Progress functionality', () => {
            it('Init Progress bar', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    total: 4,
                });
                splashscreen.initProgressBar();
                expect(window.document.getElementById('progress-bar')).to.exist;
                expect($('#progress-bar').css('width')).to.equal('0%');
            });
            it('Progress bar - progress', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    total: 4,
                });
                splashscreen.initProgressBar();
                expect(window.document.getElementById('progress-bar')).to.exist;
                expect($('#progress-bar').css('width')).to.equal('0%');
                splashscreen.progress();
                expect($('#progress-bar').css('width')).to.equal('25%');
                splashscreen.progress();
                expect($('#progress-bar').css('width')).to.equal('50%');
                splashscreen.progress();
                expect($('#progress-bar').css('width')).to.equal('75%');
                splashscreen.progress();
                expect($('#progress-bar').css('width')).to.equal('100%');
            });
        });
        describe('Launch Button functionality', () => {
            it('draw', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init();
                expect(splashscreen.CONFIG.$launchButton.css('display')).to.equal('none');
                splashscreen.drawLaunchButton();
                expect(splashscreen.CONFIG.$launchButton.css('display')).to.not.equal('none');
                expect(splashscreen.CONFIG.$spinner.css('display')).to.equal('none');
            });
            it('click', () => {
                const splashscreen = new Splashscreen();
                sessionStorage.setItem('item', '122');
                splashscreen.onLaunchClick('/launchURL?something=12')();
                expect(sessionStorage.getItem('item')).to.be.null;
            });
        });
        describe('startLoading', () => {
            it('Empty', () => {
                const splashscreen = new Splashscreen();
                expect(splashscreen.startLoading(null)).to.be.false;
            });
            it('With text', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.startLoading({ text: 'Loading something' });
                expect(itemId).to.have.lengthOf.at.least(19);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId} .text`).html()).to.equal('Loading something');
                expect(splashscreen.CONFIG.$spinner.css('display')).to.not.equal('none');
            });
        });
        describe('showTraceId', () => {
            it('Empty', () => {
                const splashscreen = new Splashscreen();
                expect(splashscreen.showTraceId(null)).to.be.false;
            });
            it('With text and trace', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.showTraceId({ traceId: 12, text: 'Loading something' });
                expect(itemId).to.have.lengthOf.at.least(19);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId} .text`).html()).to.equal('Loading something');
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId} .trace`).html()).to.equal('12');
                expect(splashscreen.CONFIG.$spinner.css('display')).to.equal('none');
            });
            it('With trace only', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.showTraceId({ traceId: 12 });
                expect(itemId).to.have.lengthOf.at.least(19);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId} .text`).html()).to.equal('');
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId} .trace`).html()).to.equal('12');
                expect(splashscreen.CONFIG.$spinner.css('display')).to.equal('none');
            });
        });
        describe('doneLoading', () => {
            it('Valid', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.startLoading({ text: 'Loading something' });
                splashscreen.doneLoading(itemId);
                const success = splashscreen.CONFIG.$loadingList.find(`#i${itemId}>.success`);
                expect(success).to.have.length(1);
                expect(success.css('display')).to.not.equal('none');
            });
            it('Invalid', () => {
                const splashscreen = new Splashscreen();
                const itemId = 1;
                splashscreen.doneLoading(itemId);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId}>.success`)).to.have.length(0);
            });
        });
        describe('errorLoading', () => {
            it('Valid', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.startLoading({ text: 'Loading something' });
                splashscreen.errorLoading(itemId);
                const error = splashscreen.CONFIG.$loadingList.find(`#i${itemId}>.error`);
                expect(error).to.have.length(1);
                expect(error.css('display')).to.not.equal('none');
            });
            it('Error message', () => {
                const splashscreen = new Splashscreen();
                const itemId = splashscreen.startLoading({ text: 'Loading something' });
                splashscreen.errorLoading(itemId, 'Special error message');
                const error = splashscreen.CONFIG.$loadingList.find(`#i${itemId}>.error`);
                expect(error).to.have.length(1);
                expect(error.css('display')).to.not.equal('none');
                expect(splashscreen.CONFIG.$splashDiv.find('.error-text').html()).to.equal('Special error message');
            });
            it('Invalid', () => {
                const splashscreen = new Splashscreen();
                const itemId = 1;
                splashscreen.errorLoading(itemId);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId}>.error`)).to.have.length(0);
            });
        });
        describe('removeLoadingItem', () => {
            it('Valid', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init();
                const itemId = splashscreen.startLoading({ text: 'Loading something' });
                const toBeRemoved = splashscreen.CONFIG.$loadingList.find(`#i${itemId}`);
                expect(toBeRemoved).to.have.length(1);
                splashscreen.removeLoadingItem(itemId);
                const removedNow = splashscreen.CONFIG.$loadingList.find(`#i${itemId}`);
                expect(removedNow).to.have.length(0);
            });
            it('Invalid', () => {
                const splashscreen = new Splashscreen();
                const itemId = 1;
                splashscreen.removeLoadingItem(itemId);
                expect(splashscreen.CONFIG.$loadingList.find(`#i${itemId}`)).to.have.length(0);
            });
        });
        it('Clear', () => {
            const splashscreen = new Splashscreen();
            splashscreen.init();
            splashscreen.startLoading({ text: 'Loading 1' });
            splashscreen.startLoading({ text: 'Loading 2' });
            splashscreen.startLoading({ text: 'Loading 3' });
            splashscreen.startLoading({ text: 'Loading 4' });
            expect(document.querySelectorAll('.interopion-splashscreen-loading-item')).to.have.length(4);
            splashscreen.clear();
            expect(document.querySelectorAll('.interopion-splashscreen-loading-item')).to.have.length(0);
        });
        describe('getColor', () => {
            it('Has color', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    splashScreenStyle: {
                        color: '#EEE',
                    },
                });
                expect(splashscreen.getColor()).to.equal('#EEE');
            });
            it('Has style, not color', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    splashScreenStyle: {},
                });
                expect(splashscreen.getColor()).to.equal('#000');
            });
            it('No style', () => {
                const splashscreen = new Splashscreen();
                splashscreen.init({
                    splashScreenStyle: null,
                });
                expect(splashscreen.getColor()).to.equal('#000');
            });
        });
    });
});
