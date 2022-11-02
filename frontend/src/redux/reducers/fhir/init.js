export default {
  context: [],
  patientData: {},
  parsed: {
    needPatientBanner: true,
    user: {
      status: 'pending',
      data: {},
    },
    patientList: {
      status: 'pending',
      search: {
        keywords: [],
        page: 1,
        offset: 0,
        pageSize: 10,
        sort: 'risk-desc',
        filter: {},
        startDate: null,
        endDate: null,
      },
      data: [],
    },
    patientDemographics: {
      status: 'pending',
      data: {
        birthDate: '',
        gender: '',
        MRN: '',
        name: '',
        smartId: '',
        address: [],
        email: [],
        names: [],
        phone: [],
      },
    },
  },
  smart: {
    status: '',
    data: {},
  },
  meta: {
    status: '',
    parsed: {},
    raw: {},
  },
  flaggedConditions: {
    ready: 'pending',
    data: {},
  },
};
