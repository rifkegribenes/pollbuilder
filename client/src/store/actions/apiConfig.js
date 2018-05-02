/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

<<<<<<< HEAD
const prodUrl = 'https://pollbuilder.glitch.me';
=======
// const prodUrl = 'https://pollbuilder.glitch.me';
>>>>>>> a0d589fac739bf45e16bbc58c6a171b860b403e8
const devUrl = "http://localhost:3001"; // server url for local install

/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT
<<<<<<< HEAD
// export const BASE_URL = devUrl;
export const BASE_URL = prodUrl;
=======
export const BASE_URL = devUrl;
>>>>>>> a0d589fac739bf45e16bbc58c6a171b860b403e8
// export const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);
