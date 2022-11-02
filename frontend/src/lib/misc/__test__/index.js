import * as chai from 'chai';
import * as misc from '..';
import '../../../../../../lib/tests';

const expect = chai.expect;
describe('Test lib/misc', () => {
    const jsdom = global.jsdom;
    describe('getAppState', () => {
        it('No state', () => {
            jsdom.reconfigure({ url: 'http://localhost' });
            expect(misc.getAppState()).to.be.undefined;
        });
        it('Has state', () => {
            jsdom.reconfigure({ url: 'http://localhost/appState0101/?state=123&test=001' });
            expect(misc.getAppState()).to.equal('appState0101');
        });
    });
    describe('getSMARTState', () => {
        it('Execute', () => {
            jsdom.reconfigure({ url: 'http://localhost/loc?state=123&test=001' });
            expect(misc.getSMARTState()).to.equal('123');
        });
    });
});
