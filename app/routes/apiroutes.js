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


// Get a user's profile
// Returns JSON user profile object on success
router.get('/profile/:id', userCtrl.getOneProfile);

router.get('/auth/github', userCtrl.authGithub);


/* ================================ EXPORT ================================= */

module.exports = router;
