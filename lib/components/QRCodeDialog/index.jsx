import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';

import QRCode from 'qrcode.react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = (customStyle) => makeStyles({
    card: {
        display: 'flex',
        flexDirection: 'column',
        padding: customStyle.cardPadding,
    },
    codeContainer: {
        margin: 'auto',
    },
    title: {
        fontSize: '1.3em',
        fontWeight: 900,
        textAlign: 'center',
    },
    body: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
});

const QRCodeDialog = ({
    clientHeight,
    footerHeight,
    navigationHeight,
    modalWidth,
    margin = 32,
    title = '',
    body = '',
    url = '',
}) => {
    const customStyles = {
        cardPadding: 10,
    };

    const classes = useStyles(customStyles)();
    const ref = React.useRef(null);

    const [titleHeight, setTitleHeight] = React.useState(0);

    React.useEffect(() => {
        const height = ref?.current?.offsetHeight;
        if (titleHeight !== height) {
            setTitleHeight(height);
        }
    }, [titleHeight, ref?.current?.offsetHeight]);

    const qrCodeSize = Math.min(
        clientHeight - footerHeight - navigationHeight - 2 * margin - 2 * customStyles.cardPadding - titleHeight - 5,
        modalWidth - 15,
    );

    return (
        <Card className={classes.card}>
            <div ref={ref}>
                <div className={classes.title}>
                    {title}
                </div>
                <div className={classes.body}>
                    {body}
                </div>
            </div>
            <div className={classes.codeContainer}>
                <a href={url} target="_blank" rel="noreferrer">
                    <QRCode
                        size={qrCodeSize}
                        value={url}
                    />
                </a>
            </div>
        </Card>
    )
}

QRCodeDialog.propTypes = {
    clientHeight: PropTypes.number.isRequired,
    footerHeight: PropTypes.number.isRequired,
    navigationHeight: PropTypes.number.isRequired,
    modalWidth: PropTypes.number.isRequired,
    margin: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    url: PropTypes.string,
}

QRCodeDialog.defaultProps = {
    margin: 32,
    title: '',
    body: '',
    url: '',
}

export default QRCodeDialog
