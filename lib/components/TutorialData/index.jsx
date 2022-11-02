import React from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'

const TutorialData = ({ idx }) => (
    <Card style={{ padding: 20 }}>
        {

            idx === 1 && (
                <div>
                    List of patients that are at risk
                </div>
            )
        }
        {
            idx === 2 && (
                <div>
                    List of patients that are symptomatic
                </div>
            )
        }
        {
            idx === 3 && (
                <div>
                    Patient summary
                </div>
            )
        }
        {
            idx === 4 && (
                <div>
                    Patient&apos;s risk score
                </div>
            )
        }
        {
            idx === 5 && (
                <div>
                    Patient&apos;s basic demographics
                </div>
            )
        }
        {
            idx === 6 && (
                <div>
                    Patient&apos;s flagged conditions
                </div>
            )
        }
    </Card>
)

TutorialData.propTypes = {
    idx: PropTypes.number,
}

TutorialData.defaultProps = {
    idx: 0,
}

export default TutorialData
