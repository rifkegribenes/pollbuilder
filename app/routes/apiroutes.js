/*
   secured routes to handle database queries
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();
const secret = process.env.JWT_SECRET;
const jwt    = require('express-jwt');
const auth   = jwt({ secret: secret, requestProperty: 'token' });


/* =========================== LOAD CONTROLLERS ============================ */

const userCtrl = require('../controllers/user.ctrl');


/* =========================== ROUTE MIDDLEWARE ============================ */

// Checks existence and validity of JWT token
router.use(auth);

/* ================================ ROUTES ================================= */


// Refresh a user's JWT token
// Returns JSON user profile + new JWT on success
router.get('/refresh_token', userCtrl.refreshToken);


// Get a user's profile
// Returns JSON user profile object on success
router.get('/profile/:id', userCtrl.getOneProfile);


/* ================================ EXPORT ================================= */

module.exports = router;
