const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:8080';


const AuthenticationController = require('./app/controllers/authentication');
const UserController = require('./app/controllers/user');

const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./app/models/user');
const Auth = require('./app/config/auth');

const passportService = require('./app/config/passport');

// Local strategy options
const localOptions = {
  usernameField: 'email',
  passReqToCallback : true
};

// Local login strategy
const localLogin = new LocalStrategy(localOptions,
  (req, email, password, done) => {
    User.findOne({ 'local.email': email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { error: 'No user account found with that email. Please try again.' }); }

      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        return done(null, user);
      });
    });
});

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router();


  //= ========================
  // Social logins
  //= ========================

  // Facebook strategy options
const facebookOptions = {
  clientID: Auth.facebookAuth.clientID,
  clientSecret: Auth.facebookAuth.clientSecret,
  callbackURL: Auth.facebookAuth.callbackURL,
  profileFields: ['id', 'emails', 'name', 'photos'],
  passReqToCallback: true
};

// Facebook login strategy
passport.use(new FacebookStrategy(facebookOptions,
  (req, token, refreshToken, profile, done) => {
    console.log(`Facebook login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
    console.log(profile);
    process.nextTick(function() {
      User.findOne({'facebook.id': profile.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (!user) {
          console.log('fb new user');

          // if no user found with that facebook id, create one
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.email = profile.emails[0].value;
          newUser.profile.firstName = profile.name.givenName;
          newUser.profile.lastName = profile.name.familyName;
          newUser.profile.email = profile.emails[0].value;
          newUser.profile.avatarUrl = profile.photos[0].value;

          // save new user to the database
          newUser.save(function(err) {
            console.log('saving new user to db');
            if (err)
              console.log(err);

            return done(err, user);
          });
        } else {
          //found user. Return
          console.log('fb found user');
          return done(err, user);
        }
      });
    });
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// app.get('/auth/facebook', AuthenticationController.loginFacebook);
app.get('/auth/facebook', passport.authenticate(
     'facebook',
     {scope:['public_profile', 'email']}
   ));

// handle the callback after facebook has authenticated the user
// return user object and fb token to client
// app.get('/auth/facebook/callback', AuthenticationController.fbCallback);
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  // need to handle login errors client-side here if redirected to login
  failureRedirect: `${CLIENT_URL}/login` }), ((req, res) => {
    // successful authentication from facebook
    console.log('Facebook Auth Succeeded');
    console.log(req.isAuthenticated());
    let postLoginPath = `${CLIENT_URL}/`
    res.redirect(postLoginPath);
}));


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