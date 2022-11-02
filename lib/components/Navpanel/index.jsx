import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'

import { DatePicker } from '@material-ui/pickers'

import Popover from '@material-ui/core/Popover'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Divider from '@material-ui/core/Divider'

import Checkbox from '@material-ui/core/Checkbox'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import CloseIcon from '@material-ui/icons/Close'
import { DateTime } from 'luxon'

import QRCodeIcon from '../Icons/qr-code.jsx'

import PatientSummary from '../../../frontend/src/components/PatientSummary/index.jsx'
import TutorialData from '../TutorialData/index.jsx'

import PersonMDIcon from '../Icons/md.jsx'

import Logo from '../Logo/index.jsx'

import './style.less'

import ContentFrame from '../ContentFrame/index.jsx'
import ConditionButtons from '../ConditionButtons/index.jsx'
import * as actionCreators from '../../../frontend/src/redux/action-creators'
import * as lib from '../../../frontend/src/lib'
import * as glib from '../../utils'

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex' },
    userPanelContainer: {
        whiteSpace: 'nowrap', margin: 'auto 0', display: 'flex', flexGrow: 1, flexDirection: 'row-reverse', height: '100%',
    },
    genericUserButton: { textTransform: 'capitalize', margin: 'auto 0' },
    userIconButton: {
        padding: 8,
        background: '#E3E6EB',
        '& .MuiSvgIcon-root': {
            fill: '#000',
        },
        transition: 'background 1s linear',
        '&:hover': {
            background: 'hsl(217deg 17% 78%)',
        },
    },
}))

