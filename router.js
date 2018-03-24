const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const AuthenticationController = require('./app/controllers/authentication');
const UserController = require('./app/controllers/user');
const StaticController = require('./app/controllers/static');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');
const helpers = require('./app/utils/index');

/* =========================== ROUTE MIDDLEWARE ============================ */

// Checks wheather user has validated their account.
// If `validated: false`, bail out early.
const checkValidated = (req, res, next) => {
  const validatedErrMsg = 'You need to validate your account before you can access this resource.\nPlease visit your Profile and generate a new validation email.';

  if (!req.token.validated) {
    return res
      .status(400)  // bad request
      .json({ message : validatedErrMsg });
  } else {
    next();
  }
}

const requireAuth = (req, res, next) => {
  console.log('requireAuth');
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      console.log(`info: ${info}`);
      if (err) {
        return res.status(422).send({ success : false, message : err.message });
      }
      if (!user) {
        return res.status(422).send({ success : false, message : 'Sorry, you must log in to view this page.' });
      }
      if (user) {
        const userInfo = helpers.setUserInfo(user);
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          return next(user);
          // return res.status(200).send({
          //   token: helpers.generateToken(userInfo),
          //   user
          // });
        }); // req.login
      }
    })(req, res, next);
  };

const requireLogin = (req, res, next) => {
  console.log('requireLogin');
  passport.authenticate('local', { session: false },
    (err, user) => {
      console.log('requireLogin');
      if (err) {
        return res.status(422).send({ success : false, message : err.message });
      }

      if (!user) {
        return res.status(422).send({ success : false, message : 'Login error: Authentication Failed.' });
      }

      if (user) {
        const userInfo = helpers.setUserInfo(user);
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.status(200).send({
            token: helpers.generateToken(userInfo),
            user
          });
        }); // req.login
      }
    }
  )(req, res, next);
};

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router();

  app.use(passport.initialize());
  app.use(passport.session());

  // Catch client-side routes that don't exist on the back-end.
  // Redirects to /#/redirect={route}/{optional_id}
  app.get('/:client_route/:uid?', StaticController.redirectHash);

// ============================================================================
// AUTHENTICATE ===============================================================
// ============================================================================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Handle requests for password reset (generate/send token)
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/sendresetemail', AuthenticationController.sendReset);

  // Handle password resets
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/resetpassword', AuthenticationController.resetPass);

  // Handle requests for new verification email (generate/send token)
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/sendverifyemail', AuthenticationController.sendVerify);

  // Handle email validation links
  // Toggle user's `validated` property to `true`.
  // Returns fail status + message -or- user object & JWT
  authRoutes.post('/verify', AuthenticationController.verifyEmail);

  // Facebook authentication with passport
  authRoutes.get('/facebook',
    passport.authenticate('facebook', {scope:['public_profile', 'email']} ));

  // Handle callback after Facebook auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/facebook/callback',
    passport.authenticate('facebook'), AuthenticationController.fbCallback
    );

  // Github authentication with passport
  authRoutes.get('/github',
    passport.authenticate('github', {scope : ['profile', 'email']} ));

  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/github/callback',
    passport.authenticate('github'), AuthenticationController.ghCallback
    );

  // Google authentication with passport
  authRoutes.get('/google',
    passport.authenticate('google', {scope : ['profile', 'email']} ));


  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/google/callback',
    passport.authenticate('google'), AuthenticationController.googleCallback
    );

  //= ========================
  // User Routes
  //= ========================

  apiRoutes.get('refresh_token', UserController.refreshToken);

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  // Returns fail status + message -or- user object
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  // Update a user's profile.
  // Returns fail status + message -or- updated user object
  // userRoutes.put('/:userId', requireAuth, UserController.updateProfile);
  userRoutes.put('/:userId', UserController.updateProfile);

  // Test protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

  // apiRoutes.get('/admins-only', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), (req, res) => {
  //   res.send({ content: 'Admin dashboard is working.' });
  // });

  //= ========================
  // Communication Routes
  //= ========================
  // apiRoutes.use('/communication', communicationRoutes);

  // Send email from contact form
  // communicationRoutes.post('/contact', CommunicationController.sendContactForm);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};