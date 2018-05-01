import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const CREATE_POLL_REQUEST = "CREATE_POLL_REQUEST";
export const CREATE_POLL_SUCCESS = "CREATE_POLL_SUCCESS";
export const CREATE_POLL_FAILURE = "CREATE_POLL_FAILURE";
export const UPDATE_POLL_REQUEST = "UPDATE_POLL_REQUEST";
export const UPDATE_POLL_SUCCESS = "UPDATE_POLL_SUCCESS";
export const UPDATE_POLL_FAILURE = "UPDATE_POLL_FAILURE";
export const DELETE_POLL_REQUEST = "DELETE_POLL_REQUEST";
export const DELETE_POLL_SUCCESS = "DELETE_POLL_SUCCESS";
export const DELETE_POLL_FAILURE = "DELETE_POLL_FAILURE";
export const VIEW_POLL_REQUEST = "VIEW_POLL_REQUEST";
export const VIEW_POLL_SUCCESS = "VIEW_POLL_SUCCESS";
export const VIEW_POLL_FAILURE = "VIEW_POLL_FAILURE";
export const GET_ALL_POLLS_REQUEST = "GET_ALL_POLLS_REQUEST";
export const GET_ALL_POLLS_SUCCESS = "GET_ALL_POLLS_SUCCESS";
export const GET_ALL_POLLS_FAILURE = "GET_ALL_POLLS_FAILURE";
export const GET_USER_POLLS_REQUEST = "GET_USER_POLLS_REQUEST";
export const GET_USER_POLLS_SUCCESS = "GET_USER_POLLS_SUCCESS";
export const GET_USER_POLLS_FAILURE = "GET_USER_POLLS_FAILURE";
export const VOTE_REQUEST = "VOTE_REQUEST";
export const VOTE_SUCCESS = "VOTE_SUCCESS";
export const VOTE_FAILURE = "VOTE_FAILURE";

/*
* Function: createPoll - create a new poll
* @param {string} body - poll title, question and options; userId & token
* This action dispatches additional actions as it executes:
*   CREATE_POLL_REQUEST:
*     Initiates a spinner on the home page.
*   CREATE_POLL_SUCCESS:
*     If new poll successfully saved to database, Hides spinner,
*     displays success message in modal
*   CREATE_POLL_FAILURE:
*     If poll name already exists or form validation fails,
*     Hides spinner, displays error message in modal
*/
export function createPoll(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/createpoll`,
      method: "POST",
      types: [
        CREATE_POLL_REQUEST,
        CREATE_POLL_SUCCESS,
        {
          type: CREATE_POLL_FAILURE,
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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: updatePoll - find and update existing poll
* @param {string} body - poll id, title, question and options; userId & token
* This action dispatches additional actions as it executes:
*   UPDATE_POLL_REQUEST:
*     Initiates a spinner on the home page.
*   UPDATE_POLL_SUCCESS:
*     If poll successfully saved to database, Hides spinner,
*     displays success message in modal
*   UPDATE_POLL_FAILURE:
*     If poll update fails,
*     Hides spinner, displays error message in modal
*/
export function updatePoll(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/update/${body._id}`,
      method: "PUT",
      types: [
        UPDATE_POLL_REQUEST,
        UPDATE_POLL_SUCCESS,
        {
          type: UPDATE_POLL_FAILURE,
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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: viewPoll - get a single poll by ID
* @param {string} pollId
* This action dispatches additional actions as it executes:
*   VIEW_POLL_REQUEST:
*     Initiates a spinner on the home page.
*   VIEW_POLL_SUCCESS:
*     If new poll successfully retrieved, hides spinner
*   VIEW_POLL_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function viewPoll(pollId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/${pollId}`,
      method: "GET",
      types: [
        VIEW_POLL_REQUEST,
        VIEW_POLL_SUCCESS,
        {
          type: VIEW_POLL_FAILURE,
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

/*
* Function: deletePoll - delete a single poll by ID
* @param {string} token, pollId
* This action dispatches additional actions as it executes:
*   DELETE_POLL_REQUEST:
*     Initiates a spinner on the home page.
*   DELETE_POLL_SUCCESS:
*     If poll successfully deleted, hides spinner
*   DELETE_POLL_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function deletePoll(token, pollId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/delete/${pollId}`,
      method: "DELETE",
      types: [
        DELETE_POLL_REQUEST,
        DELETE_POLL_SUCCESS,
        {
          type: DELETE_POLL_FAILURE,
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
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };
}

/*
* Function: getAllPolls - return all active polls in database
* @param {string} token
* This action dispatches additional actions as it executes:
*   GET_ALL_POLLS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_ALL_POLLS_SUCCESS:
*     If polls array successfully retrieved, hides spinner
*   GET_ALL_POLLS_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getAllPolls() {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/allpolls`,
      method: "GET",
      types: [
        GET_ALL_POLLS_REQUEST,
        GET_ALL_POLLS_SUCCESS,
        {
          type: GET_ALL_POLLS_FAILURE,
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

/*
* Function: getUserPolls - return all polls for specific user
* @param {string} token
* This action dispatches additional actions as it executes:
*   GET_USER_POLLS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_USER_POLLS_SUCCESS:
*     If polls array successfully retrieved, hides spinner
*   GET_USER_POLLS_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getUserPolls(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/userpolls/${userId}`,
      method: "GET",
      types: [
        GET_USER_POLLS_REQUEST,
        GET_USER_POLLS_SUCCESS,
        {
          type: GET_USER_POLLS_FAILURE,
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

/*
* Function: vote - vote for an option in a poll
* @param {string} token
* This action dispatches additional actions as it executes:
*   VOTE_REQUEST:
*     Initiates a spinner on the home page.
*   VOTE_SUCCESS:
*     If vote succesfully recorded, hides spinner
*   VOTE_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function vote(pollId, optionId, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/poll/vote/${pollId}/${optionId}`,
      method: "POST",
      types: [
        VOTE_REQUEST,
        VOTE_SUCCESS,
        {
          type: VOTE_FAILURE,
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}
