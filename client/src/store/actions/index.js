export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_TOUCHED = "SET_TOUCHED";
export const SET_SUBMIT = "SET_SUBMIT";
export const SHOW_ERRORS = "SHOW_ERRORS";
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS";
export const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
export const CLEAR_LOGIN_ERROR = "CLEAR_LOGIN_ERROR";
export const SET_PROFILE_VIEW = "SET_PROFILE_VIEW";
export const SET_REG_ERROR = "SET_REG_ERROR";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const DISMISS_MODAL = "DISMISS_MODAL";

export function setRegError(msg) {
  return {
    type: SET_REG_ERROR,
    payload: msg
  };
}

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    payload: url
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function setLoggedIn(user) {
  return {
    type: SET_LOGGEDIN,
    payload: user
  };
}

export function setFormField(id, value) {
  return {
    type: SET_FORM_FIELD,
    payload: {
      id,
      value
    }
  };
}

export function setTouched(name) {
  console.log("index.js (actions) > 51: setTouched");
  return {
    type: SET_TOUCHED,
    payload: name
  };
}

export function setLoginError(msg) {
  return {
    type: SET_LOGIN_ERROR,
    payload: msg
  };
}

export function setValidationErrors(errorsObj) {
  return {
    type: SET_VALIDATION_ERRORS,
    payload: errorsObj
  };
}

export function clearLoginError() {
  return {
    type: CLEAR_LOGIN_ERROR
  };
}

export function dismissModal() {
  return {
    type: DISMISS_MODAL
  };
}

export function showErrors(bool) {
  return {
    type: SHOW_ERRORS,
    payload: bool
  };
}

export function setSubmit() {
  return {
    type: SET_SUBMIT
  };
}
