import React from 'react'
import * as PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import {
    blue, purple, red, green,
} from '@material-ui/core/colors'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import Popover from '@material-ui/core/Popover'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import MoreIcon from '@material-ui/icons/More'

import { DateTime } from 'luxon'

import DataList from '../DataList/index.jsx'
import LabCharts from '../DataCharts/index.jsx'

const listItemStyle = { padding: '0 16px' }

const useStyles = makeStyles((theme) => ({
    selected: {
        color: theme.palette.primary.main,
        fontWeight: 900,
    },
    listItem: {
        '& .MuiListItemText-primary': {
            display: 'flex',
        },
        '& .MuiListItemText-primary > b': {
            width: 90,
            textAlign: 'right',
        },
        '& .MuiListItemText-primary > span': {
            paddingLeft: 10,
            margin: 'auto 0',
        },
    },
}))

const TabPanel = (props) => {
    const {
        children, value, index, ...other
    } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>
                    <div>{children}</div>
                </div>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}

TabPanel.defaultProps = {
    children: null,
}

const Multifield = (fieldArrayRaw = []) => {
    const fieldArray = [...fieldArrayRaw]
    const mainField = fieldArray.shift()

    const [open, setOpen] = React.useState(false)

    const handleClose = () => setOpen(false)

    const openPopup = ({ currentTarget }) => setOpen(currentTarget)

    if (mainField) {
        return (
            <>
                <span>
                    {mainField.val}
                </span>
                {
                    fieldArray.length
                        ? (
                            <>
                                <IconButton size="small" onClick={openPopup}>
                                    {' '}
                                    <MoreIcon />
                                    {' '}
                                </IconButton>
                                <Popover
                                    open={!!open}
                                    anchorEl={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <List>
                                        {
                                            fieldArray.map(({ use, val }) => (
                                                <ListItem style={listItemStyle} key={`patient-details-${use}-${val}`}>
                                                    <ListItemText primary={val} secondary={use} />
                                                </ListItem>
                                            ))
                                        }

                                    </List>
                                </Popover>
                            </>
                        )
                        : null
                }
            </>
        )
    }
    return '-'
}

const PatientDetails = ({
    ui,
    fhir,
    fhir: {
        patientData,
        parsed: {
            patientDemographics: {
                data: {
                    smartId,
                    name,
                    names,
                    gender,
                    email,
                    birthDate,
                    address,
                    MRN,
                    phone,
                    extensions = [],
                },
            },
        },
    },
    ui_SetPatientInfoTab,
}) => {
    const classes = useStyles()

    const [labView, setLabView] = React.useState('chart')

    const patientEHRId = fhir?.smart?.data?.state?.tokenResponse?.patientCDR || fhir?.parsed?.patientDemographics?.data?.smartId

    const bpRawData = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.sbp?.data || []
    const hrRawData = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.hr?.data || []
    const rpRawData = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.rp?.data || []
    const tRawData = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.temp?.data || []
    const conditionsRaw = patientData?.[patientEHRId]?.Condition || []
    const medicationsRaw = patientData?.[patientEHRId]?.MedicationRequest || []
    const allergiesRaw = patientData?.[patientEHRId]?.AllergyIntolerance || []

    const bpData = bpRawData
        .map((_item, idx) => {
            const systolic = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.sbp?.data[idx]
            const diastolic = patientData?.[patientEHRId]?.Observation?.['vital-signs']?.dbp?.data[idx]

            return {
                date: systolic.date,
                systolic: systolic.value,
                diastolic: diastolic.value,
            }
        })

    const hrData = hrRawData
        .map(({ date, value }) => ({
            date,
            data: value,
        }))

    const rpData = rpRawData
        .map(({ date, value }) => ({
            date,
            data: value,
        }))

    const tData = tRawData
        .map(({ date, value }) => ({
            date,
            data: value,
        }))

    const conditions = conditionsRaw.map((cond) => ({
        date: DateTime.fromISO(cond.onsetDateTime || cond.recordedDate).toFormat('MM/dd/yyyy'),
        value: cond?.code?.text || 'Unknown',
    }))

    const medications = medicationsRaw.map((cond) => ({
        date: cond?.dosageInstruction?.[0]?.text,
        value: cond?.medicationCodeableConcept?.text || 'Unknown',
    }))

    const allergies = allergiesRaw.map((cond) => ({
        date: DateTime.fromISO(cond.recordedDate).toFormat('MM/dd/yyyy'),
        value: cond?.code?.text || 'Unknown',
    }))

    const sections = [
        { value: 'info', label: 'Info' },
        { value: 'obs', label: 'Vitals/Lab' },
        { value: 'conditions', label: 'Problems' },
        { value: 'meds', label: 'Medications' },
        { value: 'allergies', label: 'Allergies' },
    ]

    const ListItemTextStyled = ({ label, value }) => (
        <ListItemText
            className={classes.listItem}
            primary={(
                <>
                    <b>
                        {' '}
                        {label}
                        {' '}
                    </b>
                    <span>
                        {Array.isArray(value) ? Multifield(value) : value}
                    </span>
                </>
            )}
        />
    )

    return (
        <Card>
            {
                ui.clientWidth > 879
                    ? (
                        <Tabs
                            value={ui.patientInfoTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(_e, value) => {
                                ui_SetPatientInfoTab(value)
                            }}
                            aria-label="patient data"
                        >
                            {
                                sections.map(({ label, value }) => <Tab key={`patient-details-tab-${label}-${value}`} value={value} label={label} />)
                            }
                        </Tabs>
                    )

                    : (
                        <Select
                            fullWidth
                            className={classes.selected}
                            style={{ textTransform: 'uppercase', padding: '6px 12px', fontSize: 14 }}
                            value={ui.patientInfoTab}
                            onChange={({ target: { value } }) => {
                                ui_SetPatientInfoTab(value)
                            }}
                        >
                            {
                                sections.map(({ label, value }) => (
                                    <MenuItem key={`patient-details-tab-menu-item-${label}-${value}`} className={value === ui.patientInfoTab ? classes.selected : ''} value={value}>
                                        {' '}
                                        {label}
                                        {' '}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    )
            }

            <DialogContent>
                <TabPanel index={ui.patientInfoTab} value="info">
                    <List>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Name" value={names} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Gender" value={gender} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="MRN" value={MRN} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Birthdate" value={DateTime.fromISO(birthDate).toFormat('MMMM dd, yyyy')} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Address" value={address} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Email" value={email} />
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <ListItemTextStyled label="Phone" value={phone} />
                        </ListItem>
                        {
                            extensions.map(({ type, val }) => (
                                (!!(type && val) || true) && (
                                    <ListItem style={listItemStyle} key={`patient-details-additional-${type}-${val}`}>
                                        <ListItemTextStyled label={type} value={val} />
                                    </ListItem>
                                )
                            ))
                        }
                    </List>
                </TabPanel>
                <TabPanel index={ui.patientInfoTab} value="conditions">
                    <DataList units="" data={conditions} />
                </TabPanel>
                <TabPanel index={ui.patientInfoTab} value="meds">
                    <DataList units="" data={medications} />
                </TabPanel>
                <TabPanel index={ui.patientInfoTab} value="allergies">
                    <DataList units="" data={allergies} />
                </TabPanel>
                <TabPanel index={ui.patientInfoTab} value="obs">
                    <ButtonGroup size="small">
                        <Button onClick={() => setLabView('chart')} variant={labView === 'chart' ? 'contained' : 'outlined'} color={labView === 'chart' ? 'primary' : 'default'}> Chart </Button>
                        <Button onClick={() => setLabView('list')} variant={labView === 'list' ? 'contained' : 'outlined'} color={labView === 'list' ? 'primary' : 'default'}> List </Button>
                    </ButtonGroup>
                    <br />
                    <br />
                    {
                        labView === 'chart' && (
                            <>
                                <LabCharts
                                    units="°C"
                                    data={tData}
                                    type="Body Temperature"
                                    color={[blue[600]]}
                                />

                                <LabCharts
                                    units="mmHg"
                                    data={bpData}
                                    color={[blue[100], green[200]]}
                                />
                                <LabCharts
                                    units=""
                                    data={patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.data.length ? patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.data : hrData}
                                    type={patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.display || 'Heart Rate'}
                                    color={[red[800]]}
                                />
                                <LabCharts
                                    units=""
                                    data={patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.data.length ? patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.data : rpData}
                                    type={patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.display || 'Respiratory Rate'}
                                    color={[purple[600]]}
                                />
                            </>
                        )
                    }
                    {
                        labView === 'list' && (
                            <>
                                <DataList
                                    units="°C"
                                    data={patientData?.[smartId]?.Observation?.['vital-signs']?.temp?.data.length ? patientData?.[smartId]?.Observation?.['vital-signs']?.temp?.data : tData}
                                    type={patientData?.[smartId]?.Observation?.['vital-signs']?.temp?.display || 'Body Temperature'}
                                    color={[blue[600]]}
                                />

                                <DataList
                                    units="mmHG"
                                    data={bpData}
                                    type="Blood pressure"
                                    color={[blue[100], green[200]]}
                                />

                                <DataList
                                    units=""
                                    data={patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.data.length ? patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.data : hrData}
                                    type={patientData?.[smartId]?.Observation?.['vital-signs']?.hr?.display || 'Heart Rate'}
                                    color={[blue[600]]}
                                />
                                <DataList
                                    units=""
                                    data={patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.data.length ? patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.data : rpData}
                                    type={patientData?.[smartId]?.Observation?.['vital-signs']?.rp?.display || 'Respiratory Rate'}
                                    color={[blue[600]]}
                                />
                            </>
                        )
                    }
                </TabPanel>
            </DialogContent>
        </Card>
    )
}

PatientDetails.propTypes = {
    ui_SetPatientInfoTab: PropTypes.func.isRequired,
    ui: PropTypes.any.isRequired,
    fhir: PropTypes.any.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
}

PatientDetails.defaultProps = {
    value: '',
    label: '',
}

export default PatientDetails
