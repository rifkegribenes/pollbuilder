import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  SHOW_FORM_ERROR,
  SET_OPTION,
  DELETE_OPTION,
  RESET_FORM,
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_SPINNER,
  SET_TOUCHED,
  SET_VALIDATION_ERRORS,
  SET_SHOW_ERROR
} from "../actions";
import {
  CREATE_POLL_REQUEST,
  CREATE_POLL_SUCCESS,
  CREATE_POLL_FAILURE,
  UPDATE_POLL_REQUEST,
  UPDATE_POLL_SUCCESS,
  UPDATE_POLL_FAILURE,
  DELETE_POLL_REQUEST,
  DELETE_POLL_SUCCESS,
  DELETE_POLL_FAILURE,
  VIEW_POLL_REQUEST,
  VIEW_POLL_SUCCESS,
  VIEW_POLL_FAILURE,
  GET_ALL_POLLS_REQUEST,
  GET_ALL_POLLS_SUCCESS,
  GET_ALL_POLLS_FAILURE,
  GET_USER_POLLS_REQUEST,
  GET_USER_POLLS_SUCCESS,
  GET_USER_POLLS_FAILURE,
  VOTE_REQUEST,
  VOTE_SUCCESS,
  VOTE_FAILURE
} from "../actions/apiPollActions";
import {
  RESEND_VLINK_REQUEST,
  RESEND_VLINK_SUCCESS,
  RESEND_VLINK_FAILURE,
  GET_PARTIAL_PROFILE_REQUEST,
  GET_PARTIAL_PROFILE_SUCCESS,
  GET_PARTIAL_PROFILE_FAILURE
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
    question: "",
    options: [
      {
        text: ""
      },
      {
        text: ""
      }
    ],
    voters: [],
    error: false,
    touched: {},
    showFieldErrors: {},
    validationErrors: {},
    ownerId: "",
    ownerName: "",
    ownerAvatar: ""
  },
  polls: [],
  showFormError: false,
  voted: false
};

function poll(state = INITIAL_STATE, action) {
  let error;
  let title;
  let message;
  switch (action.type) {
    /*
    * Called from: <Form />, <ModalSm />, <CreatePoll />
    * Payload: Form field Name and Value
    * Purpose: Update the connected form field.
    */
    case SET_FORM_FIELD:
      return update(state, {
        form: { [action.payload.id]: { $set: action.payload.value } }
      });

    /*
    * Called from: <CreatePoll />
    * Payload: Form field Name and Value
    * Purpose: Update the connected form field.
    */
    case SET_OPTION:
      // console.log(action.payload);
      return update(state, {
        form: { options: { $set: action.payload } }
      });

    case DELETE_OPTION:
      const { options, errors, idx } = action.payload;
      const newOptions = options.filter((item, index) => index !== idx);
      const newErrors = { ...errors };
      delete newErrors[idx];
      return update(state, {
        form: {
          options: { $set: newOptions },
          validationErrors: { $set: newErrors }
        }
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
      } else if (action.payload.message === null) {
        error = null;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }
      return Object.assign({}, state, { errorMsg: error });

    case SHOW_FORM_ERROR:
      return Object.assign({}, state, { showFormError: action.payload });

    /*
    *  Called From: <PollOptions />, <Form />
    *  Payload: Field Name
    *  Purpose: Set field "touched" for validation error display logic
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
    *  Called From: <PollOptions />
    *  Payload: Field Name
    *  Purpose: Set field "touched" for validation error display logic
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
    *  Called From: <PollOptions />
    *  Payload: Validation errors object
    *  Purpose: Set validation errors object
    */
    case SET_VALIDATION_ERRORS:
      return update(state, {
        form: {
          validationErrors: { $set: { ...action.payload } }
        }
      });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />, <CreatePoll />
    *  Payload: none
    *  Purpose: Reset Form
    */
    case RESET_FORM:
      return INITIAL_STATE;

    /*
    *  Called From: <CreatePoll />, <ViewPoll />, <AllPolls />, <UserPolls />
    *  Payload: None
    *  Purpose: Activate spinner to indicates API request is in progress
    */
    case GET_PARTIAL_PROFILE_REQUEST:
    case DELETE_POLL_REQUEST:
    case UPDATE_POLL_REQUEST:
    case GET_USER_POLLS_REQUEST:
    case GET_ALL_POLLS_REQUEST:
    case RESEND_VLINK_REQUEST:
    case CREATE_POLL_REQUEST:
    case VIEW_POLL_REQUEST:
    case VOTE_REQUEST:
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
          action: { $set: action.payload.action },
          modalDanger: { $set: action.payload.modalDanger }
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
    case UPDATE_POLL_SUCCESS:
    case CREATE_POLL_SUCCESS:
      if (action.type === "UPDATE_POLL_SUCCESS") {
        message = "updated";
      } else if (action.type === "CREATE_POLL_SUCCESS") {
        message = "created";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__success",
          title: `Poll ${message}`,
          text: `Your poll was ${message} successfully`,
          buttonText: "View Poll",
          redirect: `/poll/${action.payload.poll._id}`
        }
      });

    /*
    *  Called from: <PollCard />
    *  Payload: success message
    *  Purpose: Display status update on delete action
    */
    case DELETE_POLL_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__success",
          title: `Poll Deleted`,
          text: `Your poll was deleted successfully`,
          buttonText: "Continue",
          redirect: `/polls`
        }
      });

    /*
    *  Called from: <ViewPoll />
    *  Payload: poll object
    *  Purpose: Display poll
    */
    case VIEW_POLL_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        form: { $merge: action.payload.poll }
      });

    /*
    *  Called from: <UserPolls />
    *  Payload: partial user object (name and avatar only)
    *  Purpose: Display name and avatar of poll owner
    */
    case GET_PARTIAL_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        form: {
          ownerName: { $set: action.payload.firstName },
          ownerAvatar: { $set: action.payload.avatarUrl },
          ownerId: { $set: action.payload.ownerId }
        }
      });

    /*
    *  Called from: <PollCard />
    *  Payload: poll object
    *  Purpose: Display poll, set 'voted' to true
    */
    case VOTE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        form: { $merge: action.payload.poll },
        voted: { $set: true }
      });

    /*
    *  Called from: <AllPolls />, <UserPolls />
    *  Payload: array of poll objects
    *  Purpose: Display polls
    */
    case GET_ALL_POLLS_SUCCESS:
    case GET_USER_POLLS_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__hide"
        },
        polls: [...action.payload.polls]
      });

    /*
    *  Called from: <CreatePoll />, <ViewPoll />, <AllPolls />, <UserPolls />
    *  Payload: Error message
    *  Purpose: Display error message
    */
    case GET_PARTIAL_PROFILE_FAILURE:
    case DELETE_POLL_FAILURE:
    case UPDATE_POLL_FAILURE:
    case GET_USER_POLLS_FAILURE:
    case GET_ALL_POLLS_FAILURE:
    case VIEW_POLL_FAILURE:
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
          title,
          buttonText: "Try again"
        }
      });

    case VOTE_FAILURE:
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
          title,
          buttonText: "Try again"
        },
        voted: true
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
