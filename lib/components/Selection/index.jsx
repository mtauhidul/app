import React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import CheckAllIcon from '@material-ui/icons/LibraryAddCheck';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './style.less';

class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false,
        };
        // Event handlers -----------------------------------------------------------------------------
        this.openMenu = (cb = () => { }) => () => this.setState({ openMenu: true }, cb);
        this.closeMenu = (cb = () => { }) => () => this.setState({ openMenu: false }, cb);
        this.selectAll = this.closeMenu(() => this.props.select('all'));
        this.deselectAll = this.closeMenu(() => this.props.deselect('all'));
        this.selectPage = this.closeMenu(() => this.props.select(this.props.pageItems));
        this.deselectPage = this.closeMenu(() => this.props.deselect(this.props.pageItems));
        this.onCheckboxChange = () => {
            if (this.props.selectedAllOnPage) {
                this.props.deselect(this.props.pageItems);
            }
            else {
                this.props.select(this.props.pageItems);
            }
        };
    }

    render() {
        return (
            <div className="pagination-container">
                <Menu anchorEl={document.getElementById('select-all')} open={this.state.openMenu} onClose={this.closeMenu()}>
                    <MenuItem onClick={this.selectAll}>
                        Select all available items
                    </MenuItem>

                    <MenuItem onClick={this.deselectAll}>
                        Deselect all selected items
                    </MenuItem>

                    <Divider style={{ marginTop: 2, marginBottom: 2 }} />

                    <MenuItem onClick={this.selectPage}>
                        Selected items on current page
                    </MenuItem>

                    <MenuItem onClick={this.deselectPage}>
                        Deselect items on current page
                    </MenuItem>
                </Menu>
                <Checkbox className="checkbox" disabled={this.props.disabled} data-rh="Select all on current page" color="primary" edge="start" checked={this.props.selectedAllOnPage} tabIndex={-1} indeterminate={this.props.selectedOnPage.length > 0 && this.props.selectedOnPage.length < this.props.pageSize} checkedIcon={<CheckAllIcon />} onChange={this.onCheckboxChange} />
                <Button disabled={this.props.disabled} id="select-all" onClick={this.openMenu()}>
                    <KeyboardArrowDownIcon style={{ width: 12 }} />
                </Button>
            </div>
        );
    }
}

Selection.propTypes = {
    selectedAllOnPage: PropTypes.bool,
    selectedOnPage: PropTypes.array,
    pageSize: PropTypes.number,
    select: PropTypes.func,
    deselect: PropTypes.func,
    disabled: PropTypes.bool,
    pageItems: PropTypes.arrayOf,
}

Selection.defaultProps = {
    selectedOnPage: [],
    disabled: false,
    selectedAllOnPage: false,
    pageSize: 0,
    select: () => { },
    deselect: () => { },
    pageItems: [],
}

export default Selection
