export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
export const SET_PROFILE_VIEW = "SET_PROFILE_VIEW";
export const DISMISS_LOGIN_MODAL = "DISMISS_LOGIN_MODAL";
export const SET_REG_ERROR = "SET_REG_ERROR";
export const DISMISS_REG_MODAL = "DISMISS_REG_MODAL";
export const DISMISS_VIEWPROFILE_MODAL = "DISMISS_VIEWPROFILE_MODAL";

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

export function dismissLoginModal() {
  return {
    type: DISMISS_LOGIN_MODAL
  };
}
