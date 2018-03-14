import update from "immutability-helper";

import {
  LOGOUT,
  SET_LOGGEDIN,
  SET_REDIRECT_URL,
  DISMISS_MODAL,
  SET_MODAL_ERROR
} from "../actions";
import {
  VERIFY_EMAIL_REQUEST,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILURE,
  VALIDATE_TOKEN_REQUEST,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  CALLBACK_FACEBOOK_SUCCESS,
  LOGIN_SUCCESS,
  REGISTRATION_SUCCESS
} from "../actions/apiActions";

const INITIAL_STATE = {
  loggedIn: false,
  authToken: "",
  user: {
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
    }
  },
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    text: "",
    title: "",
    type: ""
  }
};

/*
*  This is the appState reducer.  It is meant to hold global settings
*  loggedIn: boolean
*  authToken: {} - passed with API calls to authenticate on back endpoint
*  userId: string - used to check if loaded data belongs to logged in user
*  spinnerClass: string - css class applied while API is loading
*  Client will attempt to load the expected page for the user.
*/
function appState(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    * This action is issued only from the <Logout/> component.
    * On LOGOUT action, remove the userId and token from localStorage.
    * Reset to initial state.
    * The action is handled here and also in each other reducer
    * to hide spinner & modal on all pages
    */
    case LOGOUT:
      window.localStorage.removeItem("authToken");
      window.localStorage.removeItem("userId");
      return update(state, {
        loggedIn: { $set: false },
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        }
      });
    /*
    * This action is issued only from the <Home/> component.
    * On VALIDATE_TOKEN_REQUEST action, set the spinner class to show.
    * This activates the spinner component on the home page so user knows the action is running
    */
    case VERIFY_EMAIL_REQUEST:
    case VALIDATE_TOKEN_REQUEST:
      return Object.assign({}, state, { spinnerClass: "spinner__show" });

    /*
    * This action is issued only from the <Home/> component,
    * when the localStorage token is successfully validated by the server.
    * On VALIDATE_TOKEN_SUCCESS action, set the spinner class to hide.
    * This hides the spinner component on the home page so user knows
    * the action is complete.
    * Save the userId and token in the redux store...set loggedIn to TRUE.
    */
    case VERIFY_EMAIL_SUCCESS:
      window.localStorage.setItem(
        "authToken",
        JSON.stringify(action.payload.token)
      );
      window.localStorage.setItem(
        "userId",
        JSON.stringify(action.payload.user._id)
      );
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true },

        user: {
          _id: { $set: action.payload.user._id },
          profile: {
            avatarUrl: { $set: action.payload.user.avatarUrl || "" },
            firstName: { $set: action.payload.user.firstName || "" },
            lastName: { $set: action.payload.user.lastName || "" },
            email: { $set: action.payload.user.email },
            validated: { $set: true }
          }
        },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: "Welcome to the voting app!" },
          title: { $set: "Thanks for verifying your email" },
          type: { $set: "modal__success" },
          buttonText: { $set: "Continue" },
          redirect: { $set: "/" }
        },
        authToken: { $set: action.payload.token }
      });

    case VALIDATE_TOKEN_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true },

        user: {
          _id: { $set: action.payload.user._id },
          profile: {
            avatarUrl: { $set: action.payload.user.avatarUrl || "" },
            firstName: { $set: action.payload.user.firstName || "" },
            lastName: { $set: action.payload.user.lastName || "" },
            email: { $set: action.payload.user.email },
            validated: { $set: true }
          }
        },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: "Welcome to the voting app!" },
          title: { $set: "Thanks for verifying your email" },
          type: { $set: "modal__success" },
          buttonText: { $set: "Continue" },
          redirect: { $set: "/" }
        },
        authToken: { $set: action.payload.token }
      });

    /*
     * This action is issued only from the <Home/> component,
     * when the localStorage token is not validated by the server.
     * On VALIDATE_TOKEN_FAILURE action, set the spinner class to hide.
     * Remove the invalid values from localStorage
     * Set loggedIn to false.
     */
    case VERIFY_EMAIL_FAILURE:
    case VALIDATE_TOKEN_FAILURE:
      window.localStorage.removeItem("authToken");
      window.localStorage.removeItem("userId");
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
          title: { $set: "Validation Failure" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        },
        loggedIn: { $set: false }
      });

    /*
    * This action is issued <Login/> and <Home/> components.
    * If the user requests a deep link from the server, they are redirected to the root link,
    * and their requested link is passed to the app, via a hash fragment in the URL
    * The client then tries to set the client route to the hash fragment.
    * This function may be called to clear the redirectUrl after client routing occurs.
    */
    case SET_REDIRECT_URL:
      return Object.assign({}, state, { redirectUrl: action.payload });

    /*
    * This action is issued only from the <Login/> component.
    * On LOGIN_SUCCESS action, hide the spinner so user knows the
    * action is complete.
    * Save userId and token to localStorage and redux store.
    * Set loggedIn to true.
    */
    case LOGIN_SUCCESS:
      window.localStorage.setItem(
        "authToken",
        JSON.stringify(action.payload.token)
      );
      window.localStorage.setItem(
        "userId",
        JSON.stringify(action.payload.user._id)
      );
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true },
        user: {
          _id: { $set: action.payload.user._id },
          profile: {
            avatarUrl: { $set: action.payload.user.avatarUrl || "" },
            firstName: { $set: action.payload.user.firstName || "" },
            lastName: { $set: action.payload.user.lastName || "" },
            email: { $set: action.payload.user.email }
          }
        },
        authToken: { $set: action.payload.token }
      });

    /*
    * This action is issued from the <App/> component if it finds a
    * Facebook redirect hash in the URL, indicating that Facebook auth
    * was successful.
    * Hide the spinner, Set loggedIn to true.
    */
    case SET_LOGGEDIN:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true }
      });

    /*
    * This action is issued from the <FBCallback/> component,
    * when the FB token is successfully validated by the server.
    * On CALLBACK_FACEBOOK_SUCCESS action, set the spinner class to hide.
    * This hides the spinner component on the home page so user knows
    * the action is complete.
    * Save the userId and fb token in the redux store...set loggedIn to TRUE.
    */
    case CALLBACK_FACEBOOK_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true },
        user: {
          _id: { $set: action.payload.user._id },
          profile: {
            avatarUrl: { $set: action.payload.user.avatarUrl || "" },
            firstName: { $set: action.payload.user.firstName || "" },
            lastName: { $set: action.payload.user.lastName || "" },
            email: { $set: action.payload.user.email }
          }
        },
        authToken: { $set: action.payload.token }
      });

    /*
    * This action is issued only from the <Registration/> component.
    * On REGSTRATION_SUCCESS action, save the userId and token to localStorage.
    * Populate the store with userId and token, set logged in to true.
    * (also handled in register.js reducer)
    */
    case REGISTRATION_SUCCESS:
      window.localStorage.setItem(
        "authToken",
        JSON.stringify(action.payload.token)
      );
      window.localStorage.setItem(
        "userId",
        JSON.stringify(action.payload.user._id)
      );
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true },
        user: {
          _id: { $set: action.payload.user._id },
          profile: {
            avatarUrl: { $set: action.payload.user.avatarUrl || "" },
            firstName: { $set: action.payload.user.firstName || "" },
            lastName: { $set: action.payload.user.lastName || "" },
            email: { $set: action.payload.user.email }
          }
        },
        authToken: { $set: action.payload.token }
      });

    /*
    *  Called From: <Validate />
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
          title: { $set: "Something went wrong" },
          type: { $set: "modal__error" }
        }
      });

    /*
    *  Called from: <Validate />
    *  Payload: None
    *  Purpose: dismiss modal
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

export default appState;
