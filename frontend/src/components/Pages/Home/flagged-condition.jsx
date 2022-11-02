import React from 'react'
import PropTypes from 'prop-types';

const FlaggedCondition = ({ title, dataRh }) => (
    <div
        data-rh={dataRh}
        style={{
            borderRadius: 3,
            fontSize: '0.8em',
            marginTop: 2,
            marginBottom: 2,
            marginLeft: 0,
            marginRight: 10,
            background: '#F5F5F8',
            padding: '5px 8px',
        }}
    >
        {title}
    </div>
)

FlaggedCondition.propTypes = {
    title: PropTypes.string.isRequired,
    dataRh: PropTypes.string,
}

FlaggedCondition.defaultProps = {
    dataRh: '',
}

export default FlaggedCondition
