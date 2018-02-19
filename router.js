const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';

const AuthenticationController = require('./app/controllers/authentication');
const UserController = require('./app/controllers/user');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router();

  app.use(passport.initialize());
  app.use(passport.session());

// ============================================================================
// AUTHENTICATE (FIRST LOGIN) =================================================
// ============================================================================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

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
    passport.authenticate('github'));

  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/github/callback',
    passport.authenticate('github'), AuthenticationController.ghCallback
    );

  // Google authentication with passport
  authRoutes.get('/google',
    passport.authenticate('google'));

  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/google/callback',
    passport.authenticate('google'), AuthenticationController.googleCallback
    );

// ============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) ============
// ============================================================================

  // local --------------------------------
  authRoutes.get('/connect/local', function(req, res) {
      res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });
  authRoutes.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect : '/user', // redirect to the secure profile section
      failureRedirect : '/connect/local' // back to signup page if error
  }));

  // facebook -------------------------------

  // send to facebook to do the authentication
  authRoutes.get('/connect/facebook', passport.authorize('facebook', {
    scope : ['public_profile', 'email']
  }));

  // handle the callback after facebook has authorized the user
  authRoutes.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect : '/user',
      failureRedirect : '/'
    }));

  // github --------------------------------

  // send to github to do the authentication
  authRoutes.get('/connect/github', passport.authorize('github', { scope : 'email' }));

  // handle the callback after twitter has authorized the user
  authRoutes.get('/connect/github/callback',
    passport.authorize('github', {
      successRedirect : '/user',
      failureRedirect : '/'
    }));

  // google ---------------------------------

  // send to google to do the authentication
  authRoutes.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  authRoutes.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

// ==========================================================================
// UNLINK ACCOUNTS ==========================================================
// ==========================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  authRoutes.get('/unlink/local', function(req, res) {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/user');
    });
  });

  // facebook -------------------------------
  authRoutes.get('/unlink/facebook', function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/user');
    });
  });

  // github --------------------------------
  authRoutes.get('/unlink/github', function(req, res) {
    var user = req.user;
    user.github.token = undefined;
    user.save(function(err) {
       res.redirect('/user');
    });
  });

  // google ---------------------------------
  authRoutes.get('/unlink/google', function(req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
       res.redirect('/user');
    });
  });

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

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