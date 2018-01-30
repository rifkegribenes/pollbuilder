import {
  SET_LOGIN_EMAIL,
  SET_LOGIN_PWD,
  CLEAR_LOGIN_PWD,
  SET_LOGIN_ERROR,
  DISMISS_LOGIN_MODAL
} from "../actions";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_GITHUB_REQUEST,
  LOGIN_GITHUB_SUCCESS,
  LOGIN_GITHUB_FAILURE
} from "../actions/apiActions";

const INITIAL_STATE = {
  authToken: "",
  loginEmail: "",
  loginPassword: "",
  errorMsg: "",
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    text: ""
  }
};

function login(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    /*
    *  Called From: <Login />
    *  Payload: Email value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_EMAIL:
      return Object.assign({}, state, { loginEmail: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: Password value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Clear password from redux after form submission
    */
    case CLEAR_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: "" });

    /*
    *  Called From: <Login />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload });

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
      error = "An unknown login error occurred";
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        errorMsg: error
      });

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Activate spinner so user knows API request is in progress
    */
    case LOGIN_GITHUB_REQUEST:
      console.log("login github request");
      return Object.assign({}, state, { spinnerClass: "spinner__show" });

    /*
    *  Called From: <Login />
    *  Payload: N/A
    *  Purpose: De-activate the progress spinner.
    *  Note: this action is also handled in the appState reducer.
    */
    case LOGIN_GITHUB_SUCCESS:
      console.log("login github success");
      return Object.assign({}, state, {
        loginEmail: "",
        loginPassword: ""
      });

    /*
    *  Called From: <Login />
    *  Payload: Error Message
    *  Purpose: Display API login error to user
    */
    case LOGIN_GITHUB_FAILURE:
      console.log("login github error");
      console.log(error);
      error = "An unknown login error occurred";
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

    default:
      return state;
  }
}

export default login;
