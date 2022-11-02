import React from 'react'
import PropTypes from 'prop-types';

const PatientHeadingContainer = ({
    children,
    patientHeadingContainerHeight,
    ui_SetPatientHeadingContainerHeight,
}) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        const height = ref?.current?.offsetHeight;
        if (patientHeadingContainerHeight !== height) {
            ui_SetPatientHeadingContainerHeight(height);
        }
    })

    return (
        <div ref={ref} className="patient-heading-container">
            {children}
        </div>
    )
}

PatientHeadingContainer.propTypes = {
    children: PropTypes.any,
    patientHeadingContainerHeight: PropTypes.number.isRequired,
    ui_SetPatientHeadingContainerHeight: PropTypes.func.isRequired,
}

PatientHeadingContainer.defaultProps = {
    children: null,
}

export default PatientHeadingContainer
