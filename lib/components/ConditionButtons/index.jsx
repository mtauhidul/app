import React from 'react';

import Button from '@material-ui/core/Button';

export default ({
    dialog: {
        contentType,
    },
    conds = [],
    showSummary = false,
    ui_SetOpenedModal = () => { },
    dialog_SetOpen = () => { },
    openedModal = '',
    centered = false,
    scroll = false,
    ui: {
        clientWidth = 0,
        navigationHeightGeneral = 0,
        scrolledIntoView = '',
    } = {},
}) => (
    <>
        {
            conds.map((label) => {
                const selected = openedModal === label || (scroll && clientWidth > 715 && scrolledIntoView === label);
                return (
                    <Button
                        key={`condition-button-${label}`}
                        variant={selected ? 'contained' : 'text'}
                        color={selected ? 'primary' : 'default'}
                        size="small"
                        style={{
                            fontSize: '0.9em',
                            minWidth: 34,
                            padding: '1px 10px',
                            marginLeft: 0,
                            maringTop: 2,
                            marginBottom: 2,
                            marginRight: 10,

                            ...(!selected ? { background: '#F5F5F8' } : {}),
                            ...(centered ? { marginTop: 'auto', marginBottom: 'auto' } : {}),
                        }}
                        onClick={() => {
                            if (scroll && clientWidth > 715) {
                                document.querySelector('.right-content div div').scrollTop += document.querySelector(`[data-details-label=${label}]`).getBoundingClientRect().top - 20 - navigationHeightGeneral;
                            }
                            else {
                                ui_SetOpenedModal(label)
                                if (contentType !== 'checklist') {
                                    dialog_SetOpen({
                                        contentType: 'condition-details',
                                        headingType: showSummary ? 'patient-summary' : '',
                                    })
                                }
                            }
                        }}
                    >
                        {label}
                    </Button>
                )
            })
        }
    </>
)
