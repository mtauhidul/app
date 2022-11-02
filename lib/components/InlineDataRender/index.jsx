import React from 'react'

import performConvert from '../../utils/UnitConversions'

const parseValues = ({ label, value: valueRaw, units: unitsRaw }) => {
    let value = valueRaw
    let units = unitsRaw

    if (units) {
        value = valueRaw !== '-' ? performConvert({
            inputValue: valueRaw,
            inputUnits: units,
            outputUnits: 'F',
        }) : valueRaw

        units = 'F'
    }

    return (
        <div key={`parsed-value-${label}`} style={{ display: 'inline-flex', marginRight: 5 }}>
            <b>
                {' '}
                {label}
                {' '}
            </b>
            &nbsp;
            &nbsp;
            <span>
                {' '}
                {value || 'Unknown'}
                {' '}
            </span>
            &nbsp;
            <span>
                {' '}
                {units}
                {' '}
            </span>
        </div>
    )
}

export default ({
    title = '',
    data = [],
    sidebar = false,
}) => (
    <div style={{ display: 'flex', flexDirection: sidebar ? 'column' : 'row' }}>
        {
            sidebar
                ? (
                    <div style={{ fontSize: '1.2em', fontWeight: 900, margin: 'auto 0px' }}>
                        {' '}
                        {title}
                        {' '}
                    </div>
                )
                : (
                    <b>
                        {title}
                        :
                    </b>
                )
        }
        <div style={{ marginTop: 5, display: 'flex' }}>
            {
                data.map(parseValues)
            }
        </div>
    </div>
)
