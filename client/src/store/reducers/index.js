import { combineReducers } from 'redux';
import appState from '../reducers/appState';
import register from '../reducers/register';
import login from '../reducers/login';
import profile from '../reducers/profile';

const rootReducer = combineReducers({
  appState, register, login, profile,
});

export default rootReducer;