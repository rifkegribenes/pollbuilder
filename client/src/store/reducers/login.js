import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_LOGIN_ERROR,
  CLEAR_LOGIN_ERROR,
  DISMISS_LOGIN_MODAL,
  DISMISS_PWRESET_MODAL
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
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    type: "",
    title: "",
    text: ""
  },
  form: {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPwd: "",
    error: false
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
    *  Called From: <Login />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: none
    *  Purpose: Clear login errors
    */
    case CLEAR_LOGIN_ERROR:
      return update(state, {
        errorMsg: { $set: null },
        form: {
          error: { $set: false }
        }
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
    case DISMISS_LOGIN_MODAL:
      return Object.assign({}, state, {
        modal: {
          text: "",
          class: "modal__hide"
        }
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_REQUEST:
      return Object.assign({}, state, {
        pwResetSpinnerClass: "spinner__show",
        pwResetModalClass: "modal__hide",
        pwResetModalText: ""
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_SUCCESS:
      return Object.assign({}, state, {
        pwResetSpinnerClass: "spinner__hide",
        pwResetModalClass: "modal__show",
        pwResetModalType: "modal__success",
        pwResetModalText:
          "Your password has been reset. Click Sign In to continue"
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESET_PW_FAILURE:
      error = "An unknown error occurred while resetting password";
      return Object.assign({}, state, {
        pwResetSpinnerClass: "spinner__hide",
        pwResetModalClass: "modal__show",
        pwResetModalType: "modal__error",
        pwResetModalText: error
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
          }. Follow the instructions to complete the password reset`
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
        loginSpinnerClass: "spinner__hide",
        errorMsg: error
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
    */
    case DISMISS_PWRESET_MODAL:
      return Object.assign({}, state, {
        pwResetModalText: "",
        pwResetModalClass: "modal__hide",
        pwResetModalType: ""
      });

    default:
      return state;
  }
}

export default login;
