export const LOGOUT = 'LOGOUT';
export const SET_LOGIN_USER = 'SET_LOGIN_USER';
export const SET_LOGIN_PWD = 'SET_LOGIN_PWD';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
export const CLEAR_LOGIN_PWD = 'CLEAR_LOGIN_PWD';
export const SET_PROFILE_VIEW = 'SET_PROFILE_VIEW';
export const DISMISS_LOGIN_MODAL = 'DISMISS_LOGIN_MODAL';
export const SET_REG_ERROR = 'SET_REG_ERROR';
export const DISMISS_REG_MODAL = 'DISMISS_REG_MODAL';
export const DISMISS_VIEWPROFILE_MODAL = 'DISMISS_VIEWPROFILE_MODAL';
export const SET_PROFILE_MODAL_CLASS = 'SET_PROFILE_MODAL_CLASS';
export const SET_PROFILE_MODAL_TEXT = 'SET_PROFILE_MODAL_TEXT';

export function dismissViewProfileModal() {
  return ({
    type: DISMISS_VIEWPROFILE_MODAL,
  });
}

export function setProfileModalClass(modalClass) {
  return ({
    type: SET_PROFILE_MODAL_CLASS,
    payload: modalClass,
  });
}

export function setProfileModalText(text) {
  return ({
    type: SET_PROFILE_MODAL_TEXT,
    payload: text,
  });
}

export function setRegError(msg) {
  return ({
    type: SET_REG_ERROR,
    payload: msg,
  });
}

export function dismissRegModal() {
  return ({
    type: DISMISS_REG_MODAL,
  });
}

export function logout() {
  return ({
    type: LOGOUT,
  });
}

export function setLoginUser(user) {
  return ({
    type: SET_LOGIN_USER,
    payload: user,
  });
}

export function setLoginPwd(pw) {
  return ({
    type: SET_LOGIN_PWD,
    payload: pw,
  });
}

export function setLoginError(msg) {
  return ({
    type: SET_LOGIN_ERROR,
    payload: msg,
  });
}

export function clearLoginPwd() {
  return ({
    type: CLEAR_LOGIN_PWD,
  });
}

export function dismissLoginModal() {
  return ({
    type: DISMISS_LOGIN_MODAL,
  });
}