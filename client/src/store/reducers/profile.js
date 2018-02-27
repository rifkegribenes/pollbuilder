import update from "immutability-helper";
import { DISMISS_VIEWPROFILE_MODAL } from "../actions/";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  VALIDATE_TOKEN_SUCCESS,
  LOGIN_SUCCESS,
  REGISTRATION_SUCCESS
} from "../actions/apiActions";

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    type: "modal__info",
    text: ""
  },
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
  }
};

function profile(state = INITIAL_STATE, action) {
  let error;
  let user = {};
  switch (action.type) {
    /*
    * Called from: <Home />
    * Payload: User Profile
    * Purpose: Set current user data when token is successfully loaded from localStorage
    */
    case VALIDATE_TOKEN_SUCCESS:
      console.log("validate token");
      console.log(action.payload);
      return update(state, {
        user: { $merge: action.payload }
      });

    /*
    * Called from: <Login />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully logs in
    */
    case LOGIN_SUCCESS:
      user = { ...action.payload.user };
      return update(state, {
        $merge: { user }
      });

    /*
    * Called from: <Registration />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully registers
    */
    case REGISTRATION_SUCCESS:
      console.log("profile.js");
      console.log("REGISTRATION_SUCCESS");
      console.log(action.payload);
      user = { ...action.payload.user };
      console.log(user);
      console.log(user.email);
      return update(state, {
        $merge: { user }
      });

    /*
    * Called from: <Profile />
    * Payload: None
    * Purpose: Show a spinner to indicate API call in progress.
    */
    case GET_PROFILE_REQUEST:
      return Object.assign({}, state, {
        userProfile: {},
        getSuccess: null,
        spinnerClass: "spinner__show"
      });

    /*
    * Called from: <Profile />
    * Payload: User object
    * Purpose: Populate the ViewProfile object
    */
    case GET_PROFILE_SUCCESS:
      if (action.payload.user.local) {
        user.local = { ...action.payload.user.local };
      }
      if (action.payload.user.facebook) {
        user.facebook = { ...action.payload.user.facebook };
      }
      if (action.payload.user.github) {
        user.github = { ...action.payload.user.github };
      }
      if (action.payload.user.google) {
        user.google = { ...action.payload.user.google };
      }
      user.id = action.payload.user._id;
      user.profile = { ...action.payload.user.profile };
      return update(state, {
        $merge: {
          getSuccess: true,
          user,
          spinnerClass: { $set: "spinner__hide" }
        }
      });

    /*
    * Called from: <ViewProfile />
    * Payload: String - error msg
    * Purpose: Populate the ViewProfile modal with an error message
    */
    case GET_PROFILE_FAILURE:
      console.log("GET_PROFILE_FAILURE");
      console.log(action.payload);
      error = "An error occurred while getting the profile";
      return Object.assign({}, state, {
        getSuccess: false,
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text: error
        }
      });

    /*
    * Called from: <ViewProfile />
    * Payload: N/A
    * Purpose: Change settings to hide the modal object
    */
    case DISMISS_VIEWPROFILE_MODAL:
      return Object.assign({}, state, {
        modal: {
          text: "",
          class: "modal__hide"
        }
      });

    default:
      return state;
  }
}

export default profile;
