import React from 'react'
import '../../../../../../lib/tests'
import { expect } from 'chai'
// import configStore from "./../../../../redux"
import { createShallow } from '@material-ui/core/test-utils'
import fetchMock from 'fetch-mock'
import * as sinon from 'sinon'
import InitLoader from '..'

React.useLayoutEffect = React.useEffect;
const getLocalProps = (props = {}) => ({
    ...props,
    delay: () => Promise.resolve(null),
    ui: {
        initialized: false,
    },
    fhir: {
        smart: {
            data: {
                state: {
                    tokenResponse: '',
                },
            },
        },
    },
    getPatientDemographics: sinon.spy(() => Promise.resolve(null)),
    getFHIRMetadata: sinon.spy(() => Promise.resolve(null)),
    getPatientMedications: sinon.spy(() => Promise.resolve(null)),
    fhir_getPractitionerData: sinon.spy(() => Promise.resolve(null)),
    fhir_SetParsedPatientDemographics: sinon.spy(() => Promise.resolve(null)),
    fhir_SetContext: sinon.spy(() => Promise.resolve(null)),
    fhir_SetMeta: sinon.spy(() => Promise.resolve(null)),
    fhir_SetSampleData: sinon.spy(() => Promise.resolve(null)),
    ui_SetRetina: sinon.spy(() => Promise.resolve(null)),
    fhir_Reset: sinon.spy(() => Promise.resolve(null)),
    fhir_SetSmart: sinon.spy(() => Promise.resolve(null)),
    ui_SetInitialized: sinon.spy(() => Promise.resolve(null)),
    fhir_SetMedications: sinon.spy(() => Promise.resolve(null)),
});
// import { Provider } from "react-redux";
describe('Init', () => {
    const mount = createShallow();
    describe('render', () => {
        it('Normal render', () => {
            const propsLocal = getLocalProps();
            const wrapper = mount(<InitLoader {...propsLocal} />);
            expect(wrapper.html()).to.be.null;
        });
        it('Mount error', () => {
            const FHIROoauth2ReadySaved = window.FHIR.oauth2.ready;
            window.FHIR.oauth2.ready = sinon.stub().throws();
            const propsLocal = getLocalProps();
            expect(propsLocal.fhir_Reset.called).to.be.false;
            expect(propsLocal.fhir_SetSmart.called).to.be.false;
            expect(propsLocal.fhir_SetSampleData.called).to.be.false;
            const wrapper = mount(<InitLoader {...propsLocal} />);
            expect(wrapper.html()).to.be.null;
            window.FHIR.oauth2.ready = FHIROoauth2ReadySaved;
            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(propsLocal.fhir_Reset.called).to.be.true;
                    expect(propsLocal.fhir_SetSmart.called).to.be.true;
                    expect(propsLocal.fhir_SetSampleData.called).to.be.true;
                    resolve(null);
                }, 100);
            });
        });
        describe('Perform updates', () => {
            it('No substantial changes', () => {
                const propsLocal = getLocalProps();
                const wrapper = mount(<InitLoader {...propsLocal} />);
                wrapper.setProps();
            });
            it('Different FHIR SMART status - not ready', (done) => {
                const propsLocal = getLocalProps();
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.ui_SetInitialized.called).to.be.false;
                wrapper.setProps({
                    ...propsLocal,
                    fhir: {
                        ...propsLocal.fhir,
                        smart: {
                            ...propsLocal.fhir.smart,
                            status: 'ready',
                        },
                    },
                });
                setTimeout(() => {
                    expect(propsLocal.ui_SetInitialized.called).to.be.false;
                    done();
                }, 100);
            });
            it('Different FHIR SMART status - ready', (done) => {
                const propsLocalProto = getLocalProps();
                const propsLocal = {
                    ...propsLocalProto,
                    ui: {
                        ...propsLocalProto.ui,
                        initialized: false,
                    },
                    fhir: {
                        ...propsLocalProto.fhir,
                        meta: {
                            status: 'ready',
                        },
                        smart: {
                            ...propsLocalProto.fhir.smart,
                            status: 'ready',
                        },
                        parsed: {
                            patientDemographics: {
                                status: 'ready',
                            },
                            medications: {
                                status: 'ready',
                            },
                        },
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.ui_SetInitialized.called).to.be.false;
                wrapper.setProps({
                    ...propsLocal,
                    fhir: {
                        ...propsLocal.fhir,
                        smart: {
                            ...propsLocal.fhir.smart,
                            status: 'ready',
                        },
                    },
                });
                setTimeout(() => {
                    expect(propsLocal.ui_SetInitialized.called).to.be.true;
                    done();
                }, 100);
            });
            it('Different FHIR SMART status - demo mode', (done) => {
                const propsLocalProto = getLocalProps();
                const propsLocal = {
                    ...propsLocalProto,
                    ui: {
                        ...propsLocalProto.ui,
                        initialized: false,
                    },
                    fhir: {
                        ...propsLocalProto.fhir,
                        meta: {
                            status: 'pending',
                        },
                        smart: {
                            ...propsLocalProto.fhir.smart,
                            status: 'demo-mode',
                        },
                        parsed: {
                            patientDemographics: {
                                status: 'ready',
                            },
                            medications: {
                                status: 'ready',
                            },
                        },
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.ui_SetInitialized.called).to.be.false;
                wrapper.setProps({
                    ...propsLocal,
                    fhir: {
                        ...propsLocal.fhir,
                    },
                });
                setTimeout(() => {
                    expect(propsLocal.ui_SetInitialized.called).to.be.true;
                    done();
                }, 100);
            });
        });
    });
    describe('methods', () => {
        it('progress', () => {
            const propsLocal = getLocalProps();
            const wrapper = mount(<InitLoader {...propsLocal} />);
            wrapper.instance().progress();
        });
        it('hideSplashScreen', () => {
            const propsLocal = getLocalProps();
            const wrapper = mount(<InitLoader {...propsLocal} />);
            wrapper.instance().hideSplashScreen();
        });
        describe('getContext', () => {
            it('No id_token', (done) => {
                const propsLocal = getLocalProps();
                const smart = {
                    state: {
                        tokenResponse: {
                            id_token: '',
                        },
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                const contextPromise = wrapper.instance().getContext(smart);
                contextPromise.then((context) => {
                    expect(context).to.deep.equal([]);
                    done();
                });
            });
            it('Valid id_token', (done) => {
                const propsLocal = getLocalProps();
                const smart = {
                    state: {
                        tokenResponse: {
                            id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjoiMTIzNDU2Nzg5MCIsImp0aSI6IjVkZDgxNzRjLTZhZWYtNDAwNC1iMDhlLWI1ODRhYTM2ZGQ2NSIsImlhdCI6MTU3OTAxNDQzNywiZXhwIjoxNTc5MDE4MDUzfQ.UTLSXk04Hfsv9MtK4QZkqnq5hf_p_pHCKR7MtuUQw5k',
                        },
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                const contextPromise = wrapper.instance().getContext(smart);
                contextPromise.then((context) => {
                    expect(context).to.deep.equal(['1234567890']);
                    done();
                });
            });
            it('Invalid id_token', (done) => {
                const propsLocal = getLocalProps();
                const smart = {
                    state: {
                        tokenResponse: {
                            id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ZGQ4MTc0Yy02YWVmLTQwMDQtYjA4ZS1iNTg0YWEzNmRkNjUiLCJpYXQiOjE1NzkwMTQ0MzcsImV4cCI6MTU3OTAxODEwNn0._8C2oj6qWnnoq3mdf7y9WUAmV0qyaC9OwV_SbBWD3OU',
                        },
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                const contextPromise = wrapper.instance().getContext(smart);
                contextPromise.then((context) => {
                    expect(context).to.deep.equal([]);
                    done();
                });
            });
        });
        describe('loadData', () => {
            it('Load FHIR metadata', (done) => {
                const propsLocal = getLocalProps();
                fetchMock.get('https://example.com/FHIR/Patient/SMART-621799', {});
                fetchMock.get('https://example.com/FHIR/MedicationRequest?patient=SMART-621799&status=draft&_sort=-authoredon', {});
                fetchMock.get('https://example.com/FHIR/MedicationOrder?patient=SMART-621799&status=draft&_sort=-authoredon', {});
                fetchMock.get('https://example.com/FHIR/metadata', {});
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.getPatientDemographics.called).to.be.false;
                expect(propsLocal.getFHIRMetadata.called).to.be.false;
                expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.false;
                expect(propsLocal.fhir_SetContext.called).to.be.false;
                expect(propsLocal.fhir_SetMeta.called).to.be.false;
                wrapper.setProps({
                    ...propsLocal,
                    fhir: {
                        ...propsLocal.fhir,
                        smart: {
                            ...propsLocal.fhir.smart,
                            status: 'ready',
                        },
                    },
                });
                setTimeout(() => {
                    fetchMock.restore();
                    expect(propsLocal.getPatientDemographics.called).to.be.true;
                    expect(propsLocal.getFHIRMetadata.called).to.be.true;
                    expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.true;
                    expect(propsLocal.fhir_SetContext.called).to.be.true;
                    expect(propsLocal.fhir_SetMeta.called).to.be.true;
                    done();
                }, 200);
                // .loadData(smart).then(() => {
                // });
            });
            it('Correct', (done) => {
                const propsLocal = getLocalProps();
                fetchMock.get('https://example.com/FHIR/Patient/SMART-621799', {});
                fetchMock.get('https://example.com/FHIR/MedicationRequest?patient=SMART-621799&status=draft&_sort=-authoredon', {});
                fetchMock.get('https://example.com/FHIR/MedicationOrder?patient=SMART-621799&status=draft&_sort=-authoredon', {});
                fetchMock.get('https://example.com/FHIR/metadata', {});
                const smart = {
                    patient: {
                        id: 'SMART-621799',
                    },
                    state: {
                        serverUrl: 'https://example.com/FHIR',
                        tokenResponse: {},
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.getPatientDemographics.called).to.be.false;
                expect(propsLocal.getFHIRMetadata.called).to.be.false;
                expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.false;
                expect(propsLocal.fhir_SetContext.called).to.be.false;
                expect(propsLocal.fhir_SetMeta.called).to.be.false;
                wrapper.instance().loadData(smart).then(() => {
                    fetchMock.restore();
                    expect(propsLocal.getPatientDemographics.called).to.be.true;
                    expect(propsLocal.getFHIRMetadata.called).to.be.false;
                    expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.true;
                    expect(propsLocal.fhir_SetContext.called).to.be.true;
                    expect(propsLocal.fhir_SetMeta.called).to.be.false;
                    done();
                });
            });
            it('Handle error', (done) => {
                const propsLocal = {
                    ...getLocalProps(),
                    getPatientDemographics: sinon.spy(() => Promise.reject()),
                };
                fetchMock.get('https://example.com/FHIR/Patient/SMART-621799', { status: 404, body: { active: false } });
                fetchMock.get('https://example.com/FHIR/metadata', {});
                const smart = {
                    patient: {
                        id: 'SMART-621799',
                    },
                    state: {
                        serverUrl: 'https://example.com/FHIR',
                        tokenResponse: {},
                    },
                };
                const wrapper = mount(<InitLoader {...propsLocal} />);
                expect(propsLocal.getPatientDemographics.called).to.be.false;
                expect(propsLocal.getFHIRMetadata.called).to.be.false;
                expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.false;
                expect(propsLocal.fhir_SetContext.called).to.be.false;
                expect(propsLocal.fhir_SetMeta.called).to.be.false;
                wrapper.instance().loadData(smart).then(() => {
                    fetchMock.restore();
                    expect(propsLocal.getPatientDemographics.called).to.be.true;
                    expect(propsLocal.getFHIRMetadata.called).to.be.false;
                    expect(propsLocal.fhir_SetParsedPatientDemographics.called).to.be.false;
                    expect(propsLocal.fhir_SetContext.called).to.be.false;
                    expect(propsLocal.fhir_SetMeta.called).to.be.false;
                    done();
                });
            });
        });
    });
});
