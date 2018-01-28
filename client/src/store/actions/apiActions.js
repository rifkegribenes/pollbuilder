import { CALL_API } from 'redux-api-middleware';
import { BASE_URL } from './apiConfig.js';

export const VALIDATE_TOKEN_REQUEST = 'VALIDATE_TOKEN_REQUEST';
export const VALIDATE_TOKEN_SUCCESS = 'VALIDATE_TOKEN_SUCCESS';
export const VALIDATE_TOKEN_FAILURE = 'VALIDATE_TOKEN_FAILURE';

/*
* Function: validateToken - validates a token pulled from user's localStorage
*  by attempting to get the profile for the user ID stored locally.
* @param {string} token: the token from localStorage
* @param {string} profileId: the profileId from localStorage
* This action dispatches additional actions as it executes:
*   VALIDATE_TOKEN_REQUEST:
*     Initiates a spinner on the home page.
*   VALIDATE_TOKEN_SUCCESS:
*     Dispatched if the token was valid and the profile is returned.
*     This logs the user in, stores the token and sets the current
*     user profile.
*   VALIDATE_TOKEN_FAILURE: Dispatched if the token was invalid.
*     Logs the user out and deletes the values saved in localStorage.
*/
export function validateToken(token, profileId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/profile/${profileId}`,
      method: 'GET',
      types: [
        VALIDATE_TOKEN_REQUEST,
        {
          type: VALIDATE_TOKEN_SUCCESS,
          meta: { token },
        },
        VALIDATE_TOKEN_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

/*
* Function: login - Attempts to log in with supplied ID/password.
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
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/login`,
      method: 'POST',
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';

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
export function register(body) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/register`,
      method: 'POST',
      types: [REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE';

export function getProfile(token, profileId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/profile/${profileId}`,
      method: 'GET',
      types: [GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}