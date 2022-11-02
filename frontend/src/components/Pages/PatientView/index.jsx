import * as PropTypes from 'prop-types';
import React from 'react';

import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as glib from '../../../../../lib/utils';
import * as lib from '../../../lib';
import * as actionCreators from '../../../redux/action-creators';

import './style.less';

import ConditionDetails from '../../../../../lib/components/ConditionDetails/index.jsx';
import ContentFrame from '../../../../../lib/components/ContentFrame/index.jsx';
import GeneralRiskFactors from '../../../../../lib/components/GeneralRiskFactors/index.jsx';
import InlineDataRender from '../../../../../lib/components/InlineDataRender/index.jsx';
import Navpanel from '../../../../../lib/components/Navpanel/index.jsx';
import PaperContainer from '../../PaperContainer/index.jsx';

const PatientViewComponent = (props) => {
  const atRiskRef = React.useRef(null);

  const [atRiskTabWidth, setAtRiskTabWidth] = React.useState(0);

  React.useEffect(() => {
    const newWidth = atRiskRef?.current?.clientWidth;

    if (newWidth && newWidth !== atRiskTabWidth) {
      setAtRiskTabWidth(newWidth);
    }
  });

  React.useEffect(() => {
    props.getPatientData({
      smartStatus: props?.fhir?.smart?.status,
      fhir: props.fhir,
      fhir_SetPatientMedicalData: props.fhir_SetPatientMedicalData,
      fhir_SetPatientChart: props.fhir_SetPatientChart,
    });
  }, [props?.fhir?.smart?.data?.patient?.id]);

  React.useEffect(() => {
    if (props.fhir.parsed.patientDemographics.status === 'ready') {
      const [flaggedCondition] =
        props?.fhir?.parsed?.patientDemographics?.data?.conds || [];

      props.ui_SetScrolledIntoView(flaggedCondition);
    }
  }, [props?.fhir?.parsed?.patientDemographics?.data?.conds]);

  const {
    name,
    gender,
    age,
    MRN,
    smartId,
    conds = [],
    condsDetails = {},
  } = props?.fhir?.parsed?.patientDemographics?.data;

  return (
    <div className='patient-view'>
      <div className='container'>
        <Navpanel {...props} noFlagged />

        <ContentFrame
          // className="reversed-column"
          className='patient-view-content'
          left={
            <PaperContainer
              elevation={1}
              style={{ borderRadius: 0, margin: 0 }}>
              <Paper
                square
                elevation={0}
                style={{
                  background: '#FFF',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}>
                <Tabs
                  value={props.ui.allPatientsTab}
                  indicatorColor='primary'
                  textColor='primary'
                  onChange={(_e, value) => {
                    props.ui_SetAllPatientsTab(value);
                  }}
                  aria-label='patient lists'
                  variant='fullWidth'
                  centered>
                  <Tab
                    data-tutorial-mode='provider'
                    data-tutorial-idx={1}
                    ref={atRiskRef}
                    value='at-risk'
                    label={<div>Overview</div>}
                  />
                  <Tab
                    data-tutorial-mode='provider'
                    data-tutorial-idx={2}
                    value='symptomatic'
                    label={<div>Risk Summary</div>}
                  />
                </Tabs>
              </Paper>
              <div
                style={{
                  padding: '16px 20px',
                  ...(props.ui.clientWidth > 715
                    ? {
                        height:
                          props.ui.clientHeight -
                          props.ui.footerHeight -
                          props.ui.navigationHeightGeneral -
                          63,
                        overflowY: 'auto',
                      }
                    : {}),
                }}>
                {props.ui.allPatientsTab === 'at-risk' && (
                  <div>
                    <Paper style={{ padding: 20, marginBottom: 15 }}>
                      <GeneralRiskFactors
                        {...(props?.fhir?.parsed?.patientDemographics?.data ||
                          {})}
                      />
                    </Paper>
                    <Paper style={{ padding: 20, marginBottom: 15 }}>
                      <InlineDataRender
                        sidebar
                        data={
                          props?.fhir?.parsed?.patientDemographics?.data
                            ?.vitals || []
                        }
                        title='Vitals'
                      />
                    </Paper>
                    {[
                      {
                        title: 'Lab Results',
                        value: 'obs',
                        button: true,
                        data: (
                          props?.fhir?.parsed?.patientDemographics?.data
                            ?.labs || []
                        ).map(({ label, value }) => (
                          <p
                            key={`lab-result-${label}-${value}`}
                            style={{ dispay: 'flex' }}>
                            <span style={{ flexGrow: 1 }}> {label} </span>{' '}
                            <span>{value || 'Unknown'}</span>
                          </p>
                        )),
                      },
                      {
                        title: 'Problems',
                        value: 'conditions',
                        button: true,
                        data: (
                          props?.fhir?.patientData?.[
                            (props?.fhir?.patientData,
                            props?.fhir?.smart?.data?.state?.tokenResponse
                              ?.patientCDR)
                          ]?.Condition || []
                        ).map(
                          ({ code: { text: label = null } = {} } = {}) =>
                            !!label && <p key={`problem-${label}`}>{label}</p>
                        ),
                      },
                      {
                        title: 'Medications',
                        value: 'meds',
                        button: true,
                        data: (
                          props?.fhir?.patientData?.[
                            (props?.fhir?.patientData,
                            props?.fhir?.smart?.data?.state?.tokenResponse
                              ?.patientCDR)
                          ]?.MedicationRequest || []
                        ).map(
                          ({
                            medicationCodeableConcept: {
                              text: label = null,
                            } = {},
                          } = {}) =>
                            !!label && <p key={`med-${label}`}>{label}</p>
                        ),
                      },
                    ].map(({ title, button, data, value }) => (
                      <Paper
                        key={`patient-paper-data-${title}`}
                        style={{
                          padding: 20,
                          marginBottom: 15,
                        }}>
                        <div style={{ display: 'flex' }}>
                          <span
                            style={{
                              fontSize: '1.2em',
                              fontWeight: 900,
                              margin: 'auto 0',
                            }}>
                            {' '}
                            {title}{' '}
                          </span>
                          {button && (
                            <>
                              <div style={{ flexGrow: 1 }} />
                              <IconButton
                                data-rh='View Details'
                                size='small'
                                onClick={() => {
                                  props.ui_SetPatientInfoTab(value);
                                  props.ui_SetOpenedModal(title);
                                  props.dialog_SetOpen({
                                    contentType: 'patient-details',
                                    headingType: '',
                                  });
                                }}>
                                <ChevronRightIcon />
                              </IconButton>
                            </>
                          )}
                        </div>

                        <div>{data}</div>
                      </Paper>
                    ))}
                  </div>
                )}
                {props.ui.allPatientsTab === 'symptomatic' && (
                  <div>
                    {conds.map((cond) => {
                      const details = condsDetails[cond];
                      return (
                        <div key={`patient-details-cond-${cond}`}>
                          <div style={{ marginBottom: 5 }}>
                            <b>{details.title}</b> ({Math.round(details.risk)}
                            %)
                          </div>
                          {[
                            [details.overview, 'Overview of Risk Factors'],
                            [
                              details.history,
                              'More Relevant Signs and Symptoms',
                            ],
                            [
                              details.signs,
                              'More Relevant Medical and Treatment History',
                            ],
                            [
                              details.additionalRiskFactors,
                              'Additional Risk Factors',
                            ],
                          ]
                            .filter(([data]) => data?.length)
                            .reduce(
                              (reduced, data, rdx) => [
                                ...reduced,

                                <ul
                                  key={`detail-container-${data?.[1]}-${rdx}`}
                                  style={{
                                    margin: 0,
                                    paddingLeft: 20,
                                    listStyleType: 'none',
                                  }}>
                                  {/* <b> {data[1]} </b> */}
                                  {data[0].map((overview, ddx) => (
                                    <li
                                      key={`detail-${overview.title}-${ddx}`}
                                      style={{ display: 'flex' }}>
                                      <span
                                        style={{
                                          margin: 'auto 5px',
                                          marginTop: 2,
                                        }}>
                                        {' '}
                                        *{' '}
                                      </span>
                                      {overview.title}
                                    </li>
                                  ))}
                                </ul>,
                              ],
                              []
                            )}
                          <Divider />
                          <br />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </PaperContainer>
          }>
          <div
            style={{
              padding: 20,
              ...(props.ui.clientWidth > 715
                ? {
                    maxHeight:
                      props.ui.clientHeight -
                      props.ui.footerHeight -
                      props.ui.navigationHeightGeneral -
                      10,
                    overflowY: 'auto',
                  }
                : {}),
            }}>
            <div
              onScroll={({ currentTarget }) => {
                const t = Array.from(
                  document.querySelectorAll('[data-details-label]')
                )
                  .filter(
                    (el) =>
                      props.ui.clientHeight -
                        el.getBoundingClientRect().top -
                        el.getBoundingClientRect().height >
                      0
                  )
                  .slice(-1)[0];

                props.ui_SetScrolledIntoView(
                  t.getAttribute('data-details-label')
                );
              }}>
              {conds.map((cond, idx) => {
                const details = condsDetails[cond];

                return (
                  <div key={`data-details-${idx}-${cond}`}>
                    <Card
                      elevation={0}
                      key={`patient-cond-card-${cond}`}
                      style={{
                        background: 'transparent',
                        marginBottom: 10,
                      }}>
                      <ConditionDetails
                        {...details}
                        value={cond}
                        ui_SetOpenedModal={props.ui_SetOpenedModal}
                        dialog_SetOpen={props.dialog_SetOpen}
                        ui={props.ui}
                        fhir={props.fhir}
                        twoColumns
                        inDialog
                        combineTitle
                        idx={idx}
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </ContentFrame>

        <br />
      </div>
    </div>
  );
};

PatientViewComponent.propTypes = {
  fhir: PropTypes.any.isRequired,
  ui: PropTypes.any.isRequired,
  fhirQuery: PropTypes.func,
  fhir_SetPatientMedicalData: PropTypes.func,
  fhir_SetPatientChart: PropTypes.func,
  getPatientData: PropTypes.func,
  ui_SetScrolledIntoView: PropTypes.func,
  ui_SetAllPatientsTab: PropTypes.func,
  ui_SetOpenedModal: PropTypes.func,
  ui_SetPatientInfoTab: PropTypes.func,
  dialog_SetOpen: PropTypes.func,
};

PatientViewComponent.defaultProps = {
  fhirQuery: () => {},
  fhir_SetPatientMedicalData: () => {},
  fhir_SetPatientChart: () => {},
  getPatientData: () => {},
  ui_SetScrolledIntoView: () => {},
  ui_SetAllPatientsTab: () => {},
  ui_SetOpenedModal: () => {},
  ui_SetPatientInfoTab: () => {},
  dialog_SetOpen: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  ...glib,
  ...lib,
  ...state,
  ...ownProps,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actionCreators }, dispatch);
const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientViewComponent);
export { PatientViewComponent, connectedComponent };
export default connectedComponent;
