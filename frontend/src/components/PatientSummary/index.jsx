import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = (compact) =>
  makeStyles({
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      // marginBottom: 10,
      fontFamily: 'Nunito Sans',
      fontWeight: 100,
    },
    primaryRow: {
      fontSize: '1.55em',
      fontWeight: 600,
      // marginBottom: compact ? 0 : 5,
    },
    secondaryRow: {
      display: 'flex',
      // marginTop: compact ? 0 : 5,
    },
  });

const PatientSummary = ({
  name,
  MRN,
  gender,
  age,
  location,
  LOS,
  data = null,
  compact = false,
  showDetails = false,
  dialog_SetOpen = () => {},
  hideDialogHeading = false,
}) => {
  const classes = useStyles(compact)();
  const openPatientDetails = () => {
    dialog_SetOpen({
      contentType: 'patient-details',
      headingType: hideDialogHeading ? null : 'patient-summary',
    });
  };

  const MoreDetails = (
    <IconButton
      onClick={openPatientDetails}
      size='small'
      data-rh='Patient Details'>
      <ChevronRightIcon />
    </IconButton>
  );

  return (
    <div className={classes.container}>
      <div className={classes.primaryRow}>
        {name} •{gender} {age} {showDetails && MoreDetails}
      </div>
      <div className={classes.secondaryRow}>
        <span
          style={{
            display: 'flex',
            marginTop: 'auto',
            marginBottom: 'auto',
            width: '100%',
          }}>
          <div style={{ marginTop: 'auto' }}>
            MRN: {MRN} • {location} • LOS {LOS} {LOS === 1 ? 'day' : 'days'}
          </div>

          <div style={{ marginLeft: 40 }}>{data}</div>
        </span>
      </div>
    </div>
  );
};

PatientSummary.propTypes = {
  name: PropTypes.string.isRequired,
  MRN: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.any.isRequired,
  location: PropTypes.string.isRequired,
  LOS: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  data: PropTypes.any,
  compact: PropTypes.bool,
  showDetails: PropTypes.bool,
  dialog_SetOpen: PropTypes.func,
  hideDialogHeading: PropTypes.bool,
};

PatientSummary.defaultProps = {
  data: null,
  compact: false,
  showDetails: false,
  dialog_SetOpen: () => {},
  hideDialogHeading: false,
};

export default PatientSummary;
