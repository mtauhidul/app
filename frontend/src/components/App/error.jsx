import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '../../../../lib/components/Dialog'
import DialogCloseIconButton from '../../../../lib/components/DialogCloseIconButton'

const useStyles = makeStyles((theme) => {
    return {
        message: {
            display: 'flex',
            color: theme.palette.primary.main,
            fontSize: '1.5em',
            fontFamily: 'Nunito Sans',
            '& svg': {
                color: theme.palette.primary.main,
            },
            '& span': {
                margin: 'auto 0',
                marginRight: 'auto'
            },
            '& .MuiAvatar-root': {
                background: '#FFF',
                margin: 'auto 0',
            },
            '& button.MuiButtonBase-root.MuiIconButton-root': {
                marginBottom: 'auto',
            }
        },
        dialogContent: {
            paddingRight: 20,
            paddingLeft: 15,
            paddingTop: 15,
            paddingBottom: 15,
        },
        details: {
            '& pre': {
                margin: '25px 10px',
                padding: 15,
                background: 'rgba(0,0,0,0.1)'
            },
            '& pre.title': {
                whiteSpace: 'break-spaces'
            }
        }
    }
})

export default ({
    message,
    details,
    onClose = (() => {
        // Empty fallback
    }),
}) => {
    const classes = useStyles()

    const [open, setOpen] = React.useState(false)

    let detailsText = ''

    try {
        detailsText = JSON.stringify(JSON.parse(details?.text || '{}'), null, 4)
    } catch { }

    const hasDetails = !!details

    let url

    try {
        url = new URL(details.url)
    } catch { }

    return (
        <Dialog
            open={!!message}
            maxWidth='lg'
        >
            <DialogCloseIconButton onClick={onClose} />
            <DialogContent className={classes.dialogContent}>
                <div className={classes.message}>
                    <Avatar>
                        <ErrorOutlineIcon />
                    </Avatar>
                    <span>
                        {message}
                    </span>
                    {
                        hasDetails &&
                        <Tooltip title='View details' arrow>
                            <IconButton
                                onClick={() => setOpen(!open)}
                            >
                                {
                                    open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                                }
                            </IconButton>
                        </Tooltip>
                    }
                </div>
                {
                    hasDetails &&

                    <Collapse in={open} unmountOnExit>
                        <div className={classes.details}>
                            {
                                !!url &&
                                <pre className='title'>
                                    {details.options.method || 'GET'}: {url ? `${url.protocol}//${url.hostname}/${url.pathname}` : '-'}
                                </pre>
                            }
                            {
                                !!detailsText &&
                                <pre>
                                    {detailsText}
                                </pre>
                            }
                        </div>
                    </Collapse>
                }
            </DialogContent>
        </Dialog>
    )
}