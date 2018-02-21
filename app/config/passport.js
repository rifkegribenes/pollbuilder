// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/user'),
  Auth = require('../config/auth'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local'),
  GithubStrategy = require('passport-github2').Strategy,
  GoogleStrategy = require('passport-google-oauth2').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {

  // Local strategy options
  const localOptions = {
    usernameField: 'email',
    passReqToCallback : true
  };

  // Local login strategy
  passport.use('local', new LocalStrategy(localOptions,
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
  }));

  // JWT strategy options
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback : true
  };

  // JWT login strategy
  passport.use('jwt', new JwtStrategy(jwtOptions,
    (req, payload, done) => {
      User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
  }));

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
  passport.use('facebook', new FacebookStrategy(facebookOptions,
    (req, token, refreshToken, profile, done) => {
      console.log(`Facebook login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
      process.nextTick(function() {
        // check if user is already logged in
        if (!req.user) {
          console.log('not signed in, facebook strategy');
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
                  throw err;
                return done(err, user);
              });
            } else {
              //found user. Return
              console.log('fb found user');
              return done(err, user);
            }
          });
        } else {
          console.log('logged in, link facebook');
        // user already exists and is logged in, we have to link accounts
          const user = req.user; // pull the user out of the session
          console.log('passport.js > 115: fb user');
          console.log(user);
          console.log('passport.js > 117: fb profile');
          console.log(profile);
          // update the current user's record with info from fb profile
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.email = profile.emails[0].value;
          user.profile.firstName = profile.name.givenName;
          user.profile.lastName = profile.name.familyName;
          user.profile.email = profile.emails[0].value;
          user.profile.avatarUrl = profile.photos[0].value;

          // save the user
          user.save(function(err) {
            if (err)
              console.log(err);
              throw err;
            return done(null, user);
          });
        }
      }); // process.nextTick
    }));

  // Github strategy options
  const githubOptions = {
    clientID: Auth.githubAuth.clientID,
    clientSecret: Auth.githubAuth.clientSecret,
    redirect_uri: Auth.githubAuth.callbackURL,
    profileFields: ['id', 'emails', 'name', 'photos'],
    passReqToCallback: true
  };

  // Github login strategy
  passport.use('github', new GithubStrategy(githubOptions,
      (req, token, refreshToken, profile, done) => {
        console.log('github strategy');
        process.nextTick(function() {
          User.findOne({ 'github.id': profile.id }, (err, user) => {
            if (err) {
              console.log(err);
              return done(err, false);
            }

            if (!user) {
              console.log('gh new user');

              // if no user found with that github id, create one
              var newUser = new User();
              newUser.github.id = profile.id;
              newUser.github.token = token;
              newUser.github.email = profile.emails[0].value;
              newUser.profile.firstName = profile.displayName.split(' ')[0];
              newUser.profile.lastName = profile.displayName.split(' ').slice(1);
              newUser.profile.email = profile.emails[0].value;
              newUser.profile.avatarUrl = profile.photos[0].value;

              console.log(newUser);

              // save new user to the database
              newUser.save(function(err) {
                console.log('saving new github user to db');
                if (err)
                  console.log(err);
                return done(err, newUser);
              });
            } else {
              //found user. Return
              console.log('github found user');
              console.log(user);
              return done(err, user);
            }
          });
        });
    }));

// Google strategy options
  const googleOptions = {
    clientID: Auth.googleAuth.clientID,
    clientSecret: Auth.googleAuth.clientSecret,
    callbackURL: Auth.googleAuth.callbackURL,
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name', 'photos'],
    scope: ['profile', 'email'],
  };

  // Google login strategy
  passport.use('google', new GoogleStrategy(googleOptions,
    (req, token, refreshToken, profile, done) => {
      console.log(`Google login by ${profile.name}, ID: ${profile.id}`);
      process.nextTick(function() {
        console.log('google profile');
        console.log(profile);
        User.findOne({'google.id': profile.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (!user) {
            console.log('google new user');

            // if no user found with that google id, create one
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.email = profile.emails[0].value;
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
            console.log('google found user');
            return done(err, user);
          }
        });
      });
    }));

}
