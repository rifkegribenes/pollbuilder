import { SET_REG_ERROR, DISMISS_REG_MODAL } from "../actions";
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
  regErrorMsg: ""
};
function register(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    *  Called From: <Registration />
    *  Payload: Error message
    *  Purpose: Display error message from registration form validation
    */
    case SET_REG_ERROR:
      return Object.assign({}, state, { regErrorMsg: action.payload });

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
          text: "Your registration was successful.",
          title: "Success"
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: Error Message
    *  Purpose: Hide spinner and display error message to user in the form.
    */
    case REGISTRATION_FAILURE:
      console.log("registration failure:");
      console.dir(action.payload);
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.response.error === "string") {
        error = action.payload.response.error;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else if (typeof error === "undefined") {
        error = "An unknown error occurred during registration";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__hide"
        },
        regErrorMsg: error
      });

    /*
    *  Called From: <Registration />
    *  Payload: None
    *  Purpose: Hide modal after successful registration.
    */
    case DISMISS_REG_MODAL:
      return Object.assign({}, state, {
        modal: {
          class: "modal__hide",
          text: ""
        }
      });

    default:
      return state;
  }
}

export default register;
