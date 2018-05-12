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

module.exports = (passport) => {

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
        if (!user) { return done({ message: 'No user account found with that email. Please try again.' }, false); }

        user.comparePassword(password, (err, isMatch) => {
          if (err) { return done(err); }
          if (!isMatch) { return done({ message: 'Oops! Please check your password and try again.' }, false); }
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
      // console.log(payload);
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

  // helper methods for updating existing profile with social login info

  const nameFormula = (platform, profile) => {
    let firstName, lastName;
    if (platform === 'facebook') {
      firstName = profile.name.givenName;
      lastName = profile.name.familyName;
    } else {
      firstName = profile.displayName.split(' ')[0];
      lastName = profile.displayName.split(' ').slice(1);
    }
    return { firstName, lastName };
  }
  
  const avatarFormula = (platform, profile) => {
    let avatarUrl;
    if (platform === 'facebook') {
      avatarUrl = `http://graph.facebook.com/${profile.id}/picture?height=400`
    } else {
      avatarUrl = profile.photos[0].value;
    }
    return avatarUrl;
  }

  const findExistingUser = (profile, token, platform, done) => {
    // if mongo user exists with empty platform key,
    // update with platform info and return updated user
    const pID = `${platform}.id`;
    const { firstName, lastName } = nameFormula(platform, profile);
    console.log(`no user found with matching ${platform} key, try searching for existing user with empty ${platform} id`);
    const target = {
      'profile.email': profile.emails[0].value,
      [pID]: null
      };
    const updates = {
      [platform]: {
        id: profile.id,
        token: token,
        email: profile.emails[0].value
      },
      profile: {
        firstName,
        lastName,
        email: profile.emails[0].value,
        avatarUrl: avatarFormula(platform, profile)
      }
    };
    // return updated document rather than the original
    const options = { new: true };

    User.findOneAndUpdate(target, updates, options)
    .exec()
    .then( (user) => {
      if (!user) {
        saveNewUser(updates, options, profile, token, platform, done);
      } else {
        // found user with matching id and empty fb key
        // update & return new user
        console.log(`${platform} found and updated user with empty ${platform} id`);
        console.log(user);
        return done(null, user);
      }
    }) // then
    .catch( (err) => {
      console.log(err);
      return done(err);
    }); // catch
  }

  // save new user
  const saveNewUser = (updates, options, profile, token, platform, done) => {
    console.log(`no user found with empty ${platform} key, try looking for existing user with different ${platform} id, otherwise save new user`);
    const target = {
      'profile.email': profile.emails[0].value
    };
    const { firstName, lastName } = nameFormula(platform, profile);
    User.findOneAndUpdate(target, updates, options)
    .exec()
    .then( (user) => {
      if (!user) {
        // console.log('no user found, make a new user');
        // console.log(`${platform} new user`);
        // if no user found with that email, create one
        var newUser = new User();
        newUser[platform].id = profile.id;
        newUser[platform].token = token;
        newUser[platform].email = profile.emails[0].value;
        newUser.profile.firstName = firstName;
        newUser.profile.lastName = lastName;
        newUser.profile.email = profile.emails[0].value;
        newUser.profile.avatarUrl = avatarFormula(platform, profile);
        newUser.verified = true;

        // console.log(newUser);

        // save new user to database
        newUser.save((err) => {
          console.log(`saving new ${platform} user to db`);
          if (err) {
            console.log(err);
            throw err;
          }
          return done(err, newUser);
        });
      } else {
        // found user with matching id and different platform key.
        // update & return new user
        console.log(`${platform} found and updated user with a different ${platform} id`);
        // console.log(user._doc);
        return done(null, user);
      }
    }) // then
    .catch( (err) => {
      console.log(err);
      return done(err);
    }); // catch
  }


  // Facebook strategy options
  const facebookOptions = {
    clientID: Auth.facebookAuth.clientID,
    clientSecret: Auth.facebookAuth.clientSecret,
    callbackURL: Auth.facebookAuth.callbackURL,
    profileFields: ['id', 'emails', 'name', 'photos'],
    passReqToCallback: true,
    scope: ['profile', 'email'],
  };

  // Facebook login strategy
  passport.use('facebook', new FacebookStrategy(facebookOptions,
    function(req, token, refreshToken, profile, done) {
      console.log(`Facebook login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
      process.nextTick( () => {
        console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          findExistingUser(profile, token, 'facebook', done)
        } else {
          // found logged-in user.
          // if this is their first time logging in with FB
          // we still have to update their mongo profile
          // with the FB account info
          if (!req.user.facebook.id) {
            console.log('mongo user with no facebook id');
            findExistingUser(profile, token, 'facebook', done)
            } else {
              // otherwise just return the existing user
              console.log('user with existing facebook id');
              console.log(req.user);
              return done(null, req.user);
            }
        }
      }); // process.nextTick()
    }) // FacebookStrategy
  );

  // Github strategy options
  const githubOptions = {
    clientID: Auth.githubAuth.clientID,
    clientSecret: Auth.githubAuth.clientSecret,
    redirect_uri: Auth.githubAuth.callbackURL,
    profileFields: ['id', 'emails', 'name', 'photos'],
    passReqToCallback: true,
    scope: ['profile', 'email']
  };

  // Github login strategy
  passport.use('github', new GithubStrategy(githubOptions,
    function(req, token, refreshToken, profile, done) {
      console.log(`Github login by ${profile.displayName}, ID: ${profile.id}`);
      process.nextTick( () => {
        console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          findExistingUser(profile, token, 'github', done)
        } else {
          // found logged-in user. Return
          console.log('gh found user');
          console.log(req.user);
          return done(null, req.user);
        }
      }); // process.nextTick()
    }) // GithubStrategy
  );

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
    function(req, token, refreshToken, profile, done) {
      console.log(`Google login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
      process.nextTick( () => {
        console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          findExistingUser(profile, token, 'google', done)
        } else {
          // found logged-in user.
          // if this is their first time logging in with Google
          // we still have to update their mongo profile
          // with the Google account info
          if (!req.user.google.id) {
            console.log('mongo user with no google id');
            findExistingUser(profile, token, 'google', done)
            } else {
              // otherwise just return the existing user
              console.log('user with existing google id');
              console.log(req.user);
              return done(null, req.user);
            }
        }
      }); // process.nextTick()
    }) // GoogleStrategy
  );

}
