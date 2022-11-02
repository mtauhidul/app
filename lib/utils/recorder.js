import { getZipkinEndpoint } from './misc.jsx';

const { BatchRecorder, jsonEncoder: { JSON_V2 } } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');

const debug = typeof window !== 'undefined'
    ? window.location.search.includes('debug')
    : process.env.DEBUG;
// Send spans to Zipkin asynchronously over HTTP
const gethttpLogger = () => {
    const endpoint = getZipkinEndpoint();
    return new HttpLogger({
        endpoint,
        jsonEncoder: JSON_V2,
    });
};
export function recorder(serviceName) {
    return debug ? debugRecorder(serviceName) : new BatchRecorder({ logger: gethttpLogger() });
}
export const logSpan = (serviceName) => (span) => {
    const json = JSON_V2.encode(span);
    gethttpLogger().logSpan(span);
};
export function debugRecorder(serviceName) {
    // This is a hack that lets you see the data sent to Zipkin!
    const logger = {
        logSpan: logSpan(serviceName),
    };
    const batchRecorder = new BatchRecorder({ logger });
    // This is a hack that lets you see which annotations become which spans
    return ({
        record: (rec) => {
            const { spanId, traceId } = rec.traceId;
            batchRecorder.record(rec);
        },
    });
}
