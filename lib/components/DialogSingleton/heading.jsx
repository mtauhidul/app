import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FlagIcon from '@material-ui/icons/Flag'

import PatientSummary from '../../../frontend/src/components/PatientSummary/index.jsx'
import ConditionButtons from '../ConditionButtons/index.jsx'
import SimpleHeading from './simple-heading.jsx'

const Heading = ({
    headingType,
    patientDetails,
    ui_SetPatientInfoTab,
    conds,
    openedModal,
    ui_SetOpenedModal,
    dialog_SetOpen,
    dialog,
    checklist,
    smartId,
    checklist_CheckCalledDoctor,
    checklist_CheckReviewChart,
    ui,
    fhir,
    fhir: {
        parsed: {
            patientDemographics: {
                data: {
                    notification = [],
                } = {},
            } = {},
        } = {},
    } = {},
}) => {
    if (headingType === 'patient-summary') {
        return (
            <Card style={{ padding: 20 }}>
                <PatientSummary
                    {...patientDetails}
                    ui_SetPatientInfoTab={ui_SetPatientInfoTab}
                    showDetails
                    dialog_SetOpen={dialog_SetOpen}
                    fhir={fhir}
                    data={(
                        <ConditionButtons
                            showSummary
                            dialog={dialog}
                            conds={conds}
                            openedModal={openedModal}
                            ui_SetOpenedModal={ui_SetOpenedModal}
                            dialog_SetOpen={dialog_SetOpen}
                        />
                    )}
                />
            </Card>
        )
    }
    if (headingType === 'notifications') {
        const { viewedNotifications, newNotifications, total } = notification
            .reduce((reduced, cur) => {
                reduced[cur.viewed ? 'viewedNotifications' : 'newNotifications'] += 1;
                reduced.total += 1;
                return reduced
            }, { viewedNotifications: 0, newNotifications: 0, total: 0 })
        return (
            <SimpleHeading>
                Notifications
                <br />
                <div style={{ fontSize: '0.6em', fontWeight: 100, color: 'rgba(0,0,0,0.6)' }}>
                    New:
                    {' '}
                    <b>{newNotifications}</b>
                    {' '}
                    • Old:
                    {' '}
                    <b>{viewedNotifications}</b>
                    {' '}
                    • Total:
                    {' '}
                    <b>{total}</b>
                </div>
            </SimpleHeading>
        )
    }

    if (headingType === 'user-details') {
        return <SimpleHeading> User details </SimpleHeading>
    }

    if (headingType === 'checklist') {
        const commonStyle = { padding: '3px 10px', display: 'flex' };

        const switchToDetails = (
            <>
                {
                    ui.clientWidth > 715
                        ? (
                            <Card style={{ width: 'fit-content', margin: 'auto', marginRight: 0 }}>
                                <Button
                                    size="small"
                                    startIcon={<FlagIcon />}
                                    onClick={() => {
                                        dialog_SetOpen({
                                            contentType: 'condition-details',
                                            headingType: !smartId ? 'patient-summary' : '',
                                        })
                                    }}
                                >
                                    Details
                                </Button>
                            </Card>
                        )
                        : (
                            <IconButton
                                data-rh="Details"
                                style={{ background: '#FFF', margin: 'auto', marginRight: 0 }}
                                onClick={() => {
                                    dialog_SetOpen({
                                        contentType: 'condition-details',
                                        headingType: !smartId ? 'patient-summary' : '',
                                    })
                                }}
                            >
                                <FlagIcon style={{ width: 20, height: 20 }} />
                            </IconButton>
                        )
                }
            </>
        )

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    !smartId ? (
                        <div style={{ display: 'flex', marginBottom: 5, flexWrap: 'wrap' }}>
                            <ConditionButtons
                                showSummary={false}
                                dialog={dialog}
                                conds={conds}
                                openedModal={openedModal}
                                ui_SetOpenedModal={ui_SetOpenedModal}
                                dialog_SetOpen={dialog_SetOpen}
                                centered
                            />
                            {switchToDetails}
                        </div>
                    )
                        : (
                            <div style={{ marginBottom: 5 }}>
                                {switchToDetails}
                            </div>
                        )
                }

                <div style={{ display: 'flex' }}>
                    <Card style={{ ...commonStyle, marginRight: 5 }}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    style={{ marginLeft: 10, padding: 0 }}
                                    checked={!!checklist?.calledDoctor?.[openedModal]}
                                    onChange={() => checklist_CheckCalledDoctor(openedModal)}
                                />
                            )}
                            label="Called Doctor"
                        />
                    </Card>
                    <Card style={{ ...commonStyle, margin: 'auto' }}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    style={{ marginLeft: 10, padding: 0 }}
                                    checked={!!checklist?.reviewedChart?.[openedModal]}
                                    onChange={() => checklist_CheckReviewChart(openedModal)}
                                />
                            )}
                            label="Reviewed Chart"
                        />
                    </Card>
                    <Card style={{ ...commonStyle, marginLeft: 5 }}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    style={{ marginLeft: 10, padding: 0 }}
                                    checked={!!((checklist?.bundle?.[openedModal] || []).length)}
                                />
                            )}
                            label="Bundle"
                        />
                    </Card>
                </div>
            </div>
        )
    }

    return 'Invalid heading';
}

export default Heading
