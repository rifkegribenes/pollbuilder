export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_FORM_ERROR = "SET_FORM_ERROR";
export const RESET_FORM = "RESET_FORM";
export const SET_PROFILE_VIEW = "SET_PROFILE_VIEW";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const DISMISS_MODAL = "DISMISS_MODAL";

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

export function resetForm() {
  return {
    type: RESET_FORM
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

export function setFormError(msg) {
  return {
    type: SET_FORM_ERROR,
    payload: msg
  };
}

export function dismissModal() {
  return {
    type: DISMISS_MODAL
  };
}
