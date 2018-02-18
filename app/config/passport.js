// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/user'),
  Auth = require('../config/auth'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local'),
  GithubStrategy = require('passport-github').Strategy,
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

  // Github strategy options
  const githubOptions = {
    clientID: Auth.githubAuth.clientID,
    clientSecret: Auth.githubAuth.clientSecret,
    callbackURL: Auth.githubAuth.callbackURL,
    passReqToCallback: true
  };

  // Github login strategy
  passport.use('github', new  GithubStrategy(githubOptions,
    (req, accessToken, refreshToken, profile, done) => {
      User.findOrCreate({ [github.id]: profile.id }, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }));
}
