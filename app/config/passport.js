// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/user'),
  Auth = require('../config/auth'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local'),
  GithubStrategy = require('passport-github').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

// Local strategy options
const localOptions = {
  usernameField: 'email',
  passReqToCallback : true
};

// Local login strategy
const localLogin = new LocalStrategy(localOptions,
  (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        return done(null, user);
      });
    });
});

// JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Telling Passport where to find the secret
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback : true
};

// JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions,
  (req, payload, done) => {
    User.findById(payload._id, (err, user) => {
      if (err) { return done(err, false); }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
});

// Facebook strategy options
const facebookOptions = {
  clientID: Auth.facebookAuth.clientID,
  clientSecret: Auth.facebookAuth.clientSecret,
  callbackURL: Auth.facebookAuth.callbackURL,
  profileFields: ['id', 'name', 'emails', 'photos'],
  passReqToCallback: true
};

// Facebook login strategy
const facebookLogin = new FacebookStrategy(facebookOptions,
  (req, token, refreshToken, profile, done) => {
    console.log('facebookStrategy');
    process.nextTick(function() {
      User.findOrCreate({ [facebook.id]: profile.id }, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
          console.log('fb found user');
          done(null, user);
        } else {
          console.log('fb new user');
          // if there is no user found with that facebook id, create them
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.avatarUrl = profile.photos[0].value;

          // save new user to the database
          newUser.save(function(err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    });
  });

// Github strategy options
const githubOptions = {
  clientID: Auth.githubAuth.clientID,
  clientSecret: Auth.githubAuth.clientSecret,
  callbackURL: Auth.githubAuth.callbackURL,
  passReqToCallback: true
};

// Github login strategy
const githubLogin = new GithubStrategy(githubOptions,
  (req, accessToken, refreshToken, profile, done) => {
    User.findOrCreate({ [github.id]: profile.id }, (err, user) => {
      if (err) { return done(err, false); }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(githubLogin);
passport.use(facebookLogin);
