import '../../tests';
import * as chai from 'chai';
import fetchMock from 'fetch-mock';
import { mergeDeep } from '..';
import {
    findMRNIdentifier, getPatientDemographics, getPatientMRN, getPatientName, getFHIRMetadata, parseNames, parseTelecom, parseAddress, fhirQuery, drain, fetchData, fetchWrapper, hasSearchCapability,
} from '../fhir';

const expect = chai.expect;
describe('lib/utils/fhir', () => {
    describe('hasSearchCapability()', () => {
        it('Single resource check', () => {
            const result = hasSearchCapability([
                {
                    type: 'MedicationOrder',
                    profile: {
                        reference: 'http://hl7.org/fhir/profiles/MedicationOrder',
                    },
                    interaction: [
                        {
                            code: 'read',
                        },
                        {
                            code: 'vread',
                        },
                        {
                            code: 'update',
                        },
                        {
                            code: 'delete',
                        },
                        {
                            code: 'history-instance',
                        },
                        {
                            code: 'history-type',
                        },
                        {
                            code: 'create',
                        },
                        {
                            code: 'search-type',
                        },
                    ],
                    conditionalCreate: true,
                    conditionalUpdate: true,
                    conditionalDelete: 'multiple',
                    searchInclude: [
                        '*',
                        'MedicationOrder:encounter',
                        'MedicationOrder:medication',
                        'MedicationOrder:patient',
                        'MedicationOrder:prescriber',
                    ],
                    searchParam: [
                        {
                            name: '_content',
                            type: 'string',
                            documentation: "Search the contents of the resource's data using a fulltext search",
                        },
                        {
                            name: '_has',
                            type: 'string',
                            documentation: 'Return resources linked to by the given target',
                        },
                        {
                            name: '_id',
                            type: 'string',
                            documentation: 'The ID of the resource',
                        },
                        {
                            name: '_language',
                            type: 'string',
                            documentation: 'The language of the resource',
                        },
                        {
                            name: '_lastUpdated',
                            type: 'date',
                            documentation: 'Only return resources which were last updated as specified by the given range',
                        },
                        {
                            name: '_profile',
                            type: 'uri',
                            documentation: 'Search for resources which have the given profile',
                        },
                        {
                            name: '_security',
                            type: 'token',
                            documentation: 'Search for resources which have the given security labels',
                        },
                        {
                            name: '_tag',
                            type: 'token',
                            documentation: 'Search for resources which have the given tag',
                        },
                        {
                            name: '_text',
                            type: 'string',
                            documentation: "Search the contents of the resource's narrative using a fulltext search",
                        },
                        {
                            name: 'code',
                            type: 'token',
                            documentation: 'Return administrations of this medication code',
                        },
                        {
                            name: 'datewritten',
                            type: 'date',
                            documentation: 'Return prescriptions written on this date',
                        },
                        {
                            name: 'encounter',
                            type: 'reference',
                            documentation: 'Return prescriptions with this encounter identifier',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'identifier',
                            type: 'token',
                            documentation: 'Return prescriptions with this external identifier',
                        },
                        {
                            name: 'medication',
                            type: 'reference',
                            documentation: 'Return administrations of this medication reference',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'patient',
                            type: 'reference',
                            documentation: 'The identity of a patient to list orders  for',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'prescriber',
                            type: 'reference',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'status',
                            type: 'token',
                            documentation: 'Status of the prescription',
                        },
                    ],
                },
            ], 'MedicationOrder', 'code');
            expect(result).to.deep.equal({ code: true });
        });
        it('Multi-resource check', () => {
            const result = hasSearchCapability([
                {
                    type: 'MedicationOrder',
                    profile: {
                        reference: 'http://hl7.org/fhir/profiles/MedicationOrder',
                    },
                    interaction: [
                        {
                            code: 'read',
                        },
                        {
                            code: 'vread',
                        },
                        {
                            code: 'update',
                        },
                        {
                            code: 'delete',
                        },
                        {
                            code: 'history-instance',
                        },
                        {
                            code: 'history-type',
                        },
                        {
                            code: 'create',
                        },
                        {
                            code: 'search-type',
                        },
                    ],
                    conditionalCreate: true,
                    conditionalUpdate: true,
                    conditionalDelete: 'multiple',
                    searchInclude: [
                        '*',
                        'MedicationOrder:encounter',
                        'MedicationOrder:medication',
                        'MedicationOrder:patient',
                        'MedicationOrder:prescriber',
                    ],
                    searchParam: [
                        {
                            name: '_content',
                            type: 'string',
                            documentation: "Search the contents of the resource's data using a fulltext search",
                        },
                        {
                            name: '_has',
                            type: 'string',
                            documentation: 'Return resources linked to by the given target',
                        },
                        {
                            name: '_id',
                            type: 'string',
                            documentation: 'The ID of the resource',
                        },
                        {
                            name: '_language',
                            type: 'string',
                            documentation: 'The language of the resource',
                        },
                        {
                            name: '_lastUpdated',
                            type: 'date',
                            documentation: 'Only return resources which were last updated as specified by the given range',
                        },
                        {
                            name: '_profile',
                            type: 'uri',
                            documentation: 'Search for resources which have the given profile',
                        },
                        {
                            name: '_security',
                            type: 'token',
                            documentation: 'Search for resources which have the given security labels',
                        },
                        {
                            name: '_tag',
                            type: 'token',
                            documentation: 'Search for resources which have the given tag',
                        },
                        {
                            name: '_text',
                            type: 'string',
                            documentation: "Search the contents of the resource's narrative using a fulltext search",
                        },
                        {
                            name: 'code',
                            type: 'token',
                            documentation: 'Return administrations of this medication code',
                        },
                        {
                            name: 'datewritten',
                            type: 'date',
                            documentation: 'Return prescriptions written on this date',
                        },
                        {
                            name: 'encounter',
                            type: 'reference',
                            documentation: 'Return prescriptions with this encounter identifier',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'identifier',
                            type: 'token',
                            documentation: 'Return prescriptions with this external identifier',
                        },
                        {
                            name: 'medication',
                            type: 'reference',
                            documentation: 'Return administrations of this medication reference',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'patient',
                            type: 'reference',
                            documentation: 'The identity of a patient to list orders  for',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'prescriber',
                            type: 'reference',
                            chain: [
                                '*',
                            ],
                        },
                        {
                            name: 'status',
                            type: 'token',
                            documentation: 'Status of the prescription',
                        },
                    ],
                },
            ], 'MedicationOrder', ['code', 'status', 'unavailable']);
            expect(result).to.deep.equal({ code: true, status: true });
        });
    });
    describe('fetchWrapper()', () => {
        it('Single traced query', (done) => {
            global.__BUILD_ENV__ = 'dev';
            fetchMock
                .get('http://example.com/testing', { hello: 'world' });
            fetchWrapper('http://example.com/testing')
                .then((res) => res.json())
                .then((res) => {
                    fetchMock.restore();
                    expect(res).to.deep.equal({ hello: 'world' });
                    global.__BUILD_ENV__ = 'test';
                    done();
                });
        });
        it('Multiple traced queries', (done) => {
            global.__BUILD_ENV__ = 'dev';
            fetchMock
                .get('http://example.com/1', { hello: '1' });
            fetchMock
                .get('http://example.com/2', { hello: '2' });
            fetchMock
                .get('http://example.com/3', { hello: '3' });
            Promise.all([
                fetchWrapper('http://example.com/1').then((res) => res.json()),
                fetchWrapper('http://example.com/2').then((res) => res.json()),
                fetchWrapper('http://example.com/3').then((res) => res.json()),
            ])
                .then((res) => {
                    fetchMock.restore();
                    expect(res).to.deep.equal([
                        { hello: '1' },
                        { hello: '2' },
                        { hello: '3' },
                    ]);
                    global.__BUILD_ENV__ = 'test';
                    done();
                });
        });
    });
    describe('findMRNIdentifier()', () => {
        it('With null param', () => {
            expect(() => findMRNIdentifier(null)).to.throw(TypeError);
        });
        it('With valid param', () => {
            const validParam = [
                {
                    use: 'usual',
                    type: {
                        coding: [
                            {
                                system: 'http://hl7.org/fhir/v2/0203',
                                code: 'MR',
                                display: 'Medical record number',
                            },
                        ],
                        text: 'Medical record number',
                    },
                    system: 'http://hospital.smarthealthit.org',
                    value: '621799',
                },
                {
                    use: 'usual',
                    type: {
                        coding: [
                            {
                                system: 'padding',
                                code: 'ID',
                                display: 'Padding',
                            },
                        ],
                        text: 'Padding',
                    },
                    system: 'http://hospital.smarthealthit.org',
                    value: 'PADDING',
                },
            ];
            expect(findMRNIdentifier(validParam)).to.deep.equal({
                use: 'usual',
                type: {
                    coding: [
                        {
                            system: 'http://hl7.org/fhir/v2/0203',
                            code: 'MR',
                            display: 'Medical record number',
                        },
                    ],
                    text: 'Medical record number',
                },
                system: 'http://hospital.smarthealthit.org',
                value: '621799',
            });
        });
    });
    describe('getPatientDemographics()', () => {
        it('valid', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: true,
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
                telecom: [
                    {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                ],
                gender: 'male',
                birthDate: '1961-09-18',
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return getPatientDemographics(smart).then((patient) => {
                fetchMock.restore();
                expect(patient).to.deep.equal({
                    smartId: 'SMART-621799',
                    birthDate: '1961-09-18',
                    gender: 'male',
                    MRN: '621799',
                    name: 'Joshua U. Diaz',
                    address: [{ use: 'home', val: '26 River Ave Tulsa OK 74116 USA' }],
                    email: [{ use: undefined, val: 'joshua.diaz@example.com' }],
                    names: [{ use: 'official', val: 'Joshua U. Diaz' }],
                    phone: [{ use: 'mobile', val: '800-634-6479' }],
                });
            });
        });
        it('not active', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: false,
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
                telecom: [
                    {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                ],
                gender: 'male',
                birthDate: '1961-09-18',
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return new Promise((resolve) => getPatientDemographics(smart).catch((error) => {
                fetchMock.restore();
                expect(error.message).to.equal('This patient is not active');
                resolve(null);
            }));
        });
        it('no birthdate', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: true,
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
                telecom: [
                    {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                ],
                gender: 'male',
                birthDate: null,
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return new Promise((resolve) => getPatientDemographics(smart).catch((error) => {
                fetchMock.restore();
                expect(error.message).to.equal('Patient birthDate is required');
                resolve(null);
            }));
        });
        it('no gender', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: true,
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
                telecom: [
                    {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                ],
                gender: null,
                birthDate: '1961-09-18',
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return new Promise((resolve) => getPatientDemographics(smart).catch((error) => {
                fetchMock.restore();
                expect(error.message).to.equal('Patient gender is required');
                resolve(null);
            }));
        });
        it('no name', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: true,
                telecom: [
                    {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                ],
                gender: 'male',
                birthDate: '1961-09-18',
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return new Promise((resolve) => getPatientDemographics(smart).catch((error) => {
                fetchMock.restore();
                expect(error.message).to.equal('Patient name is required');
                resolve(null);
            }));
        });
        it('no patient', () => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {};
            fetchMock
                .get(url, response);
            const smart = {
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            return new Promise((resolve) => getPatientDemographics(smart).then((error) => {
                fetchMock.restore();
                expect(error).to.be.null;
                resolve(null);
            }));
        });
        it('parse error', (done) => {
            const url = 'https://example.com/FHIR/Patient/SMART-621799';
            const response = {
                resourceType: 'Patient',
                id: 'SMART-621799',
                meta: {
                    versionId: '3',
                    lastUpdated: '2018-01-31T22:33:49.000+00:00',
                },
                text: {
                    status: 'generated',
                    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n        <p>Joshua Diaz</p>\n      </div>',
                },
                identifier: [
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                    display: 'Medical record number',
                                },
                            ],
                            text: 'Medical record number',
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: '621799',
                    },
                ],
                active: true,
                name: [{
                    error: 'Error would be here!',
                }],
                telecom: {
                    11: {
                        system: 'phone',
                        value: '800-634-6479',
                        use: 'mobile',
                    },
                    22: {
                        system: 'email',
                        value: 'joshua.diaz@example.com',
                    },
                },
                gender: 'male',
                birthDate: '1961-09-18',
                address: [
                    {
                        use: 'home',
                        line: [
                            '26 River Ave',
                        ],
                        city: 'Tulsa',
                        state: 'OK',
                        postalCode: '74116',
                        country: 'USA',
                    },
                ],
            };
            fetchMock
                .get(url, response);
            const smart = {
                patient: {
                    id: 'SMART-621799',
                },
                state: {
                    serverUrl: 'https://example.com/FHIR',
                },
            };
            getPatientDemographics(smart).catch((error) => {
                expect(`${error}`).to.equal('TypeError: telecom.filter is not a function');
                fetchMock.restore();
                done();
            });
        });
    });
    describe('getPatientMRN()', () => {
        it('Invalid identifier #1', () => {
            const patient = {
                identifier: null,
            };
            expect(getPatientMRN(patient)).to.equal(null);
        });
        it('Invalid identifier #2', () => {
            const patient = {
                identifier: [{}, {}],
            };
            expect(getPatientMRN(patient)).to.equal(undefined);
        });
        it('Valid MRN', () => {
            const patient = {
                identifier: [
                    {},
                    {
                        use: 'usual',
                        type: {
                            coding: [
                                {
                                    system: 'http://hl7.org/fhir/v2/0203',
                                    code: 'MR',
                                },
                            ],
                        },
                        system: 'http://hospital.smarthealthit.org',
                        value: 'MRN-00011',
                    },
                ],
            };
            expect(getPatientMRN(patient)).to.equal('MRN-00011');
        });
        it('SMART Contect MRN', () => {
            const patient = {};
            const smart = {
                tokenResponse: {
                    'patient-mrn': 'MRN-00012',
                },
            };
            expect(getPatientMRN(patient, smart)).to.equal('MRN-00012');
        });
    });
    describe('getPatientName()', () => {
        it('Empty', (done) => {
            expect(getPatientName([])).to.equal('');
            done();
        });
        it('Simple name', (done) => {
            const patient = {
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('Joshua U. Diaz');
            done();
        });
        it('Multiple names name #1', (done) => {
            const patient = {
                name: [
                    {
                        use: 'nickname',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                    {
                        use: 'official',
                        family: [
                            'Smith',
                        ],
                        given: [
                            'John',
                            'A.',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('John A. Smith');
            done();
        });
        it('Multiple names name #2', (done) => {
            const patient = {
                name: [
                    {
                        use: 'official',
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                    {
                        use: 'nickname',
                        family: [
                            'Smith',
                        ],
                        given: [
                            'John',
                            'A.',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('Joshua U. Diaz');
            done();
        });
        it('Multiple names name #3', (done) => {
            const patient = {
                name: [
                    {
                        period: {
                            start: 1000,
                            end: 1500,
                        },
                        family: [
                            'Diaz',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                    {
                        period: {
                            start: 1500,
                            end: 2500,
                        },
                        family: [
                            'Smith',
                        ],
                        given: [
                            'John',
                            'A.',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('John A. Smith');
            done();
        });
        it('Partial names - Prefix + FirstName', (done) => {
            const patient = {
                name: [
                    {
                        prefix: [
                            'Mr.',
                        ],
                        given: [
                            'Joshua',
                            'U.',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('Mr. Joshua U. ');
            done();
        });
        it('Partial names - LastName + Suffix', (done) => {
            const patient = {
                name: [
                    {
                        suffix: [
                            'MD',
                        ],
                        family: [
                            'Smith',
                        ],
                    },
                ],
            };
            expect(getPatientName(patient)).to.equal('Smith MD');
            done();
        });
    });
    describe('getFHIRMetadata()', () => {
        const smart = {
            state: {
                serverUrl: 'http://localhost/FHIR',
            },
            patient: {},
        };
        const globMetadata = {
            resourceType: 'Conformance',
            publisher: 'Not provided',
            date: '2017-12-11T11:35:23+00:00',
            kind: 'instance',
            software: {
                name: 'HAPI FHIR Server',
                version: '1.4',
            },
            implementation: {
                description: 'HSPC Reference API Server',
            },
            fhirVersion: '1.0.2',
            acceptUnknown: 'extensions',
            format: [
                'application/xml+fhir',
                'application/json+fhir',
            ],
            rest: [
                {
                    mode: 'server',
                    security: {
                        extension: [
                            {
                                url: 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',
                                extension: [
                                    {
                                        url: 'authorize',
                                        valueUri: 'https://auth.hspconsortium.org/authorize',
                                    },
                                    {
                                        url: 'token',
                                        valueUri: 'https://auth.hspconsortium.org/token',
                                    },
                                    {
                                        url: 'register',
                                        valueUri: 'https://auth.hspconsortium.org/register',
                                    },
                                ],
                            },
                        ],
                        service: [
                            {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/restful-security-service',
                                        code: 'SMART-on-FHIR',
                                    },
                                ],
                                text: 'OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)',
                            },
                        ],
                    },
                    resource: [
                        {
                            type: 'Account',
                            profile: {
                                reference: 'http://hl7.org/fhir/profiles/Account',
                            },
                            interaction: [
                                {
                                    code: 'read',
                                },
                                {
                                    code: 'vread',
                                },
                                {
                                    code: 'update',
                                },
                                {
                                    code: 'delete',
                                },
                                {
                                    code: 'history-instance',
                                },
                                {
                                    code: 'history-type',
                                },
                                {
                                    code: 'create',
                                },
                                {
                                    code: 'search-type',
                                },
                            ],
                            conditionalCreate: true,
                            conditionalUpdate: true,
                            conditionalDelete: 'multiple',
                            searchInclude: [
                                '*',
                                'Account:owner',
                                'Account:patient',
                                'Account:subject',
                            ],
                            searchParam: [
                                {
                                    name: '_content',
                                    type: 'string',
                                    documentation: 'Search the...',
                                },
                                {
                                    name: '_id',
                                    type: 'string',
                                    documentation: 'The resource identity',
                                },
                                {
                                    name: '_language',
                                    type: 'string',
                                    documentation: 'The resource language',
                                },
                                {
                                    name: '_lastUpdated',
                                    type: 'date',
                                    documentation: 'Only return resources...',
                                },
                                {
                                    name: '_profile',
                                    type: 'uri',
                                    documentation: 'Search for resources which have the given profile',
                                },
                                {
                                    name: '_security',
                                    type: 'token',
                                    documentation: 'Search for resources which have the given security labels',
                                },
                                {
                                    name: '_tag',
                                    type: 'token',
                                    documentation: 'Search for resources which have the given tag',
                                },
                                {
                                    name: '_text',
                                    type: 'string',
                                    documentation: 'Search the contents of ...',
                                },
                                {
                                    name: 'balance',
                                    type: 'quantity',
                                },
                                {
                                    name: 'identifier',
                                    type: 'token',
                                },
                                {
                                    name: 'name',
                                    type: 'string',
                                },
                                {
                                    name: 'owner',
                                    type: 'reference',
                                    target: [
                                        'Organization',
                                    ],
                                    chain: [
                                        '*',
                                        '_id',
                                        '_language',
                                        'active',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'identifier',
                                        'name',
                                        'partof',
                                        'phonetic',
                                        'type',
                                    ],
                                },
                                {
                                    name: 'patient',
                                    type: 'reference',
                                    target: [
                                        'Patient',
                                        'Device',
                                        'Practitioner',
                                        'Location',
                                        'HealthcareService',
                                        'Organization',
                                    ],
                                    chain: [
                                        '*',
                                        '_id',
                                        '_language',
                                        'active',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'animal-breed',
                                        'animal-species',
                                        'birthdate',
                                        'careprovider',
                                        'deathdate',
                                        'deceased',
                                        'email',
                                        'family',
                                        'gender',
                                        'given',
                                        'identifier',
                                        'language',
                                        'link',
                                        'name',
                                        'organization',
                                        'phone',
                                        'phonetic',
                                        'telecom',
                                        '_id',
                                        '_language',
                                        'identifier',
                                        'location',
                                        'manufacturer',
                                        'model',
                                        'organization',
                                        'patient',
                                        'type',
                                        'udi',
                                        'url',
                                        '_id',
                                        '_language',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'communication',
                                        'email',
                                        'family',
                                        'gender',
                                        'given',
                                        'identifier',
                                        'location',
                                        'name',
                                        'organization',
                                        'phone',
                                        'phonetic',
                                        'role',
                                        'specialty',
                                        'telecom',
                                        '_id',
                                        '_language',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'identifier',
                                        'name',
                                        'near',
                                        'near-distance',
                                        'organization',
                                        'partof',
                                        'status',
                                        'type',
                                        '_id',
                                        '_language',
                                        'characteristic',
                                        'identifier',
                                        'location',
                                        'name',
                                        'organization',
                                        'programname',
                                        'servicecategory',
                                        'servicetype',
                                        '_id',
                                        '_language',
                                        'active',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'identifier',
                                        'name',
                                        'partof',
                                        'phonetic',
                                        'type',
                                    ],
                                },
                                {
                                    name: 'period',
                                    type: 'date',
                                },
                                {
                                    name: 'status',
                                    type: 'token',
                                },
                                {
                                    name: 'subject',
                                    type: 'reference',
                                    target: [
                                        'Patient',
                                        'Device',
                                        'Practitioner',
                                        'Location',
                                        'HealthcareService',
                                        'Organization',
                                    ],
                                    chain: [
                                        '*',
                                        '_id',
                                        '_language',
                                        'active',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'animal-breed',
                                        'animal-species',
                                        'birthdate',
                                        'careprovider',
                                        'deathdate',
                                        'deceased',
                                        'email',
                                        'family',
                                        'gender',
                                        'given',
                                        'identifier',
                                        'language',
                                        'link',
                                        'name',
                                        'organization',
                                        'phone',
                                        'phonetic',
                                        'telecom',
                                        '_id',
                                        '_language',
                                        'identifier',
                                        'location',
                                        'manufacturer',
                                        'model',
                                        'organization',
                                        'patient',
                                        'type',
                                        'udi',
                                        'url',
                                        '_id',
                                        '_language',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'communication',
                                        'email',
                                        'family',
                                        'gender',
                                        'given',
                                        'identifier',
                                        'location',
                                        'name',
                                        'organization',
                                        'phone',
                                        'phonetic',
                                        'role',
                                        'specialty',
                                        'telecom',
                                        '_id',
                                        '_language',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'identifier',
                                        'name',
                                        'near',
                                        'near-distance',
                                        'organization',
                                        'partof',
                                        'status',
                                        'type',
                                        '_id',
                                        '_language',
                                        'characteristic',
                                        'identifier',
                                        'location',
                                        'name',
                                        'organization',
                                        'programname',
                                        'servicecategory',
                                        'servicetype',
                                        '_id',
                                        '_language',
                                        'active',
                                        'address',
                                        'address-city',
                                        'address-country',
                                        'address-postalcode',
                                        'address-state',
                                        'address-use',
                                        'identifier',
                                        'name',
                                        'partof',
                                        'phonetic',
                                        'type',
                                    ],
                                },
                                {
                                    name: 'type',
                                    type: 'token',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        it('With token URL', (done) => {
            const metadata = mergeDeep({}, globMetadata);
            fetchMock
                .get('http://localhost/FHIR/metadata', metadata);
            getFHIRMetadata(smart).then((response) => {
                const expected = {
                    parsed: {
                        version: '1.0.2',
                        capabilities: {
                            Account: {
                                read: true,
                                vread: true,
                                update: true,
                                delete: true,
                                historyInstance: true,
                                historyType: true,
                                create: true,
                                searchType: true,
                            },
                        },
                        tokenURL: 'https://auth.hspconsortium.org/token',
                    },
                    raw: metadata,
                };
                fetchMock.restore();
                expect(response).to.deep.equal(expected);
                done();
            });
        });
        it('Without token URL', (done) => {
            const metadata = mergeDeep({}, globMetadata);
            metadata.rest[0].security.extension[0].extension = null;
            fetchMock
                .get('http://localhost/FHIR/metadata', metadata);
            getFHIRMetadata(smart).then((response) => {
                const expected = {
                    parsed: {
                        version: '1.0.2',
                        capabilities: {
                            Account: {
                                read: true,
                                vread: true,
                                update: true,
                                delete: true,
                                historyInstance: true,
                                historyType: true,
                                create: true,
                                searchType: true,
                            },
                        },
                        tokenURL: null,
                    },
                    raw: metadata,
                };
                fetchMock.restore();
                expect(response).to.deep.equal(expected);
                done();
            });
        });
        it('Without valid patient', (done) => {
            const metadata = mergeDeep({}, globMetadata);
            const smartWithoutPatient = {
                state: {
                    serverUrl: 'http://localhost/FHIR',
                },
                patient: null,
            };
            fetchMock
                .get('http://localhost/FHIR/metadata', metadata);
            getFHIRMetadata(smartWithoutPatient).then((response) => {
                const expected = {
                    parsed: {
                        version: '1.0.2',
                        capabilities: {
                            Account: {
                                read: true,
                                vread: true,
                                update: true,
                                delete: true,
                                historyInstance: true,
                                historyType: true,
                                create: true,
                                searchType: true,
                            },
                        },
                        tokenURL: 'https://auth.hspconsortium.org/token',
                    },
                    raw: metadata,
                };
                fetchMock.restore();
                done();
                expect(response).to.deep.equal(expected);
            });
        });
    });
    describe('parseNames()', () => {
        it('Valid - Arrays', () => {
            const res = {
                name: [
                    {
                        use: 'official',
                        given: ['John'],
                        family: ['Smith'],
                    },
                    {
                        use: 'secondary',
                        given: ['John'],
                        family: ['Doe'],
                    },
                ],
            };
            expect(parseNames(res)).to.deep.equal([
                {
                    use: 'official',
                    val: 'John Smith',
                },
                {
                    use: 'secondary',
                    val: 'John Doe',
                },
            ]);
        });
        it('Valid - Strings', () => {
            const res = {
                name: [
                    {
                        use: 'official',
                        given: 'John',
                        family: 'Smith',
                    },
                    {
                        use: 'secondary',
                        given: 'John',
                        family: 'Doe',
                    },
                ],
            };
            expect(parseNames(res)).to.deep.equal([
                {
                    use: 'official',
                    val: 'John Smith',
                },
                {
                    use: 'secondary',
                    val: 'John Doe',
                },
            ]);
        });
        it('Empty', () => {
            const res = {
                name: null,
            };
            expect(parseNames(res)).to.deep.equal([]);
        });
    });
    describe('parse phone', () => {
        it('Valid', () => {
            const res = {
                telecom: [
                    { system: 'phone', use: 'official', value: '1234567890' },
                    { system: 'phone', use: 'secondary', value: '0987654321' },
                ],
            };
            expect(parseTelecom('phone')(res)).to.deep.equal([
                { use: 'official', val: '1234567890' },
                { use: 'secondary', val: '0987654321' },
            ]);
        });
        it('Empty', () => {
            const res = {
                telecom: null,
            };
            expect(parseTelecom('phone')(res)).to.deep.equal([]);
        });
    });
    describe('parse email', () => {
        it('Valid', () => {
            const res = {
                telecom: [
                    { system: 'email', use: 'official', value: 'user1@example.com' },
                    { system: 'email', use: 'secondary', value: 'user2@example.com' },
                ],
            };
            expect(parseTelecom('email')(res)).to.deep.equal([
                { use: 'official', val: 'user1@example.com' },
                { use: 'secondary', val: 'user2@example.com' },
            ]);
        });
        it('Empty', () => {
            const res = {
                telecom: null,
            };
            expect(parseTelecom('email')(res)).to.deep.equal([]);
        });
    });
    describe('parseAddress()', () => {
        it('With line', () => {
            const res = {
                address: [
                    {
                        use: 'official',
                        line: ['Street 2'],
                        city: 'New Town',
                        state: 'New State',
                        postalCode: '29000',
                        country: 'Country',
                    },
                    {
                        use: 'secondary',
                        line: ['Street 52'],
                        city: 'New Town',
                        state: 'New State',
                        postalCode: '19000',
                        country: 'Country',
                    },
                ],
            };
            expect(parseAddress(res)).to.deep.equal([
                { use: 'official', val: 'Street 2 New Town New State 29000 Country' },
                { use: 'secondary', val: 'Street 52 New Town New State 19000 Country' },
            ]);
        });
        it('Without line', () => {
            const res = {
                address: [
                    {
                        use: 'official',
                        line: null,
                        city: 'New Town',
                        state: 'New State',
                        postalCode: '29000',
                        country: 'Country',
                    },
                    {
                        use: 'secondary',
                        line: null,
                        city: 'New Town',
                        state: 'New State',
                        postalCode: '19000',
                        country: 'Country',
                    },
                ],
            };
            expect(parseAddress(res)).to.deep.equal([
                { use: 'official', val: ' New Town New State 29000 Country' },
                { use: 'secondary', val: ' New Town New State 19000 Country' },
            ]);
        });
        it('Empty', () => {
            const res = {
                address: null,
            };
            expect(parseAddress(res)).to.deep.equal([]);
        });
    });
    describe('fhirQuery', () => {
        it('simple query with valid response', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const resources = [
                {
                    search: {
                        mode: 'outcome',
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 1,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 2,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 3,
                    },
                },
            ];
            const expected = resources.slice(1).map((i) => i.resource);
            const response = {
                resourceType: 'Bundle',
                entry: resources,
            };
            fetchMock
                .get(url, response);
            fhirQuery(url, {}).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('simple query with no data', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const expected = [];
            const response = {
                resourceType: 'Bundle',
            };
            fetchMock
                .get(url, response);
            fhirQuery(url, {}).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
    });
    describe('drain', () => {
        it('Single query', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const resources = [
                {
                    search: {
                        mode: 'outcome',
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 1,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 2,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 3,
                    },
                },
            ];
            const response = {
                resourceType: 'Bundle',
                entry: resources,
            };
            const expected = response;
            fetchMock
                .get(url, response);
            drain(url, {}).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Multi query', (done) => {
            const url_0 = 'http://localhost/FHIR/Resource';
            const url_1 = 'http://localhost/FHIR/Resource?_page=1';
            const resources_0 = [
                {
                    search: {
                        mode: 'outcome',
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 1,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 2,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 3,
                    },
                },
            ];
            const resources_1 = [];
            const response_0 = {
                resourceType: 'Bundle',
                entry: resources_0,
                link: [
                    {
                        relation: 'next',
                        url: url_1,
                    },
                ],
            };
            const response_1 = {
                resourceType: 'Bundle',
                entry: resources_1,
            };
            const expected = {
                resourceType: 'Bundle',
                entry: [
                    ...response_0.entry,
                    ...response_1.entry,
                ],
            };
            fetchMock
                .get(url_0, response_0);
            fetchMock
                .get(url_1, response_1);
            drain(url_0, {}).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it("Multi query - don't follow", (done) => {
            const url_0 = 'http://localhost/FHIR/Resource';
            const url_1 = 'http://localhost/FHIR/Resource?_page=1';
            const resources_0 = [
                {
                    search: {
                        mode: 'outcome',
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 1,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 2,
                    },
                },
                {
                    resource: {
                        resourceType: 'Resource',
                        id: 3,
                    },
                },
            ];
            const resources_1 = [];
            const response_0 = {
                resourceType: 'Bundle',
                entry: resources_0,
                link: [
                    {
                        relation: 'next',
                        url: url_1,
                    },
                ],
            };
            const response_1 = {
                resourceType: 'Bundle',
                entry: resources_1,
            };
            const expected = {
                ...response_0,
                entry: [
                    ...response_0.entry,
                ],
            };
            fetchMock
                .get(url_0, response_0);
            fetchMock
                .get(url_1, response_1);
            drain(url_0, {}, 0, {}, null, false).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
    });
    describe('fetchData', () => {
        it('No headers', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
            };
            const expected = response;
            fetchMock
                .get(url, response);
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Empty body - ""', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                status: 200,
                body: '',
            };
            const expected = {};
            fetchMock
                .get(url, response);
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Empty body - {}', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                status: 200,
                body: '{}',
            };
            const expected = {};
            fetchMock
                .get(url, response);
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Recovarable error in body', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                status: 200,
                body: ' 0{\"12\": 12}',
            };
            const expected = { 12: 12 };
            fetchMock
                .get(url, response);
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Unrecovarable error in body', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                status: 200,
                body: '}{',
            };
            const expected = {};
            fetchMock
                .get(url, response);
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('PUT', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
            };
            const expected = response;
            fetchMock
                .put(url, response);
            fetchData(url, null, { method: 'PUT' }).then((result) => {
                const lastOps = fetchMock.lastOptions();
                expect(result).to.deep.equal(expected);
                expect(lastOps).to.deep.equal({
                    method: 'PUT',
                });
                fetchMock.restore();
                done();
            });
        });
        it('POST - with mode, body, headers, and cache config', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
            };
            const expected = response;
            fetchMock
                .post(url, response);
            fetchData(url, { Accept: 'application/json', Authorization: 'YES' }, {
                method: 'POST', body: JSON.stringify({ content: 'here' }), mode: 'cors', cache: 'force-cache',
            }).then((result) => {
                const lastOps = fetchMock.lastOptions();
                expect(result).to.deep.equal(expected);
                expect(lastOps).to.deep.equal({
                    method: 'POST',
                    body: JSON.stringify({ content: 'here' }),
                    mode: 'cors',
                    cache: 'force-cache',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'YES',
                    },
                });
                fetchMock.restore();
                done();
            });
        });
        it('Unauthorized', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
            };
            const expected = response;
            fetchMock
                .get(url, {
                    status: 401,
                    body: response,
                });
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Access denied', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
            };
            const expected = response;
            fetchMock
                .get(url, {
                    status: 403,
                    body: response,
                });
            fetchData(url).then((result) => {
                expect(result).to.deep.equal(expected);
                fetchMock.restore();
                done();
            });
        });
        it('Error', (done) => {
            const url = 'http://localhost/FHIR/Resource';
            const response = {
                resourceType: 'Bundle',
                error: 'not found',
            };
            fetchMock
                .get(url, {
                    status: 404,
                    body: response,
                });
            fetchData(url).catch((result) => {
                expect(result).to.deep.equal({ status: 404, error: 'not found' });
                fetchMock.restore();
                done();
            });
        });
    });
});
