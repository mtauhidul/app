// declare const $: any;
import '../../tests';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { debugRecorder, recorder, logSpan } from '../recorder';

const expect = chai.expect;
describe('recorder', () => {
    it('recorder()', () => {
        const result = recorder('test-service');
        expect(JSON.stringify(result)).to.equal('{"logger":{"_events":{},"_eventsCount":0,"log":{},"endpoint":"http://zipking.example.com/api/v2/spans","agent":null,"maxPayloadSize":0,"queue":[],"queueBytes":0,"jsonEncoder":{},"errorListenerSet":false,"headers":{"Content-Type":"application/json"},"timeout":0},"timeout":60000000,"partialSpans":{}}');
    });
    it('debugRecorder', () => {
        const result = debugRecorder('test-service');
        const rec = {
            annotation: 'note',
            traceId: {
                isDebug: sinon.spy(() => true),
                isShared: sinon.spy(() => true),
                spanId: '001-span',
                parentSpanId: {
                    ifPresent: () => { },
                },
                id: '001-trace',
            },
        };
        expect(JSON.stringify(result.record(rec))).to.be.undefined;
        expect(rec.traceId.isDebug.called).to.be.true;
        expect(rec.traceId.isShared.called).to.be.true;
    });
    it('logSpan', () => {
        const span = { tags: {}, annotations: ['note'], span: { 1: 2 } };
        const spy = sinon.spy(console, 'log');
        expect(spy.called).to.be.false;
        const result = logSpan('test-service')(span);
        expect(spy.called).to.be.true;
        spy.restore();
        expect(spy.args[0][0]).to.equal('test-service reporting: {"annotations":["note"]}');
        expect(result).to.be.undefined;
    });
});
