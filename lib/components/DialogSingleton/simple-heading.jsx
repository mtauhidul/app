import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'

const SimpleHeading = ({ children }) => (
    <Card
        style={{
            fontSize: '1.2em',
            fontWeight: 900,
            fontFamily: 'Nunito Sans',
            textAlign: 'center',
            padding: '10px 5px',
        }}
    >
        {children}
    </Card>
)

SimpleHeading.propTypes = {
    children: PropTypes.any,
}

SimpleHeading.defaultProps = {
    children: null,
}

export default SimpleHeading
