import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const CREATE_POLL_REQUEST = "CREATE_POLL_REQUEST";
export const CREATE_POLL_SUCCESS = "CREATE_POLL_SUCCESS";
export const CREATE_POLL_FAILURE = "CREATE_POLL_FAILURE";
export const VIEW_POLL_REQUEST = "VIEW_POLL_REQUEST";
export const VIEW_POLL_SUCCESS = "VIEW_POLL_SUCCESS";
export const VIEW_POLL_FAILURE = "VIEW_POLL_FAILURE";

/*
* Function: createPoll - create a new poll
* @param {string} body - poll title, questions and options; userId & token
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
* Function: viewPoll - get a single poll by ID
* @param {string} token, pollId
* This action dispatches additional actions as it executes:
*   VIEW_POLL_REQUEST:
*     Initiates a spinner on the home page.
*   VIEW_POLL_SUCCESS:
*     If new poll successfully retrieved, hides spinner
*   VIEW_POLL_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function viewPoll(token, pollId) {
  console.log(token);
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
      ],
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };
}
