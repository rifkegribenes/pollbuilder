import { combineReducers } from "redux";
import appState from "../reducers/appState";
import login from "../reducers/login";
import profile from "../reducers/profile";

const rootReducer = combineReducers({
  appState,
  login,
  profile
});

export default rootReducer;
