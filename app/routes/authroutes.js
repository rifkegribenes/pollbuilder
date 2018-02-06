/*
   non-secured routes to handle user signup and login
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();


/* =========================== INIT CONTROLLERS ============================ */

const userCtrl = require('../controllers/user.ctrl');


/* ================================ ROUTES ================================= */

// Register new users
// Returns fail status + message -or- success status + JWT
router.post('/register', userCtrl.register);


// Handle user login
// Returns fail status + info -or- success status + JWT
router.post('/login', userCtrl.login);


/* ============================== EXPORT API =============================== */

module.exports = router;
