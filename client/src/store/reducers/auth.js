import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  SET_VALIDATION_ERRORS,
  RESET_FORM,
  DISMISS_MODAL,
  LOGOUT,
  SET_SPINNER,
  SHOW_FORM_ERROR,
  SET_SUBMIT,
  SET_TOUCHED,
  SET_SHOW_ERROR
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
  SEND_RESET_EMAIL_FAILURE,
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILURE
} from "../actions/apiActions";

const INITIAL_STATE = {
  errorMsg: "",
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
    error: false,
    avatarUrl: "",
    touched: {},
    showFieldErrors: {},
    validationErrors: {}
  },
  showFormError: false,
  submit: false
};

function auth(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    * Called from: <Login />, <Register />, <ResetPassword />
    * Payload: Form field Name and Value
    * Purpose: Update the connected form field.
    */
    case SET_FORM_FIELD:
      return update(state, {
        form: { [action.payload.id]: { $set: action.payload.value } }
      });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_FORM_ERROR:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }
      return Object.assign({}, state, { errorMsg: error });

    case SHOW_FORM_ERROR:
      return Object.assign({}, state, { showFormError: action.payload });

    /*
    *  Called From: <Form />
    *  Payload: Field Name
    *  Purpose: Set bool for error visibility for field
    *  (this action also handled in poll reducer for <PollOptions />)
    */
    case SET_SHOW_ERROR:
      return update(state, {
        form: {
          showFieldErrors: {
            [action.payload.name]: { $set: action.payload.bool }
          }
        }
      });

    /*
    *  Called From: <Form />
    *  Payload: Validation errors object
    *  Purpose: Set validation errors object
    *  (this action also handled in poll reducer for <PollOptions />)
    */
    case SET_VALIDATION_ERRORS:
      return update(state, {
        form: {
          validationErrors: { $set: { ...action.payload } }
        }
      });

    case SET_SUBMIT:
      return Object.assign({}, state, { submit: true });

    /*
    *  Called From: <Form />
    *  Payload: Field Name
    *  Purpose: Set field "touched" for validation error display logic
    *  (this action also handled in poll reducer for <PollOptions />)
    */
    case SET_TOUCHED:
      return update(state, {
        form: {
          touched: {
            [action.payload]: { $set: true }
          }
        }
      });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />
    *  Payload: none
    *  Purpose: Reset Form
    */
    case LOGOUT:
    case RESET_FORM:
      return INITIAL_STATE;

    /*
    *  Called From: <ComboBox />
    *  Payload: None
    *  Purpose: Activate spinner to indicates API request is in progress
    */
    case LOGIN_REQUEST:
    case RESET_PW_REQUEST:
    case SEND_RESET_EMAIL_REQUEST:
    case REGISTRATION_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide",
          text: ""
        },
        errorMsg: ""
      });

    /*
    * Toggle spinner class (for social auth done with href
    * rather than API call)
    */
    case SET_SPINNER:
      return Object.assign({}, state, {
        spinnerClass: `spinner__${action.payload}`
      });

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
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: error },
          title: { $set: "Login Failure" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        }
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
    case RESET_PW_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__success",
          text: "Your password has been reset.\nClick Sign In to continue",
          buttonText: "Sign in",
          redirect: "/login"
        }
      });

    /*
    *  Called from: <ResetPassword />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESET_PW_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          title: "Failure: Password not reset",
          buttonText: "Try again",
          redirect: "/reset"
        }
      });

    /*
    *  Called from: <Login />
    *  Payload: String - a success message
    *  Purpose: Display success message to user
    */
    case SEND_RESET_EMAIL_SUCCESS:
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
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          title: "Failure: Password reset email not sent",
          buttonText: "Try again"
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: N/A
    *  Purpose: Hide spinner, show success modal about email verification.
    *  Note: this action is also handled in appState reducer.
    */
    case REGISTRATION_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text:
            "Your registration was successful. Please check your email for a message, and click the link to verify your email address.",
          title: "Registration Success",
          type: "modal__success",
          redirect: "/"
        }
      });

    /*
    *  Called From: <Registration />
    *  Payload: Error Message
    *  Purpose: Hide spinner and modal,
    *  display error message in the form.
    */
    case REGISTRATION_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: error },
          title: { $set: "Registration Failure" },
          type: { $set: "modal__error" },
          redirect: { $set: "/login" },
          buttonText: { $set: "Try again" }
        }
      });

    default:
      return state;
  }
}

export default auth;
