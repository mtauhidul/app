import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { blue } from '@material-ui/core/colors';

import CheckIcon from '@material-ui/icons/Check';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PaperContainer from '../../../frontend/src/components/PaperContainer/index.jsx';

import conditionsOfInterest from '../../../data/conditions-of-interest.json';

const useStyles = makeStyles({
  carePlans: {
    '& .MuiFormControlLabel-root .MuiFormControlLabel-label': {
      fontSize: '0.8em',
    },
    '& .MuiFormControlLabel-root .MuiButtonBase-root': {
      width: 18,
      height: 18,
    },
    '& .care-bundle-item-container': {
      display: 'flex',
      marginRight: 5,
      '& span': {
        margin: 'auto 0',
      },
    },
  },
});

const ListItemSpecial = ({
  risk,
  title,
  subtitle,
  riskDescription,
  precation,
  twoColumns,
  inDialog,
}) => (
  <>
    <ListItem
      key={title}
      style={{
        width: 'calc(100% + 30px)',
        marginLeft: -15,
        marginRight: -15,
        padding: '0 16px',
        fontSize: '0.85em',
      }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {/* <span style={{ textAlign: "right", width: 80, marginRight: 5 }}> +{parsedRisk}% | </span> */}
        <span style={{ margin: 'auto 0' }}>{title}</span>
        {!!subtitle && (
          <>
            <span style={{ margin: 'auto 5px' }}> • </span>
            <span style={{ fontWeight: 400, margin: 'auto 0' }}>
              {subtitle}
            </span>
          </>
        )}
      </div>
    </ListItem>
    {riskDescription ? (
      <Collapse
        style={{
          background: '#F2F6FE',
          borderRadius: 2,
          padding: 16,
          marginLeft: -5,
          marginRight: -5,
          marginBottom: 10,
        }}
        in={twoColumns}
        timeout='auto'
        unmountOnExit>
        <p style={{ fontSize: '0.85em', margin: 0 }}>
          <b> What is the risk: </b>
          <br />
          <span> {riskDescription || 'N/A'} </span>
        </p>
        {/* <p style={{ fontSize: "0.85em", margin: 0 }}>
                    <b> Suggested precautions: </b>
                    <br />
                    <span> {precation || "N/A"} </span>
                </p> */}
      </Collapse>
    ) : (
      <div style={{ marginBottom: inDialog ? 10 : 0 }} />
    )}
  </>
);

const RenderList = ({
  inDialog = false,
  allData,
  allDataLength,
  noBottomMargin,
  elevatedHeading,
  combineTitle,
  twoColumns,
  slice = [],
}) =>
  allData.slice(...slice).map(({ title, data }, idx) => (
    <Card
      key={`details-${title}-${idx}`}
      square={!twoColumns}
      elevation={0}
      style={{
        paddingTop: twoColumns ? 10 : 0,
        paddingBottom: twoColumns ? 10 : 0,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: idx === allDataLength - 1 && noBottomMargin ? 0 : 10,
        marginRight: elevatedHeading ? 20 : 0,
        marginLeft: elevatedHeading ? 20 : 0,
        ...(idx === 0 && combineTitle && !twoColumns
          ? {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }
          : {}),
      }}>
      <div
        style={{
          fontWeight: 800,
          display: 'flex',
          marginBottom: 5,
          fontSize: '0.9em',
        }}>
        {' '}
        {title}{' '}
      </div>

      {data.map(
        (
          { risk, title, subtitle, value, data, riskDescription, precation },
          idx
        ) => (
          <ListItemSpecial
            key={`list-item-special-${title}-${risk}-${idx}`}
            risk={risk}
            title={title}
            subtitle={value || subtitle}
            data={data}
            riskDescription={riskDescription}
            precation={precation}
            twoColumns={twoColumns}
            inDialog={inDialog}
          />
        )
      )}
    </Card>
  ));

const RenderTitle = ({
  conditionCode,
  combineTitle,
  elevatedHeading,
  title,
  subtitle,
  value,
  showSummary,
  inDialog,
  risk,
  twoColumns,
  ui_SetOpenedModal = () => {},
  dialog_SetOpen = () => {},
  idx,
  fhir = {},
}) => {
  const code = Object.keys(conditionsOfInterest).find(
    (code) => conditionsOfInterest[code].group === value
  );

  const classes = useStyles();

  return (
    <>
      <Card
        data-details-label={`${value}`}
        square={!twoColumns}
        elevation={elevatedHeading ? 4 : 0}
        style={{
          display: 'flex',
          background: '#f9eed0',
          padding: '10px 20px',
          marginBottom: 0, // combineTitle ? 0 : 10,
          marginTop: elevatedHeading ? 20 : 0,
          marginRight: elevatedHeading ? 20 : 0,
          marginLeft: elevatedHeading ? 20 : 0,
          ...(combineTitle
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : {}),
        }}>
        <Avatar
          style={{
            width: 37,
            height: 37,
            fontSize: '0.9em',
            margin: 'auto 0',
            visibility: risk ? 'visible' : 'hidden',
            backgroundColor: blue[400],
          }}>
          {Math.ceil(risk)}
        </Avatar>
        <div style={{ margin: 'auto 0', marginLeft: 20 }}>
          <div>{title}</div>
          <div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
            {subtitle}
          </div>
        </div>
        {!inDialog && (
          <IconButton
            {...(idx === 0
              ? {
                  'data-tutorial-order': '1',
                  'data-tutorial': '4',
                  'data-tutorial-origin': 'left',
                  'data-tutorial-label-position': 'left',
                  'data-tutorial-shape': 'rect',
                  'data-tutorial-key': 'flagged-details',
                }
              : {})}
            data-rh='More details'
            size='small'
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 'auto',
            }}
            onClick={() => {
              ui_SetOpenedModal(value);
              dialog_SetOpen({
                contentType: 'condition-details',
                headingType: showSummary ? 'patient-summary' : '',
              });
            }}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Card>
      <Card
        square
        elevation={0}
        style={{
          marginBottom: inDialog ? 10 : 0,
          borderBottomRightRadius: inDialog ? 5 : 0,
          borderBottomLeftRadius: inDialog ? 5 : 0,
          background: inDialog ? '#FFF' : 'transparent',
        }}>
        <div
          style={{ margin: 20 }}
          {...(idx === 0
            ? {
                'data-tutorial-order': '2',
                'data-tutorial': '4',
                'data-tutorial-origin': 'left',
                'data-tutorial-label-position': 'left',
                'data-tutorial-shape': 'rect',
                'data-tutorial-key': 'care',
              }
            : {})}>
          <PaperContainer>
            <div style={{ padding: 10 }}>
              <h5 style={{ margin: 0, marginBottom: 5 }}> Care Bundles </h5>

              <FormGroup row className={classes.carePlans}>
                {(
                  fhir?.parsed?.patientDemographics?.data?.careBundles[
                    conditionsOfInterest?.[conditionCode]?.group
                  ] || []
                ).map((title) => (
                  <div
                    key={`checked-care-bundle-${title}`}
                    className='care-bundle-item-container'>
                    <CheckIcon color='primary' style={{ width: 15 }} />
                    <span>{title}</span>
                  </div>
                ))}
              </FormGroup>
            </div>
          </PaperContainer>
        </div>
      </Card>
    </>
  );
};

export default ({
  title,
  subtitle,
  risk,
  code: conditionCode,
  overview = [],
  signs = [],
  history = [],
  additionalRiskFactors = [],
  value = '',
  ui_SetOpenedModal,
  dialog_SetOpen,
  showSummary,
  inDialog = false,
  ui = {},
  fhir = {},
  clickCallback = false,
  selected = false,
  elevatedHeading = false,
  noBottomMargin = false,
  combineTitle = false,
  twoColumns = false,
  idx = -1,
}) => {
  let allData = [
    {
      title: 'Overview of Risk Factors',
      data: overview,
    },
    {
      title: 'More Relevant Signs and Symptoms',
      data: signs,
    },
    {
      title: 'More Relevant Medical and Treatment History',
      data: history,
    },
    {
      title: 'Additional Risk Factors',
      data: additionalRiskFactors,
    },
  ].filter(({ data }) => data?.length);

  if (!inDialog) {
    allData = allData.reduce(
      (reduced, item) => [
        {
          title: 'Overview of Risk Factors',
          data: [...reduced[0].data, ...item.data],
        },
      ],
      [{ data: [] }]
    );

    allData[0].data = allData[0].data.slice(0, 10);
  }

  const allDataLength = allData.length;

  return (
    <Card
      square
      elevation={selected ? 4 : 0}
      style={{
        background: 'transparent',
        cursor: clickCallback ? 'pointer' : 'auto',
        paddingBottom: 10,
      }}
      onClick={() => {
        if (clickCallback) {
          ui_SetOpenedModal(value);
        }
      }}>
      {twoColumns && ui.clientWidth > 1020 ? (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>
            <div style={{ marginRight: 10 }}>
              <RenderTitle
                conditionCode={conditionCode}
                ui={ui}
                idx={idx}
                combineTitle={combineTitle}
                elevatedHeading={elevatedHeading}
                title={title}
                subtitle={subtitle}
                value={value}
                showSummary={showSummary}
                inDialog={inDialog}
                risk={risk}
                ui_SetOpenedModal={ui_SetOpenedModal}
                dialog_SetOpen={dialog_SetOpen}
                twoColumns={twoColumns}
                fhir={fhir}
              />

              <RenderList
                inDialog={inDialog}
                allData={allData}
                allDataLength={allDataLength}
                noBottomMargin={noBottomMargin}
                elevatedHeading={elevatedHeading}
                combineTitle={combineTitle}
                twoColumns={twoColumns}
                slice={[0, 1]}
              />
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={{ marginLeft: 10 }}>
              <RenderList
                inDialog={inDialog}
                allData={allData}
                allDataLength={allDataLength}
                noBottomMargin={noBottomMargin}
                elevatedHeading={elevatedHeading}
                combineTitle={combineTitle}
                twoColumns={twoColumns}
                slice={[1]}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <RenderTitle
            conditionCode={conditionCode}
            ui={ui}
            idx={idx}
            combineTitle={combineTitle}
            elevatedHeading={elevatedHeading}
            title={title}
            subtitle={subtitle}
            value={value}
            showSummary={showSummary}
            inDialog={inDialog}
            risk={risk}
            ui_SetOpenedModal={ui_SetOpenedModal}
            dialog_SetOpen={dialog_SetOpen}
            twoColumns={twoColumns}
            fhir={fhir}
          />

          <RenderList
            inDialog={inDialog}
            allData={allData}
            allDataLength={allDataLength}
            noBottomMargin={noBottomMargin}
            elevatedHeading={elevatedHeading}
            combineTitle={combineTitle}
            twoColumns={twoColumns}
          />
        </>
      )}
    </Card>
  );
};
