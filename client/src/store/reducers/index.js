import { combineReducers } from "redux";
import appState from "../reducers/appState";
import login from "../reducers/login";
import profile from "../reducers/profile";
import poll from "../reducers/poll";

const rootReducer = combineReducers({
  appState,
  login,
  profile,
  poll
});

export default rootReducer;
