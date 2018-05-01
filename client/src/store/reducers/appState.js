import update from "immutability-helper";

import {
  LOGOUT,
  SET_LOGGEDIN,
  SET_REDIRECT_URL,
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_MODAL_ERROR_H,
  SET_SPINNER,
  SET_MENU_STATE,
  SET_ADMIN_MENU_STATE,
  SET_WINDOW_SIZE
} from "../actions";
import {
  VERIFY_EMAIL_REQUEST,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILURE,
  VALIDATE_TOKEN_REQUEST,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  LOGIN_SUCCESS,
  REGISTRATION_SUCCESS,
  GET_PROFILE_SUCCESS
} from "../actions/apiActions";

const INITIAL_STATE = {
  loggedIn: false,
  authToken: "",
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    text: "",
    title: "",
    type: ""
  },
  adminMenuState: "closed",
  menuState: "closed",
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight
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
      window.localStorage.clear();
      return INITIAL_STATE;

    /*
    * This action is issued from <App/> component.
    * When the client window is resized, this action will be dispatched.
    * The action payload contains the window width and height
    */
    case SET_WINDOW_SIZE:
      return Object.assign({}, state, { windowSize: action.payload });

    /*
    * This action is issued from <Header/> component.
    * Toggles the mobile menu between open/closed states
    */
    case SET_MENU_STATE:
      return Object.assign({}, state, { menuState: action.payload });

    /*
    * This action is issued from <Header/> component.
    * Toggles the admin menu between open/closed states
    */
    case SET_ADMIN_MENU_STATE:
      return Object.assign({}, state, { adminMenuState: action.payload });

    /*
    * Set spinner class to show to indicate API call in progress
    */
    case VERIFY_EMAIL_REQUEST:
      return Object.assign({}, state, { spinnerClass: "spinner__show" });

    case VALIDATE_TOKEN_REQUEST:
      return state;

    /*
    * Toggle spinner class (for social auth done with href
    * rather than API call)
    */
    case SET_SPINNER:
      return Object.assign({}, state, {
        spinnerClass: `spinner__${action.payload}`
      });

    /*
    * This action is issued only from the <VerifyEmail/> component.
    * On VERIFY_EMAIL_SUCCESS action, hide spinner, set loggedIn and
    * verified to true, save updated user profile to redux store
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
        modal: {
          class: { $set: "modal__show" },
          text: { $set: "Welcome to pollbuilder!" },
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
        authToken: { $set: action.meta.token }
      });

    case GET_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        authToken: { $set: action.payload.token }
      });

    /*
     * This action is issued only from the <VerifyEmail/> component,
     * when the localStorage token is not validated by the server.
     * On VALIDATE_TOKEN_FAILURE action, set the spinner class to hide.
     * Remove the invalid values from localStorage
     * Set loggedIn to false.
     */
    case VERIFY_EMAIL_FAILURE:
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
          title: { $set: "Email Verification Failure" },
          type: { $set: "modal__error" },
          buttonText: { $set: "Try again" }
        },
        loggedIn: { $set: false }
      });

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
        // modal: {
        //   class: { $set: "modal__show" },
        //   text: { $set: error },
        //   title: { $set: "Validation Failure" },
        //   type: { $set: "modal__error" },
        //   buttonText: { $set: "Try again" }
        // },
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
        authToken: { $set: action.payload.token }
      });

    /*
    * This action is issued from the <Profile /> component if it finds a
    * Facebook redirect hash in the URL OR route params indicating successful
    * social auth.
    * Hide the spinner, Set loggedIn to true.
    */
    case SET_LOGGEDIN:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        loggedIn: { $set: true }
      });

    /*
    * This action is issued only from the <ComboBox /> component.
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
        authToken: { $set: action.payload.token }
      });

    /*
    *  Called From: <VerifyEmail />
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
          type: { $set: "modal__error" }
        }
      });

    /*
    *  Called From: <Header />
    *  Payload: Error Message
    *  Purpose: Hide spinner,
    *  Display error message in modal.
    */
    case SET_MODAL_ERROR_H:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: action.payload },
          title: { $set: action.payload.title },
          type: { $set: "modal__error" }
        }
      });

    /*
    *  Called from: <VerifyEmail />
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
