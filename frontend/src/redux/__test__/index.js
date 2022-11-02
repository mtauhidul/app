import * as chai from 'chai';
import * as redux from '..';
import '../../../../../lib/tests';

const expect = chai.expect;
describe('Test redux', () => {
    it('Props exist', () => {
        expect(redux.appState).to.exist;
        expect(redux.default).to.exist;
        expect(redux.store.dispatch).to.exist;
        expect(redux.store.subscribe).to.exist;
        expect(redux.store.getState).to.exist;
        expect(redux.store.replaceReducer).to.exist;
    });
});
