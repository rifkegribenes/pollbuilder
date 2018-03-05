import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_LOGIN_ERROR,
  CLEAR_LOGIN_ERROR,
  DISMISS_MODAL,
  SET_TOUCHED,
  SET_VALIDATION_ERRORS,
  SHOW_ERRORS,
  SET_SUBMIT,
  LOGOUT
} from "../actions";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  RESET_PW_REQUEST,
  RESET_PW_SUCCESS,
  RESET_PW_FAILURE,
  SEND_RESET_EMAIL_REQUEST,
  SEND_RESET_EMAIL_SUCCESS,
  SEND_RESET_EMAIL_FAILURE
} from "../actions/apiActions";

const INITIAL_STATE = {
  authToken: "",
  errorMsg: "",
  showErrors: false,
  submit: false,
  validationErrors: {},
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    type: "",
    title: "",
    text: ""
  },
  form: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPwd: "",
    error: false
  },
  touched: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPwd: false
  }
};

function login(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    * Called from: <Login />, <Register />
    * Payload: Form field Name and Value
    * Purpose: Update the connected form field.
    */
    case SET_FORM_FIELD:
      return update(state, {
        form: { [action.payload.id]: { $set: action.payload.value } }
      });

    /*
    * Called from: <Login />, <Register />
    * Payload: Form field Name
    * Purpose: Update 'touched' value for form field.
    */
    case SET_TOUCHED:
      console.log(`setTouched: ${action.payload}`);
      return update(state, {
        touched: { [action.payload]: { $set: true } }
      });

    /*
    * Called from: <Login />, <Register />
    * Payload: Validation errors object
    * Purpose: Update validation errors object for form
    */
    case SET_VALIDATION_ERRORS:
      return update(state, {
        validationErrors: { $set: { ...action.payload } }
      });

    /*
    *  Called From: <Login />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_LOGIN_ERROR:
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }
      return Object.assign({}, state, { errorMsg: error });

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
    *  Called From: <Login />
    *  Payload: none
    *  Purpose: Clear login errors
    */
    case CLEAR_LOGIN_ERROR:
      console.log("clear login error");
      return update(state, {
        errorMsg: { $set: null },
        spinnerClass: { $set: "spinner__hide" },
        form: {
          error: { $set: false }
        }
      });

    /*
    *  Called From: <Login />, <Register />
    *  Payload: none
    *  Purpose: Show or hide client side validation errors on form fields
    */
    case SHOW_ERRORS:
      console.log("show errors");
      return update(state, {
        showErrors: { $set: action.payload }
      });

    /*
    *  Called From: <Login />, <Register />
    *  Payload: none
    *  Purpose: Set submit state to display any client-side validation errors
    */
    case SET_SUBMIT:
      console.log("set submit");
      return update(state, {
        submit: { $set: true }
      });

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Activate spinner so user knows API request is in progress
    */
    case LOGIN_REQUEST:
      return Object.assign({}, state, { spinnerClass: "spinner__show" });

    /*
    *  Called From: <Login />
    *  Payload: N/A
    *  Purpose: De-activate the progress spinner.
    *  Note: this action is also handled in the appState reducer.
    */
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loginEmail: "",
        loginPassword: ""
      });

    /*
    *  Called From: <Login />
    *  Payload: Error Message
    *  Purpose: Display API login error to user
    */
    case LOGIN_FAILURE:
      error = action.payload.message || "Unknown login error";
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        errorMsg: error
      });

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
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

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide",
          text: ""
        }
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__success",
          text: "Your password has been reset. Click Sign In to continue"
        }
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESET_PW_FAILURE:
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error
        }
      });

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case SEND_RESET_EMAIL_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide"
        },
        errorMsg: ""
      });

    /*
    *  Called from: <Login />
    *  Payload: String - a success message
    *  Purpose: Display success message to user
    */
    case SEND_RESET_EMAIL_SUCCESS:
      console.log("SEND_RESET_EMAIL_SUCCESS");
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text: `A password reset link has been sent to ${
            action.meta.email
          }. Follow the instructions to reset your password.`,
          title: "Check your Email",
          type: "modal__success"
        }
      });

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case SEND_RESET_EMAIL_FAILURE:
      error =
        action.payload.message ||
        "An unknown error occurred while sending reset email";
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        errorMsg: error
      });

    default:
      return state;
  }
}

export default login;
