import update from "immutability-helper";
import { DISMISS_MODAL, LOGOUT, SET_MODAL_INFO } from "../actions/";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST,
  MODIFY_PROFILE_SUCCESS,
  MODIFY_PROFILE_FAILURE,
  VALIDATE_TOKEN_SUCCESS,
  VERIFY_EMAIL_SUCCESS,
  LOGIN_SUCCESS,
  REGISTRATION_SUCCESS,
  RESEND_VLINK_REQUEST,
  RESEND_VLINK_SUCCESS,
  RESEND_VLINK_FAILURE
} from "../actions/apiActions";

const EMPTY_USER = {
  _id: "",
  local: {
    email: ""
  },
  profile: {
    avatarUrl: "",
    firstName: "",
    lastName: "",
    email: ""
  },
  facebook: {
    token: "",
    id: "",
    email: ""
  },
  github: {
    token: "",
    id: "",
    email: ""
  },
  google: {
    token: "",
    id: "",
    email: ""
  },
  verified: false
};

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    type: "modal__info",
    text: ""
  },
  user: { ...EMPTY_USER }
};

function profile(state = INITIAL_STATE, action) {
  let error;
  let user = {};
  switch (action.type) {
    /*
    * Called from: <ComboBox />, <VerifyEmail />, <Profile />,
    * <ViewPoll />, <AllPolls />
    * Payload: User Profile
    * Purpose: Update user data in redux store with user object
    * returned from server when user successfully logs in,
    * registers, or verifies email
    */
    case VERIFY_EMAIL_SUCCESS:
    case LOGIN_SUCCESS:
    case REGISTRATION_SUCCESS:
    case GET_PROFILE_SUCCESS:
    case MODIFY_PROFILE_SUCCESS:
    case VALIDATE_TOKEN_SUCCESS:
      user = { ...action.payload.user };
      return update(state, {
        $merge: {
          user,
          spinnerClass: "spinner__hide"
        }
      });

    case LOGOUT:
      return INITIAL_STATE;

    /*
    * Called from: <Profile />
    * Payload: None
    * Purpose: Clear user object from store,
    * show a spinner to indicate API call in progress.
    */
    case GET_PROFILE_REQUEST:
      return update(state, {
        $merge: {
          user: { ...EMPTY_USER },
          spinnerClass: "spinner__show"
        }
      });

    /*
    * Called from: <Profile />
    * Payload: None
    * Purpose: Show a spinner to indicate API call in progress.
    */
    case RESEND_VLINK_REQUEST:
    case MODIFY_PROFILE_REQUEST:
      return update(state, {
        $merge: {
          spinnerClass: "spinner__show"
        }
      });

    /*
    * Called from: <Profile />
    * Payload: String - error msg
    * Purpose: Populate the Profile modal with an error message
    */
    case GET_PROFILE_FAILURE:
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
          title: { $set: "Error fetching profile" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        }
      });

    /*
    * Called from: <Profile />
    * Payload: String - error msg
    * Purpose: Populate the Profile modal with an error message
    */
    case MODIFY_PROFILE_FAILURE:
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
          title: { $set: "Error updating profile" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        }
      });

    /*
    * Called from: <Profile />
    * Payload: String - error msg
    * Purpose: Populate the Profile modal with an error message
    */
    case RESEND_VLINK_FAILURE:
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
          title: { $set: "Error sending message" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        }
      });

    /*
    * Called from: <Profile />
    * Payload: N/A
    * Purpose: Change settings to hide the modal object
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
    * Called from: <Profile />
    * Payload: Object with modal options
    * Purpose: Populate the Profile modal with instructions and action
    */
    case SET_MODAL_INFO:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: action.payload.text },
          title: { $set: action.payload.title },
          type: { $set: "modal__info" },
          buttonText: { $set: action.payload.buttonText },
          action: { $set: action.payload.action },
          inputName: { $set: action.payload.inputName },
          inputPlaceholder: { $set: action.payload.inputPlaceholder },
          inputLabel: { $set: action.payload.inputLabel },
          inputType: { $set: action.payload.inputType }
        }
      });

    /*
    *  Called From: <Profile />
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
          title: "Email sent",
          type: "modal__success",
          redirect: "/"
        }
      });

    default:
      return state;
  }
}

export default profile;
