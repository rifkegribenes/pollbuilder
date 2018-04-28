export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_FORM_ERROR = "SET_FORM_ERROR";
export const SET_OPTION = "SET_OPTION";
export const DELETE_OPTION = "DELETE_OPTION";
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS";
export const RESET_FORM = "RESET_FORM";
export const SHOW_FORM_ERROR = "SHOW_FORM_ERROR";
export const SET_TOUCHED = "SET_TOUCHED";
export const SET_SHOW_ERROR = "SET_SHOW_ERROR";
export const SET_SUBMIT = "SET_SUBMIT";
export const SET_PROFILE_VIEW = "SET_PROFILE_VIEW";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const DISMISS_MODAL = "DISMISS_MODAL";
export const SET_MODAL_ERROR = "SET_MODAL_ERROR";
export const SET_MODAL_ERROR_H = "SET_MODAL_ERROR_H";
export const SET_MODAL_INFO = "SET_MODAL_INFO";
export const SET_SPINNER = "SET_SPINNER";
export const SET_MENU_STATE = "SET_MENU_STATE";
export const SET_ADMIN_MENU_STATE = "SET_ADMIN_MENU_STATE";
export const SET_WINDOW_SIZE = "SET_WINDOW_SIZE";

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    payload: url
  };
}

export function setSpinner(spinnerClass) {
  return {
    type: SET_SPINNER,
    payload: spinnerClass
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

export function setOption(options) {
  return {
    type: SET_OPTION,
    payload: options
  };
}

export function deleteOption(options, errors, idx) {
  return {
    type: DELETE_OPTION,
    payload: { options, errors, idx }
  };
}

export function setValidationErrors(errors) {
  return {
    type: SET_VALIDATION_ERRORS,
    payload: { ...errors }
  };
}

export function showFormError(bool) {
  return {
    type: SHOW_FORM_ERROR,
    payload: bool
  };
}

export function setTouched(name) {
  return {
    type: SET_TOUCHED,
    payload: name
  };
}

export function setShowError(name, bool) {
  return {
    type: SET_SHOW_ERROR,
    payload: { name, bool }
  };
}

export function setSubmit() {
  return {
    type: SET_SUBMIT
  };
}

export function setModalError(msg) {
  return {
    type: SET_MODAL_ERROR,
    payload: msg
  };
}

export function setModalErrorH(msg) {
  return {
    type: SET_MODAL_ERROR_H,
    payload: msg
  };
}

export function setModalInfo(modalObj) {
  return {
    type: SET_MODAL_INFO,
    payload: modalObj
  };
}

export function dismissModal() {
  return {
    type: DISMISS_MODAL
  };
}

export function setMenuState(menu) {
  return {
    type: SET_MENU_STATE,
    payload: menu
  };
}

export function setAdminMenuState(menu) {
  return {
    type: SET_ADMIN_MENU_STATE,
    payload: menu
  };
}

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  };
}
