import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  RESET_FORM,
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_SPINNER
} from "../actions";
import {
  CREATE_POLL_REQUEST,
  CREATE_POLL_SUCCESS,
  CREATE_POLL_FAILURE
  // UPDATE_POLL_REQUEST,
  // UPDATE_POLL_SUCCESS,
  // UPDATE_POLL_FAILURE,
  // DELETE_POLL_REQUEST,
  // DELETE_POLL_SUCCESS,
  // DELETE_POLL_FAILURE,
  // VIEW_POLL_REQUEST,
  // VIEW_POLL_SUCCESS,
  // VIEW_POLL_FAILURE
} from "../actions/apiPollActions";
import {
  RESEND_VLINK_REQUEST,
  RESEND_VLINK_SUCCESS,
  RESEND_VLINK_FAILURE
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
    title: "",
    question: "",
    options: {},
    error: false
  }
};

function poll(state = INITIAL_STATE, action) {
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
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }
      return Object.assign({}, state, { errorMsg: error });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />
    *  Payload: none
    *  Purpose: Reset Form
    */
    case RESET_FORM:
      return update(state, {
        errorMsg: { $set: "" },
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" },
          type: { $set: "" },
          title: { $set: "" },
          text: { $set: "" }
        },
        form: {
          firstName: { $set: "" },
          lastName: { $set: "" },
          email: { $set: "" },
          password: { $set: "" },
          confirmPwd: { $set: "" },
          error: { $set: false }
        }
      });

    /*
    *  Called From: <CreatePoll />
    *  Payload: None
    *  Purpose: Activate spinner to indicates API request is in progress
    */
    case RESEND_VLINK_REQUEST:
    case CREATE_POLL_REQUEST:
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
    *  Called From: <CreatePoll />
    *  Payload: Error Message
    *  Purpose: Hide spinner,
    *  Display error message in modal. Generic, called from various components
    */
    case SET_MODAL_ERROR:
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
          title: { $set: action.payload.title },
          type: { $set: "modal__error" },
          buttonText: { $set: action.payload.buttonText },
          action: { $set: action.payload.action }
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
    *  Called from: <CreatePoll />
    *  Payload: poll id and title
    *  Purpose: Display a success message with link to view poll
    */
    case CREATE_POLL_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__success",
          title: "New Poll Created",
          text: `Your poll ${action.payload.title} was created successfully`,
          buttonText: "View Poll",
          redirect: `/poll/${action.payload.id}`
        }
      });

    /*
    *  Called from: <CreatePoll />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case CREATE_POLL_FAILURE:
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
          title: "Failure: Poll not saved",
          buttonText: "Try again"
        }
      });

    /*
    *  Called From: <CreatePoll />
    *  Payload: N/A
    *  Purpose: Hide spinner, show success modal about email verification.
    */
    case RESEND_VLINK_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text:
            "Please check your email for a message, and click the link to verify your email address.",
          title: "Verification Link Sent",
          type: "modal__success",
          redirect: "/"
        }
      });

    /*
    *  Called from: <CreatePoll />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESEND_VLINK_FAILURE:
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
          title: "Failure: Message not sent",
          buttonText: "Try again"
        }
      });

    default:
      return state;
  }
}

export default poll;
