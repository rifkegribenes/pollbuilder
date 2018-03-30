import { combineReducers } from "redux";
import appState from "../reducers/appState";
import auth from "../reducers/auth";
import profile from "../reducers/profile";
import poll from "../reducers/poll";

const rootReducer = combineReducers({
  appState,
  auth,
  profile,
  poll
});

export default rootReducer;
