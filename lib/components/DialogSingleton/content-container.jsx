import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const contentContainerStyles = makeStyles(() => ({
    root: { width: '100%', height: '100%' },
}));

const ContentContainer = ({
    children,
    ui_SetModalWidth,
    modalWidth,
}) => {
    const ref = React.useRef(null);

    const classes = contentContainerStyles();

    React.useEffect(() => {
        const width = ref?.current?.offsetWidth;

        if (modalWidth !== width) {
            ui_SetModalWidth(width);
        }
    })

    return (
        <div ref={ref} className={classes.root}>
            {children}
        </div>
    )
}

ContentContainer.propTypes = {
    children: PropTypes.any,
    ui_SetModalWidth: PropTypes.func.isRequired,
    modalWidth: PropTypes.number.isRequired,
}

ContentContainer.defaultProps = {
    children: null,
}

export default ContentContainer
