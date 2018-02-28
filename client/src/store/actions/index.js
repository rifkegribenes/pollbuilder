export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
export const CLEAR_LOGIN_ERROR = "CLEAR_LOGIN_ERROR";
export const SET_PROFILE_VIEW = "SET_PROFILE_VIEW";
export const SET_REG_ERROR = "SET_REG_ERROR";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const DISMISS_LOGIN_MODAL = "DISMISS_LOGIN_MODAL";
export const DISMISS_REG_MODAL = "DISMISS_REG_MODAL";
export const DISMISS_VIEWPROFILE_MODAL = "DISMISS_VIEWPROFILE_MODAL";
export const DISMISS_PWRESET_MODAL = "DISMISS_PWRESET_MODAL";

export function dismissViewProfileModal() {
  return {
    type: DISMISS_VIEWPROFILE_MODAL
  };
}

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

export function dismissRegModal() {
  return {
    type: DISMISS_REG_MODAL
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

export function setLoginError(msg) {
  return {
    type: SET_LOGIN_ERROR,
    payload: msg
  };
}

export function clearLoginError() {
  return {
    type: CLEAR_LOGIN_ERROR
  };
}

export function dismissLoginModal() {
  return {
    type: DISMISS_LOGIN_MODAL
  };
}
