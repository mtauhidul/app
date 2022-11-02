import React from 'react';
import * as PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import PrevPageIcon from '@material-ui/icons/NavigateBefore';
import NextPageIcon from '@material-ui/icons/NavigateNext';
import './style.less';

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationOpen: false,
        };
        // Renderers ----------------------------------------------------------------------------------
        this.renderPageSelector = () => {
            const { maxPages, currentPage } = this.props;
            const totalPages = this.getTotalPages() || 0;
            const manyPages = totalPages > maxPages;
            const buttonWidth = Math.round((100 / maxPages) * 100) / 100;
            let select = false;
            return (
                <div className="pagination-menu-page-selector-container">
                    {new Array(totalPages).fill(null).map((_i, idx) => {
                        const num = idx + 1;
                        const onPage = num === currentPage;
                        if (manyPages && idx > 2 && idx && idx < totalPages - 3) {
                            if (!select) {
                                select = true;
                                return (
                                    <Select key={`pagination-select-${idx}`} className="pagination-select-additional" renderValue={this.renderSelectValue} value={currentPage} onClick={this.goToPage(num)}>
                                        {new Array(totalPages).fill(null).map((_item, jdx) => (
                                            <MenuItem key={`pagination-select-item-${jdx}`} value={jdx + 1}>
                                                {' '}
                                                {jdx + 1}
                                                {' '}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                );
                            }
                            return null;
                        }
                        return (
                            <ButtonBase
                                className="pagination-select-button"
                                key={`pagination-button-${idx}`}
                                style={{
                                    color: onPage ? '#FFF' : 'initial',
                                    background: onPage ? '#d62b1f' : 'transparent',
                                    flexBasis: `${buttonWidth}%`,
                                }}
                                onClick={this.goToPage(num)}
                                color={num === currentPage ? 'primary' : 'default'}
                            >
                                {idx + 1}
                            </ButtonBase>
                        );
                    })}
                </div>
            );
        };
        this.renderPageSizeSelector = () => {
            const { pageSize } = this.props;
            return (
                <FormControl className="pagination-menu-page-size-selector">
                    <InputLabel id="page-size-label"> Patients on page </InputLabel>
                    <Select labelId="page-size-label" value={pageSize} onChange={this.setPageSize}>
                        {this.props.pageSizes.map((size) => (
                            <MenuItem key={`page-size-${size}`} value={size}>
                                {' '}
                                {size}
                                {' '}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        };
        this.renderButton = () => {
            const props = {
                id: 'paginaton-button',
                onClick: this.openPagination,
            };
            return (
                <ButtonBase {...props}>
                    {' '}
                    {this.getButtonText()}
                    {' '}
                </ButtonBase>
            );
        };
        this.renderPageMoveButtons = () => {
            const { currentPage, loading } = this.props;
            return (
                <>
                    <IconButton data-rh="Previous Page" disabled={currentPage === 1 || loading} onClick={this.movePage(-1)}>
                        <PrevPageIcon />
                    </IconButton>
                    <IconButton data-rh="Next Page" disabled={currentPage >= this.getTotalPages() || loading} onClick={this.movePage(1)}>
                        <NextPageIcon />
                    </IconButton>
                </>
            );
        };
        // Texts --------------------------------------------------------------------------------------
        this.getButtonText = () => {
            const {
                loading, pageSize, currentPage, totalItems,
            } = this.props;
            const startItem = (currentPage - 1) * pageSize + 1;
            const endItem = Math.min(startItem + pageSize, totalItems);
            return loading ? '' : `${startItem} - ${endItem} of ${totalItems}`;
        };
        this.getPageText = () => {
            const { currentPage } = this.props;
            const totalPages = this.getTotalPages();
            return `Page ${currentPage} of ${totalPages}`;
        };
        // Event handlers -----------------------------------------------------------------------------
        this.openPagination = () => this.setState({ paginationOpen: true });
        this.closePagination = () => this.setState({ paginationOpen: false });
        this.movePage = (step) => () => {
            const { currentPage } = this.props;
            const minPage = 1;
            const maxPage = this.getTotalPages();
            const newPage = Math.min(Math.max(minPage, currentPage + step), maxPage);
            this.props.goToPage(newPage);
        };
        this.renderSelectValue = () => <span />;
        this.goToPage = (num) => () => this.setState({ paginationOpen: false }, () => this.props.goToPage(num));
        this.setPageSize = (e) => this.setState({ paginationOpen: false }, () => this.props.setPageSize(e.target.value));
        // Helper functions ---------------------------------------------------------------------------
        this.getTotalPages = () => {
            const { totalItems, pageSize } = this.props;
            return Math.ceil(totalItems / pageSize);
        };
    }

    render() {
        return (
            <div className="pagination-container">
                {this.renderButton()}
                {this.renderPageMoveButtons()}
                <Menu anchorEl={document.getElementById('paginaton-button')} onClose={this.closePagination} open={this.state.paginationOpen}>
                    <div className="pagination-menu-container">
                        <div className="pagination-size">
                            <div className="pagination-menu-page-text">
                                {' '}
                                {this.getPageText()}
                                {' '}
                            </div>
                            {this.renderPageSizeSelector()}
                        </div>
                        <br />
                        {this.renderPageSelector()}
                    </div>
                </Menu>
            </div>
        );
    }
}
Pagination.propTypes = {
    maxPages: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    loading: PropTypes.bool,
    currentPage: PropTypes.number,
    totalItems: PropTypes.number,
    goToPage: PropTypes.func,
    setPageSize: PropTypes.func,
};
Pagination.defaultProps = {
    maxPages: 7,
    pageSizes: [10, 20, 30, 40, 50],
    pageSize: 10,
    loading: false,
    currentPage: 0,
    totalItems: 0,
    goToPage: () => { },
    setPageSize: () => { },
};
