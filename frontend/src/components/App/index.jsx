import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { styled, ThemeProvider, createTheme } from '@material-ui/core/styles'
import React from 'react'
import * as PropTypes from 'prop-types'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LuxonUtils from '@date-io/luxon'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Fab from '@material-ui/core/Fab'

import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop'
import * as actionCreators from '../../redux/action-creators'
import * as lib from '../../lib'
import * as glib from '../../../../lib/utils'

import ErrorDialog from './error'
import Footer from '../Footer/index.jsx'
import Init from '../Init/index.jsx'
import AutoLogout from '../../../../lib/components/AutoLogout/index.jsx'

import Dialog from '../../../../lib/components/DialogSingleton/index.jsx'
import HelpOverlay from '../../../../lib/components/HelpOverlay/index.jsx'

import './style.less'
import './react-hint.less'

class App extends React.Component {
    constructor(props) {
        super(props)
        // Event handlers ----------------------------------------------------------
        this.onResize = () => this.forceUpdate()
        // Refs --------------------------------------------------------------------
        this.refStage = () => (el) => {
            if (el) {
                if (this.props.ui.clientWidth !== el.clientWidth) {
                    this.props.ui_SetClientWidth(el.clientWidth)
                }
                if (this.props.ui.clientHeight !== el.clientHeight) {
                    this.props.ui_SetClientHeight(el.clientHeight)
                }
            }
        }
    }

    UNSAFE_componentWillMount() {
        const appState = this.props.getAppState()
        if (!appState) {
            this.props.historyPush('/', this.props, `/${this.props.uuid}`)
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize)
        document.querySelector('.stage').addEventListener('scroll', this.onResize)

        function scollTopFunction() {
            document.querySelector('.stage').scrollTop = 0
        }

        this.unlisten = this.props.history.listen(scollTopFunction)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        this.unlisten()
    }

    logoutCallback = () => {
        this.props.performLogout(this.props, true)
    }

    noEHRCallback = () => {
        this.props.fhir_SetSampleData()
        this.props.ui_SetLoggedOut(false)
        this.props.ui_SetLoggedOutAuto(false)
        this.props.history.push('/')
    }

    render() {
        const theme = createTheme({
            props: {
                MuiButtonGroup: {
                    disableRipple: true,
                },
                MuiButtonBase: {
                    disableRipple: true,
                },
            },
            transitions: {
                create: () => 'none',
            },
            typography: {
                fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif',
            },
            palette: {
                primary: {
                    light: blue[400],
                    main: blue[600],
                    dark: blue[800],
                    contrastText: '#FFF',
                },
                secondary: {
                    light: grey[700],
                    main: grey[800],
                    dark: grey[900],
                    contrastText: '#FFF',
                },
            },
        })

        const {
            ui: {
                loggedOut,
            },
        } = this.props

        const StyledSnackbarContent = styled(SnackbarContent)({
            '& .MuiSnackbarContent-message': {
                textAlign: 'center',
                width: '100%',
            },
        })
        return (
            <MuiPickersUtilsProvider utils={LuxonUtils}>
                <ThemeProvider theme={theme}>
                    <div
                        className={`app-root ${loggedOut ? 'blurred' : ''}`}
                        ref={this.refStage()}
                    >
                        <ErrorDialog
                            details={this.props.ui.errorDetails}
                            message={this.props.ui.errorMessage}
                            onClose={() => this.props.ui_SetErrorMessage('')}
                        />

                        <Dialog
                            {...this.props}
                            clientWidth={this.props.ui.clientWidth}
                            clientHeight={this.props.ui.clientHeight}
                            dialog_Reset={this.props.dialog_Reset}
                            closeCallback={() => this.props.ui_SetOpenedModal(null)}
                            ui_SetModalHeadingHeight={this.props.ui_SetModalHeadingHeight}
                            modalHeadingHeight={this.props.ui.modalHeadingHeight}
                            ui_SetModalWidth={this.props.ui_SetModalWidth}
                            modalWidth={this.props.ui.modalWidth}
                            ui_SetNavigationHeight={this.props.ui_SetNavigationHeight}
                            navigationHeight={this.props.ui.navigationHeight}
                            footerHeight={this.props.ui.footerHeight}
                            open={this.props.dialog.open}
                            headingType={this.props.dialog.headingType}
                            contentType={this.props.dialog.contentType}
                        />

                        <AutoLogout
                            warnSeconds={20}
                            autoLogoutTime={this.props.ui.logoutMinutes} // Minutes
                            loggedOut={loggedOut}
                            loggedOutAuto={this.props.ui.loggedOutAuto}
                            logoutCallback={this.logoutCallback}
                            noEHRMode={this.noEHRCallback}
                        />
                        <Init {...this.props} />
                        {/* <Navbar {...this.props}/> */}
                        <div className="stage" style={{ marginBottom: this.props.ui.clientWidth > 715 ? 0 : this.props.ui.footerHeight }}>
                            {this.props.children}
                        </div>
                        <Fab
                            className={`scolltop-button ${this?.props?.ui?.stageScroll <= 0 ? 'hidden' : 'visible'}`}
                            color="primary"
                            aria-label="scroll-top"
                            style={{
                                position: 'absolute',
                                right: 10,
                                bottom: (this?.props?.ui?.footerHeight || 0) + 10,
                            }}
                            onClick={() => {
                                document.querySelector('.stage').scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                        >
                            <VerticalAlignTopIcon />
                        </Fab>
                        <Snackbar open={!!this.props.ui.snackbarMessage} autoHideDuration={this.props.ui.snackbarMessageTimeout} style={{ bottom: this.props.ui.footerHeight + 1.5, zIndex: 9000, textAlign: 'center' }} onClose={this.props.ui_HideSnackbarMessage}>
                            <StyledSnackbarContent message={this.props.ui.snackbarMessage} />
                        </Snackbar>
                        <Footer {...this.props} />

                        <HelpOverlay {...this.props} />

                    </div>
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        )
    }
}
App.propTypes = {
    fhir: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    dialog: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    children: PropTypes.any,
    ui_SetClientWidth: PropTypes.func,
    ui_SetClientHeight: PropTypes.func,
    ui_SetOpenedModal: PropTypes.func,
    ui_SetModalHeadingHeight: PropTypes.func,
    ui_SetModalWidth: PropTypes.func,
    ui_SetNavigationHeight: PropTypes.func,
    ui_SetLoggedOut: PropTypes.func,
    ui_SetLoggedOutAuto: PropTypes.func,
    ui_HideSnackbarMessage: PropTypes.func,
    fhir_SetSampleData: PropTypes.func,
    performLogout: PropTypes.func,
    dialog_Reset: PropTypes.func,
    getAppState: PropTypes.func,
    historyPush: PropTypes.func,

}
App.defaultProps = {
    children: null,
    ui_SetClientWidth: () => { },
    ui_SetClientHeight: () => { },
    ui_SetOpenedModal: () => { },
    ui_SetModalHeadingHeight: () => { },
    ui_SetModalWidth: () => { },
    ui_SetNavigationHeight: () => { },
    ui_SetLoggedOut: () => { },
    ui_SetLoggedOutAuto: () => { },
    ui_HideSnackbarMessage: () => { },
    fhir_SetSampleData: () => { },
    performLogout: () => { },
    dialog_Reset: () => { },
    getAppState: () => { },
    historyPush: () => { },
}
const mapStateToProps = (state, ownProps) => ({
    ...glib,
    ...lib,
    ...state,
    ...ownProps,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch)
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App)
export { App, connectedComponent }
export default withRouter(connectedComponent)
