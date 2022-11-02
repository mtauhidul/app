import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../components/App';
import Home from '../components/Pages/Home';
import PatientView from '../components/Pages/PatientView';

export default (uuid, smartState = null) => (
  <Router>
    <App uuid={uuid} smartState={smartState}>
      <Switch>
        <Route exact path=':state?/' component={Home} />
        <Route exact path=':state?/patient-view' component={PatientView} />

        <Route exact path='/:state?/' component={Home} />
        <Route exact path='/:state?/patient-view' component={PatientView} />
      </Switch>
    </App>
  </Router>
);
