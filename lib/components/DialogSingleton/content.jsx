import React from 'react'
import PropTypes from 'prop-types'

import UserDetails from '../UserDetails/index.jsx'
import PatientDetails from '../PatientDetails/index.jsx'
import ConditionDetails from '../ConditionDetails/index.jsx'
import QRCodeDialog from '../QRCodeDialog/index.jsx'
import NotificationDialog from '../NotificationDialog/index.jsx'
import ChecklistDialog from '../ChecklistDialog/index.jsx'

const Content = ({
    contentType,
    userData,
    ui,
    fhir,
    ui_SetPatientInfoTab,
    condsDetails,
    openedModal,
    clientHeight,
    footerHeight,
    navigationHeight,
    modalWidth,
    notification,
    checklist,
    dialog,
    checklist_CheckCalledDoctor,
    checklist_CheckReviewChart,
    checklist_CheckBundle,
    dialog_SetOpen,
    fhir_SetPatientNotificationAsRead = () => { },
}) => {
    if (contentType === 'user-details') return <UserDetails {...userData} />

    if (contentType === 'patient-details') return <PatientDetails {...{ ui, fhir, ui_SetPatientInfoTab }} />

    if (contentType === 'condition-details') {
        return (
            <ConditionDetails
                {...condsDetails?.[openedModal] || {}}
                inDialog
                dialog_SetOpen={dialog_SetOpen}
                ui={ui}
                fhir={fhir}
                noBottomMargin
                combineTitle
                twoColumns
            />
        )
    }

    if (contentType === 'qr-code') {
        return (
            <QRCodeDialog
                clientHeight={clientHeight}
                footerHeight={footerHeight}
                navigationHeight={navigationHeight}
                modalWidth={modalWidth}
                url={`${window.location.origin}/link.html`}
                title="Universal link QR Code placeholder"
                body={(
                    <>
                        {/* Scan this code to visit <b>example.org</b> */}
                    </>
                )}
            />
        )
    }

    if (contentType === 'notifications') {
        return (
            <NotificationDialog
                data={notification}
                fhir_SetPatientNotificationAsRead={fhir_SetPatientNotificationAsRead}
            />
        )
    }

    if (contentType === 'checklist') {
        return (
            <ChecklistDialog
                dialog={dialog}
                checklist={checklist}
                openedModal={openedModal}
                checklist_CheckCalledDoctor={checklist_CheckCalledDoctor}
                checklist_CheckReviewChart={checklist_CheckReviewChart}
                checklist_CheckBundle={checklist_CheckBundle}
            />
        )
    }

    return <h1 style={{ textAlign: 'center' }}> Invalid Content </h1>
}

Content.propTypes = {
    userData: PropTypes.any.isRequired,
    ui: PropTypes.any.isRequired,
    fhir: PropTypes.any.isRequired,
    dialog: PropTypes.any.isRequired,
    contentType: PropTypes.string,
    openedModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    clientWidth: PropTypes.number,
    clientHeight: PropTypes.number,
    footerHeight: PropTypes.number,
    navigationHeight: PropTypes.number,
    modalWidth: PropTypes.number,
    condsDetails: PropTypes.any,
    notification: PropTypes.any,
    checklist: PropTypes.any,
    ui_SetPatientInfoTab: PropTypes.func,
    checklist_CheckCalledDoctor: PropTypes.func,
    checklist_CheckReviewChart: PropTypes.func,
    checklist_CheckBundle: PropTypes.func,
    dialog_SetOpen: PropTypes.func,
    fhir_SetPatientNotificationAsRead: PropTypes.func,
}

Content.defaultProps = {
    openedModal: false,
    contentType: '',
    ui_SetPatientInfoTab: () => { },
    checklist_CheckCalledDoctor: () => { },
    checklist_CheckReviewChart: () => { },
    checklist_CheckBundle: () => { },
    dialog_SetOpen: () => { },
    fhir_SetPatientNotificationAsRead: () => { },
    clientWidth: 800,
    clientHeight: 600,
    modalWidth: 300,
    footerHeight: 50,
    navigationHeight: 100,
    condsDetails: {},
    notification: {},
    checklist: {},
}

export default Content
