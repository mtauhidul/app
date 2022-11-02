import React from 'react';

import InlineDataRender from '../InlineDataRender/index.jsx';

export default ({
    showHistory = false,
    vitals = [],
    labs = [],
    generalRisks = [],
}) => (
    <>
        {
            showHistory
                ? <h5 style={{ margin: 0, fontSize: '1.1em' }}> General Factors and History </h5>
                : <span style={{ fontSize: '1.2em', fontWeight: 900, margin: 'auto 0px' }}> General Factors </span>
        }
        <div style={{ marginTop: 10 }}>
            {generalRisks.join(' • ')}
        </div>
        {
            showHistory && (
                <div>
                    <InlineDataRender data={vitals} title="Vitals" />
                    <InlineDataRender data={labs} title="Labs" />
                </div>
            )
        }
    </>
)
