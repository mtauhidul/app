import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as UUID from 'uuid';
import { getAppState } from '../lib';
import checklist from './reducers/checklist';
import dialog from './reducers/dialog';
import fhir from './reducers/fhir';
import tutorial from './reducers/tutorial';
import ui from './reducers/ui';

const appState = getAppState() || UUID.v4();
const configStore = function (cfg = {}) {
  const reducers = combineReducers({
    checklist,
    dialog,
    fhir,
    ui,
    tutorial,
  });
  const composeEnhancers =
    __NODE_ENV__ === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : (i) => i;
  const middlewares = [thunk];
  cfg.logger && middlewares.push(createLogger());
  const localStore = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  return localStore;
};
export default configStore;
const store = configStore(appState);
export { store, appState };
