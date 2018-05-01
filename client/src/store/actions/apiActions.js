import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const VALIDATE_TOKEN_REQUEST = "VALIDATE_TOKEN_REQUEST";
export const VALIDATE_TOKEN_SUCCESS = "VALIDATE_TOKEN_SUCCESS";
export const VALIDATE_TOKEN_FAILURE = "VALIDATE_TOKEN_FAILURE";

/*
* Function: validateToken - validates a token pulled from user's localStorage
*  by attempting to get the profile for the user ID stored locally.
* @param {string} token: the token from localStorage
* @param {string} userId: the userId from localStorage
* This action dispatches additional actions as it executes:
*   VALIDATE_TOKEN_REQUEST:
*     Initiates a spinner on the home page.
*   VALIDATE_TOKEN_SUCCESS:
*     Dispatched if the token was valid and the user object is returned.
*     This logs the user in, stores the token and sets the current
*     user profile.
*   VALIDATE_TOKEN_FAILURE: Dispatched if the token was invalid.
*     Logs the user out and deletes the values saved in localStorage.
*/
export function validateToken(token, userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "GET",
      types: [
        VALIDATE_TOKEN_REQUEST,
        {
          type: VALIDATE_TOKEN_SUCCESS,
          meta: { token }
        },
        {
          type: VALIDATE_TOKEN_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAILURE = "REFRESH_TOKEN_FAILURE";
/*
* Function: refreshToken
* @param {token} - This function gets a new token from the server after
* email verification
*  Verification status is coded within the token, and used by the server
*  We are passing the old token, which is valid, but has user_verified=false
*  And we will receive a new valid token with uer_verified=true
*/
export function refreshToken(token) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/refresh_token`,
      method: "GET",
      types: [
        REFRESH_TOKEN_REQUEST,
        REFRESH_TOKEN_SUCCESS,
        REFRESH_TOKEN_FAILURE
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

/*
* Function: login - Attempts to log in with supplied email/password.
*   returns a JWT if successful.
* @param {string} body - the userID/password entered by user
* This action dispatches additional actions as it executes:
*   LOGIN_REQUEST: Initiates a spinner on the login page.
*   LOGIN_SUCCESS: Dispatched if credentials valid and profile returned.
*     Logs user in, stores token, sets current user profile in app state.
*   LOGIN_FAILURE: Dispatched if credentials invalid.
*     Displays error to user, prompt to try again or register.
*/
export function login(body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/auth/login`,
      method: "POST",
      types: [
        LOGIN_REQUEST,
        LOGIN_SUCCESS,
        {
          type: LOGIN_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

export const VERIFY_EMAIL_REQUEST = "VERIFY_EMAIL_REQUEST";
export const VERIFY_EMAIL_SUCCESS = "VERIFY_EMAIL_SUCCESS";
export const VERIFY_EMAIL_FAILURE = "VERIFY_EMAIL_FAILURE";

/*
* Function: verifyEmail - Attempts to verify email with uid & key.
*   returns a JWT if successful.
* @param {string} uid - userID
* @param {string} key – signup key generated at registration
* This action dispatches additional actions as it executes:
*   VERIFY_EMAIL_REQUEST: Initiates a spinner on the login page.
*   VERIFY_EMAIL_SUCCESS: Dispatched if credentials valid and profile returned.
*     Logs user in, stores token, sets current user profile in app state.
*   VERIFY_EMAIL_FAILURE: Dispatched if credentials invalid.
*     Displays error to user, prompt to try again.
*/
export function verifyEmail(body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/auth/verify/`,
      method: "POST",
      types: [
        VERIFY_EMAIL_REQUEST,
        VERIFY_EMAIL_SUCCESS,
        {
          type: VERIFY_EMAIL_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

export const RESEND_VLINK_REQUEST = "RESEND_VLINK_REQUEST";
export const RESEND_VLINK_SUCCESS = "RESEND_VLINK_SUCCESS";
export const RESEND_VLINK_FAILURE = "RESEND_VLINK_FAILURE";

/*
* Function: resendVerificationLink - Generates a new email verification
* link and dispatches an email to user.
* @param {string} email - the email of the logged-in user
* This action dispatches additional actions as it executes:
*   RESEND_VLINK_REQUEST: Initiates a spinner on the login page.
*   RESEND_VLINK_SUCCESS: Dispatched if credentials valid and profile returned.
*     Logs user in, stores fb token, sets current user profile in app state.
*   RESEND_VLINK_FAILURE: Dispatched if credentials invalid.
*     Displays error to user, prompt to try again or register.
*/
export function resendVerificationLink(body) {
  console.log("apiActions > 193");
  console.log(body);
  console.log(JSON.stringify(body));
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/sendverifyemail`,
      method: "POST",
      types: [
        RESEND_VLINK_REQUEST,
        RESEND_VLINK_SUCCESS,
        {
          type: RESEND_VLINK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

export const REGISTRATION_REQUEST = "REGISTRATION_REQUEST";
export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export const REGISTRATION_FAILURE = "REGISTRATION_FAILURE";

/*
* Function: register - Checks to see if user already exists,
*   creates new user account if not.
* @param {string} body - the email/password entered by user
* This action dispatches additional actions as it executes:
*   REGISTRATION_REQUEST: Initiates a spinner on the login page.
*   REGISTRATION_SUCCESS: Dispatched if new account is created successfully.
*     Creates new account, logs user in, stores token, sets user profile.
*   REGISTRATION_FAILURE:
*     Dispatched if user already exists or password is invalid.
*     Displays error to user, prompt to try again.
*/
export function registration(body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/auth/register`,
      method: "POST",
      types: [
        REGISTRATION_REQUEST,
        REGISTRATION_SUCCESS,
        {
          type: REGISTRATION_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

export const GET_PROFILE_REQUEST = "GET_PROFILE_REQUEST";
export const GET_PROFILE_SUCCESS = "GET_PROFILE_SUCCESS";
export const GET_PROFILE_FAILURE = "GET_PROFILE_FAILURE";

export function getProfile(token, userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "GET",
      types: [
        GET_PROFILE_REQUEST,
        GET_PROFILE_SUCCESS,
        {
          type: GET_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

export const GET_PARTIAL_PROFILE_REQUEST = "GET_PARTIAL_PROFILE_REQUEST";
export const GET_PARTIAL_PROFILE_SUCCESS = "GET_PARTIAL_PROFILE_SUCCESS";
export const GET_PARTIAL_PROFILE_FAILURE = "GET_PARTIAL_PROFILE_FAILURE";

export function getPartialProfile(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/partial/${userId}`,
      method: "GET",
      types: [
        GET_PARTIAL_PROFILE_REQUEST,
        GET_PARTIAL_PROFILE_SUCCESS,
        {
          type: GET_PARTIAL_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

export const RESET_PW_REQUEST = "RESET_PW_REQUEST";
export const RESET_PW_SUCCESS = "RESET_PW_SUCCESS";
export const RESET_PW_FAILURE = "RESET_PW_FAILURE";

/*
* Function: resetPassword
*/
export function resetPassword(body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/resetpassword`,
      method: "POST",
      types: [
        RESET_PW_REQUEST,
        RESET_PW_SUCCESS,
        {
          type: RESET_PW_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                if (data.error) {
                  message = data.error;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

export const SEND_RESET_EMAIL_REQUEST = "SEND_RESET_EMAIL_REQUEST";
export const SEND_RESET_EMAIL_SUCCESS = "SEND_RESET_EMAIL_SUCCESS";
export const SEND_RESET_EMAIL_FAILURE = "SEND_RESET_EMAIL_FAILURE";

/*
* Function: sendResetEmail
* @param {String} - email to address the reset email to
*/
export function sendResetEmail(email) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/sendresetemail`,
      method: "POST",
      types: [
        SEND_RESET_EMAIL_REQUEST,
        {
          type: SEND_RESET_EMAIL_SUCCESS,
          meta: email
        },
        {
          type: SEND_RESET_EMAIL_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email)
    }
  };
}

export const MODIFY_PROFILE_REQUEST = "MODIFY_PROFILE_REQUEST";
export const MODIFY_PROFILE_SUCCESS = "MODIFY_PROFILE_SUCCESS";
export const MODIFY_PROFILE_FAILURE = "MODIFY_PROFILE_FAILURE";

export function modifyProfile(token, userId, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "PUT",
      types: [
        MODIFY_PROFILE_REQUEST,
        MODIFY_PROFILE_SUCCESS,
        {
          type: MODIFY_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                if (data.error) {
                  message = data.error;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}
