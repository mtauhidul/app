const params = new URLSearchParams(window.location.search);

export default {
  clientWidth: null,
  clientHeight: null,
  footerHeight: null,
  initialized: false,
  retina: false,
  snackbarMessage: '',
  snackbarMessageTimeout: 6000,

  allPatientsTab: 'at-risk',

  loggedOut: !!params.get('logout'),
  loggedOutAuto: false,
  logoutMinutes: +__AUTO_LOGOUT_MINS__ || 50,

  navigationHeightGeneral: 0,
  navigationHeight: 0,
  modalHeadingHeight: 0,
  patientHeadingContainerHeight: 0,
  modalWidth: 0,

  openedModal: null,

  patientInfoTab: 'info',

  scrolledIntoView: '',

  errorMessage: '',
  errorDetails: null,
};
