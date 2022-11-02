import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    paper: {
        background: 'rgb(242, 246, 254)',
    },
})

const PaperContainer = ({ elevation = 0, style = {}, children = null }) => {
    const classes = useStyles();

    return (
        <Paper elevation={elevation} className={classes.paper} style={style}>
            {children}
        </Paper>
    )
}

PaperContainer.propTypes = {
    elevation: PropTypes.number,
    style: PropTypes.object,
    children: PropTypes.any,
}

PaperContainer.defaultProps = {
    elevation: 0,
    style: {},
    children: null,
}

export default PaperContainer
