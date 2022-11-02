import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const headingStyles = makeStyles(() => ({
    root: { padding: 0 },
}));

const HeadingContainer = ({
    modalHeadingHeight,
    ui_SetModalHeadingHeight,
    children,
}) => {
    const classes = headingStyles()
    const ref = React.useRef(null);

    React.useEffect(() => {
        const height = ref?.current?.offsetHeight;
        if (modalHeadingHeight !== height) {
            ui_SetModalHeadingHeight(height);
        }
    })

    return (
        <div ref={ref} className={classes.root}>
            {children}
        </div>
    )
}

HeadingContainer.propTypes = {
    modalHeadingHeight: PropTypes.number.isRequired,
    ui_SetModalHeadingHeight: PropTypes.func.isRequired,
    children: PropTypes.any,
}

HeadingContainer.defaultProps = {
    children: null,
}

export default HeadingContainer
