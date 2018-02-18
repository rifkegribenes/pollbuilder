const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:8080';


const AuthenticationController = require('./app/controllers/authentication');
const UserController = require('./app/controllers/user');

const express = require('express');
const passport = require('passport');
const User = require('./app/models/user');
const Auth = require('./app/config/auth');
const helpers = require('./app/controllers/helpers');

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

// app.get('/auth/facebook', AuthenticationController.loginFacebook);
app.get('/auth/facebook', passport.authenticate(
     'facebook',
     {scope:['public_profile', 'email']}
   ));

// handle the callback after facebook has authenticated the user
// return user object and fb token to client
// app.get('/auth/facebook/callback', AuthenticationController.fbCallback);
// need to handle login errors client-side here if redirected to login
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: `${CLIENT_URL}/login`}),
  AuthenticationController.fbCallback
  );


  //= ========================
  // Auth Routes
  //= ========================

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