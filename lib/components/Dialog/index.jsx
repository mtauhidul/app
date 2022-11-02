import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles((theme) => ({
    patientDialog: {
        '& .MuiPaper-root': {
            background: 'transparent',
            boxShadow: 'none',
            '& > div': {
                overflowY: 'auto',
                background: '#FFF',
                margin: 15,
            },
            overflow: 'hidden',
        },
        '& .MuiDialogTitle-root': {
            color: theme.palette.common.white,
            background: theme.palette.primary.main,
            fontSize: '1.25rem',
        },
        '& .MuiTabs-root': {
            color: theme.palette.common.white,
            background: theme.palette.primary.main,
            '& .MuiTabs-flexContainer': {
                width: '100%',
            },
            '& button': {
                flexGrow: 1,
                fontSize: '1.25rem',
                textTransform: 'capitalize',
                paddingTop: 16,
                paddingBottom: 16,
            },
            '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.common.white,
                height: 4,
            },
        },
    },
}))

export default (props) => {
    const classes = useStyles(props)

    return (
        <Dialog
            {...props}
            open={!!props.open}
            className={classes.patientDialog}
        />
    )
}
