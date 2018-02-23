const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';

const AuthenticationController = require('./app/controllers/authentication');
const UserController = require('./app/controllers/user');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');
const helpers = require('./app/controllers/helpers');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
// const requireLogin = passport.authenticate('local', { session: false });

// TODO: move this function into the auth controller
const requireLogin = (req, res, next) => {
  console.log('requireLogin');
  passport.authenticate('local', { session: false },
  (err, user) => {
    if (!user) {
      return res.status(422).send({ message: 'Login error: No account found.' });
    }
    if (err) {
      console.log(err);
      throw err;
      return res.status(422).send({ message: err });
    }
    if (user) {
      const userInfo = helpers.setUserInfo(user);
      return res.status(200).json({
        token: helpers.generateToken(userInfo),
        user
      });
  }})(req, res, next);
};

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
    passport.authorize('facebook'), AuthenticationController.fbConnectCallback);

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