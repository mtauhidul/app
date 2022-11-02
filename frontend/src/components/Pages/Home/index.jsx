import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import { blue } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { DateTime } from 'luxon';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import data from '../../../../../FHIRData/poc/patients.json';

import * as glib from '../../../../../lib/utils';
import * as lib from '../../../lib';
import * as actionCreators from '../../../redux/action-creators';

import './style.less';

import Navpanel from '../../../../../lib/components/Navpanel/index.jsx';

import ConditionButtons from '../../../../../lib/components/ConditionButtons/index.jsx';
import ConditionDetails from '../../../../../lib/components/ConditionDetails/index.jsx';
import ContentFrame from '../../../../../lib/components/ContentFrame/index.jsx';
import { historyPush } from '../../../../../lib/utils/history';
import PaperContainer from '../../PaperContainer/index.jsx';
import PatientSummary from '../../PatientSummary/index.jsx';

import tabsStyles from '../../../style/mui/tabsStyles';

import FlaggedConditions from './flagged-conditions.jsx';
import PatientHeadingContainer from './patient-heading-container.jsx';

const HomeComponent = (props) => {
  const {
    fhir,
    fhir: {
      parsed: {
        patientList: {
          search: {
            sort,
            filter,
            startDate,
            endDate,
            keywords: searchKeywords = [],
          },
        },
        patientDemographics: {
          data: patientData = {},
          data: {
            name = '',
            MRN = '',
            gender = '',
            age = '',
            smartId = null,
            LOS = 0,
            location = '-',
            conds = [],
            condsDetails = {},
          } = {},
        } = {},
      } = {},
    } = {},
    ui,
    ui: {
      footerHeight,
      navigationHeight,
      openedModal,
      modalHeadingHeight,
      clientWidth,
      patientHeadingContainerHeight,
    },
    ui_SetOpenedModal,
    dialog_SetOpen,
    ui_SetPatientHeadingContainerHeight,
    ui_SetScrolledIntoView,
    // highlight,
    dialog,
  } = props;

  const highlight = (i, e) => i;

  console.log(data.entry);

  React.useEffect(() => {
    props.getPatientData({
      smartStatus: props?.fhir?.smart?.status,
      fhir: props.fhir,
      fhir_SetPatientMedicalData: props.fhir_SetPatientMedicalData,
      fhir_SetPatientChart: props.fhir_SetPatientChart,
    });
  }, [props?.fhir?.parsed?.patientDemographics?.data?.smartId]);

  React.useEffect(() => {
    if (
      props?.fhir?.smart?.data?.patient?.id &&
      smartId &&
      props?.fhir?.parsed?.patientDemographics?.status === 'ready'
    ) {
      historyPush('/patient-view', props);
    }
  }, [props?.fhir?.smart?.data?.patient?.id, smartId]);

  const {
    fhir: {
      parsed: { patientList: { search: { keywords = [] } = {} } = {} } = {},
    } = {},
  } = props;

  const patientList = data.entry.filter((p = {}) => {
    const patient = p.resource;
    const patientStringified = [
      patient.name,
      patient.MRN,
      patient.gender,
      patient.age,
    ]
      .join(' ')
      .toLowerCase();

    return (
      !keywords.length ||
      keywords.reduce(
        (reduced, kw) =>
          reduced || patientStringified.includes(kw.toLowerCase()),
        false
      )
    );
  });

  const filters = Object.keys(filter).reduce((reduced, f) => {
    if (filter[f]) {
      reduced.push(f);
    }
    return reduced;
  }, []);

  {
    console.log(patientList);
  }

  let patientListSelectedType = patientList;

  if (filters.length) {
    patientListSelectedType = patientListSelectedType.filter((item) =>
      item.conds.reduce(
        (reduced, cond) => reduced || filters.includes(cond),
        false
      )
    );
  }

  if (startDate || endDate) {
    const startDateTime = (
      startDate ? DateTime.fromISO(startDate) : DateTime.fromISO('1000-01-01')
    ).toMillis();
    const endDateTime = (
      endDate ? DateTime.fromISO(endDate) : DateTime.fromISO('3000-12-31')
    ).toMillis();

    patientListSelectedType = patientListSelectedType.filter(
      ({ admittanceDate, dischargeDate }) =>
        admittanceDate.toMillis() > startDateTime &&
        dischargeDate.toMillis() < endDateTime
    );
  }

  const { 'at-risk': atRisk, symptomatic } = patientListSelectedType.reduce(
    (reduced, patient) => {
      reduced[patient.riskType] += 1;
      return reduced;
    },
    { 'at-risk': 0, symptomatic: 0 }
  );

  patientListSelectedType = patientListSelectedType.filter(
    (item) => props.ui.allPatientsTab === item.riskType
  );

  const [sortType, sortDirection] = sort.split('-');

  if (sortType === 'risk') {
    patientListSelectedType = patientListSelectedType.sort(
      (a, b) => b.risk - a.risk
    );
  }

  if (sortType === 'los') {
    patientListSelectedType = patientListSelectedType.sort(
      (a, b) => b.LOS - a.LOS
    );
  }

  if (sortDirection === 'asc') {
    patientListSelectedType.reverse();
  }

  const atRiskRef = React.useRef(null);

  const [atRiskTabWidth, setAtRiskTabWidth] = React.useState(0);

  React.useEffect(() => {
    const newWidth = atRiskRef?.current?.clientWidth;

    if (newWidth && newWidth !== atRiskTabWidth) {
      setAtRiskTabWidth(newWidth);
    }
  });

  const tabsClasses = tabsStyles(atRiskTabWidth)();

  return (
    <div className='patient-view'>
      <div className='container'>
        <Navpanel {...props} />

        <ContentFrame
          className='provider-view-content'
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
                }}
                data-tutorial='2'
                data-tutorial-shape='rect'
                data-tutorial-key='patients'
                data-tutorial-origin='right'
                data-tutorial-order='1'>
                <Tabs
                  value={props.ui.allPatientsTab}
                  indicatorColor='primary'
                  textColor='primary'
                  onChange={(_e, value) => {
                    props.ui_SetAllPatientsTab(value);
                  }}
                  aria-label='patient lists'
                  variant='fullWidth'
                  centered
                  // className={props.ui.allPatientsTab === "at-risk" ? tabsClasses.root : ""}
                >
                  <Tab
                    data-tutorial-mode='provider'
                    data-tutorial-idx={1}
                    ref={atRiskRef}
                    value='at-risk'
                    label={
                      <div>
                        At-Risk
                        <span style={{ fontSize: 10 }}> {atRisk} </span>
                      </div>
                    }
                  />
                  <Tab
                    data-tutorial-mode='provider'
                    data-tutorial-idx={2}
                    value='symptomatic'
                    label={
                      <div>
                        Symptomatic
                        <span style={{ fontSize: 10 }}> {symptomatic} </span>
                      </div>
                    }
                  />
                </Tabs>
              </Paper>

              {patientListSelectedType.length ? (
                <List
                  id='left-sidebar'
                  style={{
                    padding: '8px 10px',
                    ...(ui.clientWidth > 715
                      ? {
                          maxHeight:
                            ui.clientHeight -
                            footerHeight -
                            ui.navigationHeightGeneral -
                            63,
                          overflowY: 'auto',
                        }
                      : {}),
                  }}>
                  {patientListSelectedType.map((pat, patIdx) => {
                    const risk = pat.risk ?? Math.floor(Math.random() * 100);

                    return (
                      <Paper
                        {...(patIdx === 0
                          ? {
                              'data-tutorial-order': '2',
                              'data-tutorial': '2',
                              'data-tutorial-shape': 'rect',
                              'data-tutorial-key': 'patient',
                            }
                          : {})}
                        key={`patient-paper-${pat.smartId}`}
                        elevation={smartId === pat.smartId ? 4 : 0}
                        style={{
                          cursor: 'pointer',
                          marginBottom: 10,
                          padding: 20,
                        }}
                        {...(patIdx === 0
                          ? {
                              'data-tutorial-mode': 'provider',
                              'data-tutorial-idx': 3,
                            }
                          : {})}>
                        <div
                          style={{ display: 'flex' }}
                          key={pat.smartId}
                          onClick={() => {
                            props.fhir_SetParsedPatientDemographics(pat);
                            if (clientWidth <= 715) {
                              setTimeout(() => {
                                document
                                  .querySelector(
                                    '.provider-view-content.content-frame .right-content'
                                  )
                                  ?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                    inline: 'start',
                                  });
                              }, 250);
                            }
                          }}>
                          <Avatar
                            style={{
                              width: 50,
                              height: 50,
                              margin: 'auto 5px',
                              opacity: risk ? 1 : 0,
                              backgroundColor: blue[400],
                            }}
                            {...(patIdx === 0
                              ? {
                                  'data-tutorial-mode': 'provider',
                                  'data-tutorial-idx': 4,
                                }
                              : {})}>
                            {Math.ceil(risk)}
                          </Avatar>
                          <div
                            style={{ marginLeft: 5, width: '100%' }}
                            {...(patIdx === 0
                              ? {
                                  'data-tutorial-mode': 'provider',
                                  'data-tutorial-idx': 5,
                                }
                              : {})}>
                            <div
                              style={{
                                fontFamily: 'Nunito Sans',
                                fontWeight: 400,
                                fontSize: '1.1em',
                                color: '#000',
                              }}>
                              {highlight(pat.name, searchKeywords)}
                            </div>
                            <div>
                              <div
                                style={{
                                  marginTop: 4,
                                  marginBottom: 4,
                                  fontFamily: 'Nunito Sans',
                                  fontSize: '0.85em',
                                  color: '#888',
                                }}>
                                MRN: {highlight(pat.MRN, searchKeywords)} •{' '}
                                {highlight(pat.gender, searchKeywords)}{' '}
                                {highlight(pat.age, searchKeywords)} • LOS{' '}
                                {pat.LOS} {pat.LOS === 1 ? 'day' : 'days'}
                              </div>
                              <div
                                style={{
                                  marginTop: 2,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                                {...(patIdx === 0
                                  ? {
                                      'data-tutorial-mode': 'provider',
                                      'data-tutorial-idx': 6,
                                    }
                                  : {})}>
                                <FlaggedConditions data={pat.conds} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    );
                  })}
                </List>
              ) : (
                <div
                  style={{
                    padding: 10,
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.85)',
                    fontFamily: 'Nunito Sans',
                    fontWeight: 100,
                  }}>
                  No patients found
                </div>
              )}
            </PaperContainer>
          }>
          {!!smartId && (
            <PatientHeadingContainer
              patientHeadingContainerHeight={patientHeadingContainerHeight}
              ui_SetPatientHeadingContainerHeight={
                ui_SetPatientHeadingContainerHeight
              }>
              <Paper
                elevation={0}
                style={{ margin: 20, padding: 20 }}
                {...{
                  'data-tutorial-order': '1',
                  'data-tutorial-origin': 'left',
                  'data-tutorial-label-position': 'left',
                  'data-tutorial': '3',
                  'data-tutorial-shape': 'rect',
                  'data-tutorial-key': 'patient-summary',
                }}>
                <PatientSummary
                  fhir={fhir}
                  location={location}
                  LOS={LOS}
                  name={name}
                  gender={gender}
                  age={age}
                  MRN={MRN}
                  showDetails
                  dialog_SetOpen={dialog_SetOpen}
                  data={
                    <ConditionButtons
                      showSummary
                      dialog={dialog}
                      conds={conds}
                      openedModal={openedModal}
                      ui_SetOpenedModal={ui_SetOpenedModal}
                      dialog_SetOpen={dialog_SetOpen}
                    />
                  }
                />
              </Paper>
            </PatientHeadingContainer>
          )}

          {
            <div
              style={{
                ...(props.ui.clientWidth > 715
                  ? {
                      maxHeight:
                        ui.clientHeight -
                        footerHeight -
                        ui.navigationHeightGeneral -
                        20,
                      // overflowY: "auto"
                    }
                  : {}),
              }}>
              {smartId ? (
                <>
                  {/* <Card elevation={0} style={{ padding: 20, marginTop: 10, marginBottom: 5, marginLeft: 15, marginRight: 15, }}>
                                <GeneralRiskFactors showHistory {...patientData} />
                            </Card> */}

                  <div
                    id='right-content'
                    style={{
                      overflowY: 'auto',
                      maxHeight:
                        ui.clientHeight -
                        footerHeight -
                        ui.navigationHeightGeneral -
                        patientHeadingContainerHeight -
                        40,
                      marginTop: 16,
                      display: 'flex',
                      flexWrap: 'wrap',
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    {conds.map((cond, idx) => {
                      const details = condsDetails[cond];

                      const evenIdx = idx % 2 === 0;

                      return (
                        <div
                          key={`cond-card-container-${cond}`}
                          style={{
                            width: clientWidth > 1020 ? '50%' : '100%',
                          }}>
                          <Card
                            elevation={0}
                            key={`patient-cond-card-${cond}`}
                            style={{
                              marginRight:
                                clientWidth > 1020 ? (evenIdx ? 10 : 0) : 0,
                              marginLeft:
                                clientWidth > 1020 ? (evenIdx ? 0 : 10) : 0,
                              marginBottom: 10,
                              height: 'calc(100% - 10px)',
                            }}>
                            <div
                              {...(idx === 0
                                ? {
                                    'data-tutorial-origin': 'left',
                                    'data-tutorial-label-position': 'left',
                                    'data-tutorial': '3',
                                    'data-tutorial-order': '2',
                                    'data-tutorial-shape': 'rect',
                                    'data-tutorial-key': 'flagged',
                                  }
                                : {})}>
                              <ConditionDetails
                                {...details}
                                value={cond}
                                ui_SetOpenedModal={ui_SetOpenedModal}
                                dialog_SetOpen={dialog_SetOpen}
                                showSummary
                                ui={ui}
                                fhir={fhir}
                                idx={idx}
                              />
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <PaperContainer
                  style={{
                    paddingTop: 0,
                    paddingBottom: smartId ? 10 : 0,
                    margin: '15px 20px',
                  }}>
                  <div
                    data-tutorial='3'
                    data-tutorial-key='select-patient'
                    data-tutorial-order='1'>
                    <div
                      data-tutorial='4'
                      data-tutorial-key='select-patient-continue'
                      data-tutorial-order='1'>
                      <h1
                        style={{
                          padding: 30,
                          fontFamilty: 'Nunito Sans',
                          fontWeight: 100,
                          fontSize: '2em',
                          textAlign: 'center',
                          margin: 0,
                        }}>
                        {' '}
                        Please select a patient
                      </h1>
                    </div>
                  </div>
                </PaperContainer>
              )}
            </div>
          }
        </ContentFrame>
      </div>
    </div>
  );
};

HomeComponent.propTypes = {
  fhir: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  children: PropTypes.any,
  dialog: PropTypes.object.isRequired,
  ui_SetOpenedModal: PropTypes.func,
  dialog_SetOpen: PropTypes.func,
  ui_SetPatientHeadingContainerHeight: PropTypes.func,
  ui_SetScrolledIntoView: PropTypes.func,
  getPatientData: PropTypes.func,
  fhirQuery: PropTypes.func,
  fhir_SetPatientMedicalData: PropTypes.func,
  fhir_SetPatientChart: PropTypes.func,
  ui_SetAllPatientsTab: PropTypes.func,
  fhir_SetParsedPatientDemographics: PropTypes.func,
};

HomeComponent.defaultProps = {
  children: null,
  ui_SetOpenedModal: () => {},
  dialog_SetOpen: () => {},
  ui_SetPatientHeadingContainerHeight: () => {},
  ui_SetScrolledIntoView: () => {},
  getPatientData: () => {},
  fhirQuery: () => {},
  fhir_SetPatientMedicalData: () => {},
  fhir_SetPatientChart: () => {},
  ui_SetAllPatientsTab: () => {},
  fhir_SetParsedPatientDemographics: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  ...glib,
  ...lib,
  ...state,
  ...ownProps,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actionCreators }, dispatch);

const Home = HomeComponent;

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

export { Home, connectedComponent };

export default connectedComponent;
