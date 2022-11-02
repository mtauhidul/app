import { expect } from 'chai';
// import * as sinon from "sinon";
// import "./../../../../../lib/tests";
import * as types from '../types';
import * as ac from '../fhir';

describe('fhir Redux Action Creators', () => {
    describe('fhir_Reset(): reduxAction', () => {
        it('returns a Redux action object', () => {
            expect(ac.fhir_Reset()).to.deep.equal({
                type: types.FHIR_RESET,
            });
        });
    });
    describe('fhir_SetContext(context): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.fhir_SetContext('context')).to.deep.equal({
                type: types.FHIR_SET_CONTEXT,
                payload: 'context',
            });
        });
    });
    describe('fhir_SetMeta(meta): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.fhir_SetMeta('meta')).to.deep.equal({
                type: types.FHIR_SET_META,
                payload: 'meta',
            });
        });
    });
    describe('fhir_SetParsedPatientDemographics(patient): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.fhir_SetParsedPatientDemographics('patient')).to.deep.equal({
                type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
                payload: 'patient',
            });
        });
    });
    describe('fhir_SetSampleData(): reduxAction', () => {
        it('returns a Redux action object', () => {
            expect(ac.fhir_SetSampleData()).to.deep.equal({
                type: types.FHIR_SET_SAMPLE_DATA,
            });
        });
    });
    describe('fhir_SetSmart(smart): reduxAction', () => {
        it('returns a Redux action object with payload', () => {
            expect(ac.fhir_SetSmart('smart')).to.deep.equal({
                type: types.FHIR_SET_SMART,
                payload: 'smart',
            });
        });
    });
});
