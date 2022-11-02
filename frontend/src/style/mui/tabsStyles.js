import { makeStyles } from '@material-ui/core/styles';

export default (atRiskTabWidth) => makeStyles((theme) => {
    const maxWidth = 100;
    const marginSide = Math.max((atRiskTabWidth - maxWidth) / 2, 0);

    return {
        root: {
            '& span.MuiTabs-indicator': {
                maxWidth,
                marginLeft: marginSide,
                marginRight: marginSide,
            },
        },
    }
});
