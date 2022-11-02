import Divider from '@material-ui/core/Divider';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as glib from '../../../../lib/utils';
import * as lib from '../../lib';
import * as actionCreators from '../../redux/action-creators';
import './style.less';

const NavbarComponent = (props) => (
  <nav className='app-navbar no-print'>
    <div className='container' style={{ padding: '5px 0', display: 'flex' }}>
      <h1 style={{ margin: 'auto 0px' }}> App </h1>
      <div style={{ flexGrow: 1 }} />
      <div className='logo'>
        <img width={110} height={34} src='/img/logo.png' alt='Logo' />
      </div>
    </div>
    <Divider />
  </nav>
);
NavbarComponent.propTypes = {
  history: PropTypes.object.isRequired,
};
const mapStateToProps = (state, ownProps) => ({
  ...glib,
  ...lib,
  ...state,
  ...ownProps,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actionCreators }, dispatch);
export const Navbar = NavbarComponent;
export const NavbarConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarComponent);
export default NavbarConnected;
