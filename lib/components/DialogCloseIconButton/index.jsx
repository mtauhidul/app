import React from 'react'

import IconButton from '@material-ui/core/IconButton'

import CloseIcon from '@material-ui/icons/Close'

export default ({
    disabled = false,
    onClick = (() => {
        // Empty fallback
    }),
}) => (
    <IconButton
        disabled={disabled}
        style={{
            zIndex: 1,
            position: 'absolute',
            right: 0,
            top: 0,
            background: '#000',
            color: '#FFF',
            padding: 3,
            border: '2px solid #FFF',
            opacity: disabled ? 0.85 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={onClick}
    >
        <CloseIcon
            style={{
                strokeWidth: 2,
                stroke: '#FFF',
                zIndex: 20,
            }}
        />
    </IconButton>
)
