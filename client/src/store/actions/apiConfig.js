/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

const prodUrl = 'https://pollbuilder.glitch.me';
// const devUrl = "http://localhost:3001"; // server url for local install

/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT

// export const BASE_URL = devUrl;
export const BASE_URL = prodUrl;

// export const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);
