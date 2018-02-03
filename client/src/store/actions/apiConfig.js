/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

// const prodUrl = 'https://rifkegribenes-voting-app.glitch.me';
const devUrl = "http://127.0.0.1:8080"; // server url for local install

/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT
export const BASE_URL = devUrl;
// export const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);