const NavpanelComponent = (props) => {
    const classes = useStyles()

    const {
        dialog,
        fhir,
        fhir: {
            parsed: {
                patientDemographics: {
                    data: patientDetails,
                    data: {
                        notification = [],
                        smartId,
                        conds,
                    },
                },
                user: {
                    data: userData,
                },
                patientList: {
                    data: PatientList,
                    search: {
                        sort,
                        filter,
                        startDate,
                        endDate,
                        keywords = [],
                    },
                },
            },
            smart: {
                data: {
                    patient: {
                        id: patientId = null,
                    } = {},
                } = {},
            } = {},
        },
        ui,
        ui: {
            navigationHeightGeneral,
            navigationHeight,
            openedModal,
            clientWidth,
            loggedOut,
        },
        noFlagged = false,
        ui_SetNavigationHeight,
        ui_SetNavigationHeightGeneral,
        ui_SetOpenedModal,
        inDialog = false,
        dialog_SetOpen,
        fhir_SetSearchKeyword,
        fhir_SetSearchSort,
        fhir_ToggleSearchFilter,
        fhir_SetSearchStartDate,
        fhir_SetSearchEndDate,
        ui_SetPatientInfoTab,
        fhir_ResetSearchFilter,
        tutorial_SetOpen,
    } = props

    const patientSelected = !!smartId && !!patientId

    const ref = React.useRef(null)

    React.useEffect(() => {
        const height = ref?.current?.offsetHeight
        if (inDialog && navigationHeight !== height) {
            ui_SetNavigationHeight(height)
        }

        if (!inDialog && navigationHeightGeneral !== height) {
            ui_SetNavigationHeightGeneral(height)
        }
    })

    const [sortOpen, setSortOpen] = React.useState(null)

    const [filterOpen, setFilterOpen] = React.useState(null)

    const [tutorial, setTutorial] = React.useState(null)

    const [tutorialIndex, setTutorialIndex] = React.useState(null)

    React.useEffect(() => {
        const tutorials = Array.from(document.querySelectorAll('[data-tutorial-mode=provider]'))

        const currentTutorial = tutorials.find((tutorial) => +tutorial.getAttribute('data-tutorial-idx') === tutorialIndex)

        if (currentTutorial) {
            setTutorial(currentTutorial)
        }
        else {
            setTutorialIndex(null)
            setTutorial(null)
        }
    }, [tutorialIndex])

    const condCount = PatientList.reduce((reducedProp, { conds }) => {
        const reduced = reducedProp

        conds.forEach((cond) => {
            if (reduced[cond]) {
                reduced[cond] += 1
            }
            else {
                reduced[cond] = 1
            }
        })
        return reduced
    }, {})

    const newNotificationsLength = notification.reduce((count, item) => {
        if (item.viewed) {
            return count
        }
        return count + 1
    }, 0)

    const userPanel = (
        <div className={classes.userPanelContainer}>

            <IconButton
                data-tutorial="1"
                data-tutorial-shape="rect"
                data-tutorial-radius="full"
                data-tutorial-key="bell"
                data-tutorial-order="6"
                disableRipple={!newNotificationsLength}
                className={`${classes.genericUserButton} ${classes.userIconButton}`}
                style={{
                    marginLeft: 5,
                    marginRight: 10,
                    ...(notification.length ? {} : { opacity: 0.3, cursor: 'not-allowed' }),
                }}
                onClick={() => {
                    if (notification.length) {
                        dialog_SetOpen({
                            contentType: 'notifications',
                            headingType: 'notifications',
                        })
                    }
                }}
            >
                <Badge overlap="rectangular" max={99} badgeContent={newNotificationsLength} color="primary">
                    <NotificationsNoneOutlinedIcon />
                </Badge>
            </IconButton>

            <IconButton
                data-tutorial="1"
                data-tutorial-shape="rect"
                data-tutorial-radius="full"
                data-tutorial-key="user"
                data-tutorial-order="5"
                className={`${classes.genericUserButton} ${classes.userIconButton}`}
                style={{ marginRight: 5, marginLeft: 10 }}
                onClick={() => {
                    dialog_SetOpen({
                        headingType: 'user-details',
                        contentType: 'user-details',
                    })
                }}
            >
                <PersonMDIcon />
            </IconButton>
            <div className={classes.genericUserButton}>
                {userData?.name}
            </div>

            {
                !patientSelected && (
                    <>
                        <div style={{ flexGrow: 1 }} />
                        &nbsp;

                        <IconButton
                            data-tutorial="1"
                            data-tutorial-shape="rect"
                            data-tutorial-radius="full"
                            data-tutorial-key="qr"
                            data-tutorial-order="4"
                            style={{ margin: 'auto 2px' }}
                            size="small"
                            onClick={() => {
                                dialog_SetOpen({
                                    contentType: 'qr-code',
                                    headingType: '',
                                })
                            }}
                        >
                            <QRCodeIcon />
                        </IconButton>

                        &nbsp;
                        &nbsp;

                        <IconButton
                            data-tutorial="1"
                            data-tutorial-shape="rect"
                            data-tutorial-radius="full"
                            data-tutorial-key="help"
                            style={{ margin: 'auto 2px' }}
                            size="small"
                            onClick={() => {
                                tutorial_SetOpen()
                                // setTutorialIndex(1)
                            }}
                        >
                            <HelpOutlineIcon />
                        </IconButton>

                        &nbsp;
                        &nbsp;

                        <Button
                            data-tutorial="1"
                            data-tutorial-shape="rect"
                            data-tutorial-key="filter"
                            data-tutorial-order="3"
                            className={classes.genericUserButton}
                            size="small"
                            color={filterOpen ? 'primary' : 'default'}
                            onClick={({ currentTarget }) => setFilterOpen(currentTarget)}
                            endIcon={<ExpandMoreIcon />}
                        >
                            Filter
                        </Button>

                        &nbsp;
                        &nbsp;

                        <Button
                            data-tutorial="1"
                            data-tutorial-shape="rect"
                            data-tutorial-key="sort"
                            data-tutorial-order="2"
                            className={classes.genericUserButton}
                            size="small"
                            color={sortOpen ? 'primary' : 'default'}
                            onClick={({ currentTarget }) => setSortOpen(currentTarget)}
                            endIcon={<ExpandMoreIcon />}
                        >
                            Sort
                        </Button>

                        <Popover
                            open={!!tutorial}
                            anchorEl={tutorial}
                            onClose={() => setTutorialIndex(tutorialIndex + 1)}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                            }}
                        >
                            <TutorialData mode="provider" idx={tutorialIndex} />
                        </Popover>

                        <Popover
                            className={loggedOut ? 'blurred' : ''}
                            open={!!sortOpen}
                            anchorEl={sortOpen}
                            onClose={() => setSortOpen(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <RadioGroup
                                aria-label="sort"
                                name="sort"
                                value={sort}
                                style={{ padding: 20 }}
                                onChange={(_e, value) => fhir_SetSearchSort(value)}
                            >
                                <FormControlLabel value="risk-desc" control={<Radio />} label="Risk Level (High to Low)" />
                                <FormControlLabel value="risk-asc" control={<Radio />} label="Risk Level (Low to High)" />

                                <br />
                                <Divider />
                                <br />

                                <FormControlLabel value="los-desc" control={<Radio />} label="LOS (High to Low)" />
                                <FormControlLabel value="los-asc" control={<Radio />} label="LOS (Low to High)" />
                            </RadioGroup>
                        </Popover>

                        <Popover
                            className={loggedOut ? 'blurred' : ''}
                            open={!!filterOpen}
                            anchorEl={filterOpen}
                            onClose={() => setFilterOpen(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <div style={{ width: 250, padding: 20, paddingTop: 10 }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
                                        <Button
                                            // disabled={
                                            //     !Object.keys(condCount).reduce((reduced, key) => {
                                            //         return reduced || filter[key]
                                            //     }, false)
                                            // }
                                            style={{ margin: '0 auto' }}
                                            onClick={fhir_ResetSearchFilter}
                                            size="small"
                                            startIcon={<DeleteSweepIcon style={{ width: 16, height: 16 }} />}
                                        >
                                            Clear filters
                                        </Button>
                                    </div>
                                    {
                                        Object.keys(condCount)
                                            .map((key) => {
                                                const count = condCount[key]

                                                return (
                                                    <div key={`filter-${key}`} style={{ flexGrow: 1, maxWidth: '50%' }}>
                                                        <FormControlLabel
                                                            style={{ marginRight: 8 }}
                                                            control={(
                                                                <Checkbox
                                                                    checked={filter[key] || false}
                                                                    onChange={() => fhir_ToggleSearchFilter(key)}
                                                                    name={key}
                                                                />
                                                            )}
                                                            label={key}
                                                        />
                                                        <span style={{ fontSize: '0.7em' }}>
                                                            {count}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                                <br />
                                <Divider />
                                <br />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <DatePicker
                                        autoOk
                                        emptyLabel="Begining of time"
                                        variant="inline"
                                        label="Start Date"
                                        value={startDate ? DateTime.fromISO(startDate) : null}
                                        onChange={fhir_SetSearchStartDate}
                                        maxDate={new Date(endDate || '2100-12-31')}
                                    />
                                    <br />
                                    <DatePicker
                                        autoOk
                                        emptyLabel="End of time"
                                        variant="inline"
                                        label="End Date"
                                        value={endDate ? DateTime.fromISO(endDate) : null}
                                        onChange={fhir_SetSearchEndDate}
                                        minDate={new Date(startDate || '1900-01-01')}
                                    />
                                </div>
                            </div>
                        </Popover>
                        &nbsp;
                        &nbsp;

                    </>
                )
            }
        </div>
    )

    const searchRef = React.useRef(null)

    return (
        <>
            <Paper ref={ref} elevation={0} square className={`demographics ${classes.root}`} style={{ borderBottom: '1px solid #DDD' }}>
                {
                    patientSelected
                        ? (
                            <div style={{ width: '100%', display: 'flex', flexDirection: clientWidth <= 715 ? 'column' : 'row' }}>
                                <Logo />

                                <>
                                    <PatientSummary
                                        {...patientDetails}
                                        ui_SetPatientInfoTab={ui_SetPatientInfoTab}
                                        fhir={fhir}
                                        compact
                                        dialog_SetOpen={dialog_SetOpen}
                                        hideDialogHeading
                                        showDetails
                                        data={(
                                            <ConditionButtons
                                                dialog={dialog}
                                                conds={conds}
                                                openedModal={openedModal}
                                                ui_SetOpenedModal={ui_SetOpenedModal}
                                                dialog_SetOpen={dialog_SetOpen}
                                                ui={ui}
                                                scroll
                                            />
                                        )}
                                    />
                                </>
                                {userPanel}
                            </div>
                        )
                        : (
                            <ContentFrame
                                left={(
                                    <Typography className="bordered" variant="h1">
                                        <div style={{ display: 'flex' }}>
                                            <Logo />
                                            <Paper
                                                data-tutorial-order="1"
                                                data-tutorial="1"
                                                data-tutorial-shape="rect"
                                                data-tutorial-key="search"
                                                elevation={0}
                                                style={{
                                                    flexGrow: 1, margin: 'auto 0', marginRight: 5, background: '#F5F5F8', display: 'flex',
                                                }}
                                            >
                                                <SearchIcon style={{ margin: 'auto 5px' }} />
                                                <InputBase
                                                    style={{ flexGrow: 1 }}
                                                    placeholder="Search Patients"
                                                    onChange={({ currentTarget: { value } }) => {
                                                        fhir_SetSearchKeyword(value)
                                                    }}
                                                    inputProps={{ ref: searchRef }}
                                                />
                                                <IconButton
                                                    disabled={!keywords.length}
                                                    data-rh="Clear search"
                                                    size="small"
                                                    style={{
                                                        margin: 'auto 5px',
                                                        cursor: keywords.length ? 'pointer' : 'not-allowed',
                                                    }}
                                                    onClick={() => {
                                                        if (searchRef?.current?.value) {
                                                            searchRef.current.value = ''
                                                        }
                                                        fhir_SetSearchKeyword('')
                                                    }}
                                                >
                                                    <CloseIcon style={{ width: 16, height: 16 }} />
                                                </IconButton>
                                            </Paper>
                                        </div>
                                    </Typography>
                                )}
                            >
                                {userPanel}
                            </ContentFrame>
                        )
                }
            </Paper>
        </>
    )
}

NavpanelComponent.propTypes = {
    fhir: PropTypes.any.isRequired,
    ui: PropTypes.any.isRequired,
    ui_SetNavigationHeight: PropTypes.func,
    ui_SetNavigationHeightGeneral: PropTypes.func,
    ui_SetOpenedModal: PropTypes.func,
    dialog_SetOpen: PropTypes.func,
    fhir_SetSearchKeyword: PropTypes.func,
    fhir_SetSearchSort: PropTypes.func,
    fhir_ToggleSearchFilter: PropTypes.func,
    fhir_SetSearchStartDate: PropTypes.func,
    fhir_SetSearchEndDate: PropTypes.func,
    ui_SetPatientInfoTab: PropTypes.func,
    fhir_ResetSearchFilter: PropTypes.func,
    tutorial_SetOpen: PropTypes.func,
    inDialog: PropTypes.bool,
}

NavpanelComponent.defaultProps = {
    ui_SetNavigationHeight: () => { },
    ui_SetNavigationHeightGeneral: () => { },
    ui_SetOpenedModal: () => { },
    dialog_SetOpen: () => { },
    fhir_SetSearchKeyword: () => { },
    fhir_SetSearchSort: () => { },
    fhir_ToggleSearchFilter: () => { },
    fhir_SetSearchStartDate: () => { },
    fhir_SetSearchEndDate: () => { },
    ui_SetPatientInfoTab: () => { },
    fhir_ResetSearchFilter: () => { },
    tutorial_SetOpen: () => { },
    inDialog: false,
}

const mapStateToProps = (state, ownProps) => ({
    ...glib,
    ...lib,
    ...state,
    ...ownProps,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch)
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(NavpanelComponent)
export { NavpanelComponent, connectedComponent }
export default connectedComponent
