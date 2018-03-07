import update from "immutability-helper";

import { DISMISS_MODAL, LOGOUT } from "../actions";
import {
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILURE
} from "../actions/apiActions";

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    text: ""
  },
  errorMsg: ""
};
function register(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    *  Called From: <Registration />
    *  Payload: None
    *  Purpose: Display spinner so user knows API action is in progress.
    */
    case REGISTRATION_REQUEST:
      console.log("registration request");
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide",
          text: ""
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: N/A
    *  Purpose: Hide spinner so user knows API action is complete.
    *  Note: this action is also handled in appState reducer.
    */
    case REGISTRATION_SUCCESS:
      console.log("registration success register.js > 49");
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text:
            "Your registration was successful. Please check your email for a validation link. You must validate your account to continue using this app.",
          title: "Success"
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: Error Message
    *  Purpose: Hide spinner and modal,
    *  display error message in the form.
    */
    case REGISTRATION_FAILURE:
      console.log("registration failure:");
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else if (typeof error === "undefined") {
        error = "An unknown error occurred during registration";
      }
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        errorMsg: { $set: error }
      });

    case LOGOUT:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" },
          type: { $set: "" },
          title: { $set: "" },
          text: { $set: "" }
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: None
    *  Purpose: Hide modal after successful registration.
    */
    case DISMISS_MODAL:
      return Object.assign({}, state, {
        modal: {
          text: "",
          class: "modal__hide",
          type: "",
          title: ""
        }
      });

    default:
      return state;
  }
}

export default register;
