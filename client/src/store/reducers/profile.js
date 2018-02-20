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
  let local = { email: "" };
  let profile = {};
  let facebook = { email: "", token: "", id: "" };
  let github = { email: "", token: "", id: "" };
  let google = { email: "", token: "", id: "" };
  switch (action.type) {
    /*
    * Called from: <Home />
    * Payload: User Profile
    * Purpose: Set current user data when token is successfully loaded from localStorage
    */
    case VALIDATE_TOKEN_SUCCESS:
      return update(state, { userProfile: { $set: action.payload } });

    /*
    * Called from: <Login />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully logs in
    */
    case LOGIN_SUCCESS:
      return update(state, { userProfile: { $set: action.payload.profile } });

    /*
    * Called from: <Registration />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully registers
    */
    case REGISTRATION_SUCCESS:
      return update(state, { userProfile: { $set: action.payload.profile } });

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
      console.log(action.payload);
      if (action.payload.user.local) {
        console.log("local key exists on payload.user");
        local = { ...action.payload.user.local };
      } else {
        console.log("local key does not exist on payload.user");
      }
      if (action.payload.user.profile) {
        profile = { ...action.payload.user.profile };
        console.log("profile from payload.user");
        console.log(profile);
      }
      if (action.payload.user.facebook) {
        facebook = { ...action.payload.user.facebook };
      }
      if (action.payload.user.github) {
        console.log("github key exists on payload.user");
        github = { ...action.payload.user.github };
        console.log(github);
      } else {
        console.log("github key does not exist on payload.user");
      }
      if (action.payload.user.google) {
        google = { ...action.payload.user.google };
      }
      return update(state, {
        $merge: {
          getSuccess: true,
          user: {
            _id: action.payload.user._id,
            profile: {
              avatarUrl: profile.avatarUrl,
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email
            },
            local: {
              email: local.email
            },
            facebook: {
              token: facebook.token,
              id: facebook.id,
              email: facebook.email
            },
            github: {
              token: github.token,
              id: github.id,
              email: github.email
            },
            google: {
              token: google.token,
              id: google.id,
              email: google.email
            }
          },
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
