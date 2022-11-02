import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal'
import Card from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'

import CloseIcon from '@material-ui/icons/CloseRounded'

import Navpanel from '../Navpanel/index.jsx'

import Heading from './heading.jsx'
import HeadingContainer from './heading-container.jsx'
import Content from './content.jsx'
import ContentContainer from './content-container.jsx'

const modalStyles = ({
    heightDiff,
    navigationHeight,
    margin,
    clientWidth,
    modalWidth,
    buttonWidth,
    marginTop = null,
}) => makeStyles((theme) => ({
    root: { height: '100%' },
    headingRoot: { width: '100%', display: 'flex' },
    headingContainer: {
        width: '100%', display: 'flex', maxWidth: 1280, margin: 'auto',
    },
    headingCard: { width: '100%', margin, marginBottom: 0 },

    modalContainer: {
        width: '100%', height: '100%', display: 'flex', maxWidth: 1280, margin: 'auto',
    },
    modalCard: {
        width: '100%',
        margin,
        marginTop: marginTop || margin,
        marginBottom: 'auto',
        maxHeight: `calc(100% - ${heightDiff}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    closeButton: {
        position: 'absolute',
        top: navigationHeight + margin,
        right: Math.max(4, (clientWidth - modalWidth) / 4 - buttonWidth / 2),
        width: buttonWidth,
        minWidth: 24,
        height: buttonWidth,
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,

    },
    closeButtonIcon: {
        width: buttonWidth,
        height: buttonWidth,
        fill: '#FFF',
    },
}));

const DialogSingleton = ({
    checklist_CheckCalledDoctor = () => { },
    checklist_CheckReviewChart = () => { },
    checklist_CheckBundle = () => { },
    ui_SetPatientInfoTab = () => { },
    ui_SetModalHeadingHeight = () => { },
    closeCallback = () => { },
    dialog_Reset = () => { },
    ui_SetOpenedModal = () => { },
    dialog_SetOpen = () => { },
    ui_SetModalWidth = () => { },
    fhir_SetPatientNotificationAsRead = () => { },
    clientWidth,
    clientHeight,
    modalWidth,
    footerHeight,
    navigationHeight,
    modalHeadingHeight,
    headingType = '',
    contentType = '',
    open = false,
    fhir,
    fhir: {
        smart: {
            data: {
                patient: {
                    id: smartId = null,
                } = {},
            } = {},
        } = {},
        parsed: {
            user: {
                data: userData,
            },
            patientDemographics: {
                data: patientDetails,
                data: {
                    notification = [],
                    conds,
                    condsDetails,
                },
            },
        },
    },
    ui,
    ui: {
        openedModal,
        loggedOut,
    },
    dialog,
    checklist,
}) => {
    const closeModal = () => {
        dialog_Reset();
        closeCallback();
    }

    const margin = 32;

    const marginTop = headingType ? margin / 2 : margin;

    let heightDiff = footerHeight + navigationHeight + margin * 2

    if (headingType) {
        heightDiff += modalHeadingHeight + marginTop
    }

    const buttonWidth = Math.min(
        ...[
            50,
            (clientWidth - modalWidth) / 2 - 8,
        ],
    );

    const classes = modalStyles({
        heightDiff,
        navigationHeight,
        margin,
        clientWidth,
        modalWidth,
        buttonWidth,
        marginTop,
    })();

    return (
        <>
            <Modal
                BackdropProps={{
                    style: {
                        background: 'rgba(35,35,35,0.6)',
                    },
                }}
                className={loggedOut ? 'blurred' : ''}
                open={open}
                onClose={closeModal}
            >
                <div className={classes.root}>
                    <Card className="patient-view">
                        <Navpanel
                            inDialog
                            noFlagged
                        />
                    </Card>
                    {
                        !!headingType
                        && (
                            <div className={classes.headingRoot}>
                                <div className={classes.headingContainer}>
                                    <div className={`patient-view ${classes.headingCard}`}>
                                        <HeadingContainer
                                            ui_SetModalHeadingHeight={ui_SetModalHeadingHeight}
                                            modalHeadingHeight={modalHeadingHeight}
                                        >
                                            <Heading
                                                checklist={checklist}
                                                dialog={dialog}
                                                headingType={headingType}
                                                patientDetails={patientDetails}
                                                ui_SetPatientInfoTab={ui_SetPatientInfoTab}
                                                conds={conds}
                                                openedModal={openedModal}
                                                ui_SetOpenedModal={ui_SetOpenedModal}
                                                dialog_SetOpen={dialog_SetOpen}
                                                checklist_CheckCalledDoctor={checklist_CheckCalledDoctor}
                                                checklist_CheckReviewChart={checklist_CheckReviewChart}
                                                smartId={smartId}
                                                ui={ui}
                                                fhir={fhir}
                                            />
                                        </HeadingContainer>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className={classes.modalContainer}>
                        <Card elevation={0} square className={classes.modalCard} style={{ background: 'transparent' }}>
                            <ContentContainer
                                ui_SetModalWidth={ui_SetModalWidth}
                                modalWidth={modalWidth}
                            >
                                <Content
                                    contentType={contentType}
                                    userData={userData}
                                    ui={ui}
                                    fhir={fhir}
                                    ui_SetPatientInfoTab={ui_SetPatientInfoTab}
                                    condsDetails={condsDetails}
                                    openedModal={openedModal}
                                    clientHeight={clientHeight}
                                    footerHeight={footerHeight}
                                    navigationHeight={navigationHeight}
                                    modalWidth={modalWidth}
                                    notification={notification}
                                    checklist={checklist}
                                    dialog={dialog}
                                    checklist_CheckCalledDoctor={checklist_CheckCalledDoctor}
                                    checklist_CheckReviewChart={checklist_CheckReviewChart}
                                    checklist_CheckBundle={checklist_CheckBundle}
                                    dialog_SetOpen={dialog_SetOpen}
                                    fhir_SetPatientNotificationAsRead={fhir_SetPatientNotificationAsRead}
                                />
                            </ContentContainer>
                        </Card>
                    </div>

                    <IconButton
                        className={classes.closeButton}
                        onClick={closeModal}
                        variant="contained"
                        size="small"
                    >
                        <CloseIcon
                            className={classes.closeButtonIcon}
                        />
                    </IconButton>
                </div>
            </Modal>
        </>
    )
}

DialogSingleton.propTypes = {
    fhir: PropTypes.any.isRequired,
    ui: PropTypes.any.isRequired,
    dialog: PropTypes.any.isRequired,
    checklist: PropTypes.any.isRequired,
    checklist_CheckCalledDoctor: PropTypes.func,
    checklist_CheckReviewChart: PropTypes.func,
    checklist_CheckBundle: PropTypes.func,
    ui_SetPatientInfoTab: PropTypes.func,
    ui_SetModalHeadingHeight: PropTypes.func,
    closeCallback: PropTypes.func,
    dialog_Reset: PropTypes.func,
    ui_SetOpenedModal: PropTypes.func,
    dialog_SetOpen: PropTypes.func,
    ui_SetModalWidth: PropTypes.func,
    fhir_SetPatientNotificationAsRead: PropTypes.func,
    clientWidth: PropTypes.number,
    clientHeight: PropTypes.number,
    modalWidth: PropTypes.number,
    footerHeight: PropTypes.number,
    navigationHeight: PropTypes.number,
    modalHeadingHeight: PropTypes.number,
    headingType: PropTypes.string,
    contentType: PropTypes.string,
    open: PropTypes.bool,
}

DialogSingleton.defaultProps = {
    checklist_CheckCalledDoctor: () => { },
    checklist_CheckReviewChart: () => { },
    checklist_CheckBundle: () => { },
    ui_SetPatientInfoTab: () => { },
    ui_SetModalHeadingHeight: () => { },
    closeCallback: () => { },
    dialog_Reset: () => { },
    ui_SetOpenedModal: () => { },
    dialog_SetOpen: () => { },
    ui_SetModalWidth: () => { },
    fhir_SetPatientNotificationAsRead: () => { },
    headingType: '',
    contentType: '',
    open: false,
    clientWidth: 800,
    clientHeight: 600,
    modalWidth: 300,
    footerHeight: 50,
    navigationHeight: 100,
    modalHeadingHeight: 50,
}

export default DialogSingleton
