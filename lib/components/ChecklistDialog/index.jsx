import React from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import PersonNurse from '../Icons/nurse.jsx';

export default ({
    openedModal,
    dialog,
    checklist = {},
    checklist_CheckCalledDoctor,
    checklist_CheckReviewChart,
    checklist_CheckBundle,
}) => {
    if (checklist?.calledDoctor?.[openedModal] && checklist?.reviewedChart?.[openedModal]) {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ margin: 'auto 10px' }}>
                    {' '}
                    <PersonNurse style={{ width: 50, height: 50 }} />
                    {' '}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h5>
                        {' '}
                        {openedModal}
                        {' '}
                        Bundle items
                        {' '}
                    </h5>
                    <div style={{ display: 'flex', marginBottom: 10 }}>
                        <div style={{
                            padding: 20, borderRadius: 4, border: '1px solid #00b3b3', marginBottom: 'auto', marginRight: 10,
                        }}
                        >
                            {' '}
                            2:45:01
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                [
                                    'Antibiotics',
                                    'IV Fluid',
                                    'Lactate',
                                    'Blood Culture',
                                ].map((title) => {
                                    const key = `${openedModal}-${title}`;

                                    return (
                                        <div key={key} style={{ width: '50%', marginRight: 0 }}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={(checklist.bundle?.[openedModal] || []).includes(title) || false}
                                                        onChange={() => {
                                                            checklist_CheckBundle({
                                                                check: openedModal,
                                                                item: title,
                                                            });
                                                        }}
                                                        name={title}
                                                    />
                                                )}
                                                label={title}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (checklist?.calledDoctor?.[openedModal]) {
        return (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0, textAlign: 'center' }}> Review chart </h3>
                <br />
                <Button
                    style={{ margin: '0 auto' }}
                    onClick={() => checklist_CheckReviewChart(openedModal)}
                >
                    Check
                </Button>
            </div>
        )
    }

    return (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, textAlign: 'center' }}> Call doctor </h3>
            <br />
            <Button
                style={{ margin: '0 auto' }}
                onClick={() => checklist_CheckCalledDoctor(openedModal)}
            >
                Check
            </Button>
        </div>
    )
}
