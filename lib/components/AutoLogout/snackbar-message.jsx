import React from 'react';
import * as PropTypes from 'prop-types';

import SnackbarContent from '@material-ui/core/SnackbarContent';

const SnackbarMessage = ({ seconds }) => {
    const [stateSeconds, setStateSeconds] = React.useState(seconds);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStateSeconds(stateSeconds - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [stateSeconds]);

    const secondsLabel = stateSeconds === 1 ? 'second' : 'seconds';

    return (
        <SnackbarContent
            message={`Due to inactivity, you will be logged out in ${stateSeconds} ${secondsLabel}...`}
        />
    );
}

SnackbarMessage.propTypes = {
    seconds: PropTypes.number,
};

SnackbarMessage.defaultProps = {
    seconds: 59,
};

export default SnackbarMessage;
