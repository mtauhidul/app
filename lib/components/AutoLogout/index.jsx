import React from 'react';
import * as PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import SnackbarMessage from './snackbar-message.jsx';

import './style.less';

const events = [
    'load',
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress',
    'touchstart',
    'touchmove',
    'touchend',
    'touchdown',
];

const getLogoutInfo = () => (
    <>
        <DialogTitle> Logged Out </DialogTitle>
        <DialogContent>
            <p>
                You&apos;re now logged out.
            </p>
        </DialogContent>
    </>
)

const getAutoLogoutInfo = ({ autoLogoutTime }) => (
    <>
        <DialogTitle> Logged Out </DialogTitle>
        <DialogContent>
            <p>
                You were automatically logged out, because you were inactive for
                {' '}
                <strong>{autoLogoutTime}</strong>
                {' '}
                {autoLogoutTime === 1 ? 'minute' : 'minutes'}
                .
            </p>
        </DialogContent>
    </>
)

const setLogoutTimeout = (setShowWarning, {
    loggedOut,
    autoLogoutTime,
    warnSeconds,
    logoutCallback,
    warningCallback,
}) => {
    if (!loggedOut) {
        const logoutTime = autoLogoutTime * 60 * 1000;
        const warnTime = warnSeconds * 1000;
        const warnDelta = logoutTime - warnTime;

        warnTimeout = setTimeout(() => {
            warn(setShowWarning, warningCallback)
        }, warnDelta);
        logoutTimeout = setTimeout(() => logout({ logoutCallback }), logoutTime);
    }
}

const clearLogoutTimeout = (warnTimeout, logoutTimeout) => {
    if (warnTimeout) {
        window.clearTimeout(warnTimeout);
    }
    if (logoutTimeout) {
        window.clearTimeout(logoutTimeout);
    }
}

const resetTimeout = (setShowWarning, warnTimeout, logoutTimeout, props) => {
    setShowWarning(false);

    // Callback
    clearLogoutTimeout(warnTimeout, logoutTimeout);
    setLogoutTimeout(setShowWarning, props);
}

const warn = (setShowWarning, warningCallback) => {
    setShowWarning(true)

    // Callback
    warningCallback()
}

const logout = ({ logoutCallback }) => logoutCallback()

let warnTimeout = null;
let logoutTimeout = null;

const AutoLogout = (props) => {
    const [showWarning, setShowWarning] = React.useState(false)

    React.useEffect(() => {
        events.forEach((event) => {
            window.addEventListener(event, () => resetTimeout(setShowWarning, warnTimeout, logoutTimeout, props));
        });
        setLogoutTimeout(setShowWarning, props);
    }, [])

    if (props.loggedOut) {
        return (
            <Dialog
                open
                fullWidth
                maxWidth="xs"
            >
                {props.loggedOutAuto ? getAutoLogoutInfo(props) : getLogoutInfo()}
            </Dialog>
        );
    }

    if (showWarning) {
        return (
            <Snackbar
                className="auto-logout-warning"
                open
                autoHideDuration={0}
            >
                <SnackbarMessage seconds={props.warnSeconds} />
            </Snackbar>
        )
    }
    return null;
}

AutoLogout.propTypes = {
    warningCallback: PropTypes.func,
    logoutCallback: PropTypes.func,
    loggedOut: PropTypes.bool,
    autoLogoutTime: PropTypes.number,
    warnSeconds: PropTypes.number,
    noEHRMode: PropTypes.func,
};

AutoLogout.defaultProps = {
    warningCallback: () => {
        // emtpy fallback
    },
    logoutCallback: () => {
        // emtpy fallback
    },
    noEHRMode: () => {
        // emtpy fallback
    },
    loggedOut: true,
    autoLogoutTime: 10, // minutes
    warnSeconds: 59,
};

export default AutoLogout;
