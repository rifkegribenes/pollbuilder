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
    passReqToCallback: true,
    scope: ['profile', 'email'],
  };

  // FB findUser subroutine
  // updates profile with fb info
  const fbFindUser = (err, user) => {
    if (err) {
      console.log(err);
      return done(err, false);
    }
    if (user) {
      // console.log('fb found matching user');
      // console.log(user);
      return done(err, user);
    }
    // if mongo user exists with empty fb key,
    // update with fb info and then return updated user
    console.log('no user found with matching fb key, try searching for existing user with empty fb id...');
    const target = {
      'profile.email': profile.emails[0].value,
      'facebook.id': null
      };
    const updates = {
      facebook: {
        id: profile.id,
        token: token,
        email: profile.emails[0].value
      },
      profile: {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        avatarUrl: profile.photos[0].value
      }
    };
    // return updated document rather than the original
    const options = { new: true };
    User.findOneAndUpdate(target, updates, options)
      .exec()
      .then( (user) => {
        if (!user) {
          console.log('no user found with empty fb key, try looking for existing user with different fb id...');
          const target2 = {
            'profile.email': profile.emails[0].value
          };
          User.findOneAndUpdate(target2, updates, options)
            .exec()
            .then( (user) => {
              if (err) {
                console.log(err);
                return done(err, false);
              }
              if (!user) {
                console.log('no user found, make a new user');
                console.log('fb new user');

                // if no user found with that email, create one
                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.email = profile.emails[0].value;
                newUser.profile.firstName = profile.name.givenName;
                newUser.profile.lastName = profile.name.familyName;
                newUser.profile.email = profile.emails[0].value;
                newUser.profile.avatarUrl = profile.photos[0].value;

                console.log(newUser);

                // save new user to the database
                newUser.save(function(err) {
                  console.log('saving new fb user to db');
                  if (err)
                    console.log(err);
                    throw err;
                  return done(err, newUser);
                });
              }
              // found user with matching id and different fb key
              // update & return new user
              console.log('fb found and updated user with different fb id');
              console.log(user);
              return done(err, user);
            })
            .catch( (err) => {
              console.log(err);
            }); // findOneAndUpdate.then() existing user, no fb match
        }
        // found user with matching id and empty fb key.
        // update & return new user
        console.log('fb found and updated user with empty fb key');
        console.log(user);
        return done(err, user);
    })
      .catch( (err) => {
        console.log(err);
      }); // findOneAndUpdate.then() matching id, empty fb key
  } // fbFindUser

  // Facebook login strategy
  passport.use('facebook', new FacebookStrategy(facebookOptions,
    function(req, token, refreshToken, profile, done) {
      console.log(`Facebook login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
      process.nextTick(function(){
        console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          console.log('not signed in, facebook strategy');
          // if mongo user exists with matching fb id, return user
          User.findOne(
            {
              'profile.email': profile.emails[0].value,
              'facebook.id': profile.id
            })
          .then( function(user){
              if (user) {
              // console.log('fb found matching user');
              // console.log(user);
              return done(err, user);
              }
              // if mongo user exists with empty fb key,
              // update with fb info and then return updated user
              console.log('no user found with matching fb key, try searching for existing user with empty fb id...');
              const target = {
              'profile.email': profile.emails[0].value,
              'facebook.id': null
              };
              const updates = {
              facebook: {
                id: profile.id,
                token: token,
                email: profile.emails[0].value
              },
              profile: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                avatarUrl: profile.photos[0].value
              }
              };
              // return updated document rather than the original
              const options = { new: true };
              User.findOneAndUpdate(target, updates, options)
              .exec()
              .then( function(user) {
                if (!user) {
                  console.log('no user found with empty fb key, try looking for existing user with different fb id...');
                  const target2 = {
                    'profile.email': profile.emails[0].value
                  };
                  User.findOneAndUpdate(target2, updates, options)
                    .exec()
                    .then( function(user) {
                      if (!user) {
                        console.log('no user found, make a new user');
                        console.log('fb new user');

                        // if no user found with that email, create one
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.profile.firstName = profile.name.givenName;
                        newUser.profile.lastName = profile.name.familyName;
                        newUser.profile.email = profile.emails[0].value;
                        newUser.profile.avatarUrl = profile.photos[0].value;

                        console.log(newUser);

                        // save new user to the database
                        newUser.save(function(err) {
                          console.log('saving new fb user to db');
                          if (err) {
                            console.log(err);
                            throw err;
                          }
                          return done(err, newUser);
                        });
                      } else {
                        // found user with matching id and different fb key
                        // update & return new user
                        console.log('fb found and updated user with different fb id');
                        console.log(user);
                        return done(err, user);
                      }

                    })
                    .catch( (err) => {
                      console.log(err);
                    }); // findOneAndUpdate.then() existing user, no fb match
                }
                // found user with matching id and empty fb key.
                // update & return new user
                console.log('fb found and updated user with empty fb key');
                console.log(user);
                return done(err, user);
              })
              .catch( (err) => {
                console.log(err);
              }); // findOneAndUpdate.then() matching id, empty fb key
            })
          .catch( (err) => {
            console.log(err);
          }); // User.findOne.then() with matching mongo id & fb id
        } else {
          // found logged-in user. Return
          console.log('fb found user');
          console.log(req.user);
          return done(req.user);
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
    (req, token, refreshToken, profile, done) => {
      // check if user is already logged in
      if (!req.user) {
        // console.log('not signed in, github strategy');
        // if mongo user exists with matching github id, return user
        User.findOne(
          {
            'profile.email': profile.emails[0].value,
            'github.id': profile.id
          },
          (err, user) => {
            if (err) {
              console.log(err);
              return done(err, false);
            }
            if (user) {
              // console.log('github found matching user');
              // console.log(user);
              return done(err, user);
            } else {
              // if mongo user exists with empty github key,
              // update with github info and then return updated user
              // console.log('no user found with matching github key, try searching for existing user with empty github id...');
              const target = {
                'profile.email': profile.emails[0].value,
                'github.id': null
              };
              const updates = {
                github: {
                  id: profile.id,
                  token: token,
                  email: profile.emails[0].value
                },
                profile: {
                  firstName: profile.displayName.split(' ')[0],
                  lastName: profile.displayName.split(' ').slice(1),
                  email: profile.emails[0].value,
                  avatarUrl: profile.photos[0].value
                }
              };
              // return updated document rather than the original
              const options = { new: true };
              User.findOneAndUpdate(target, updates, options)
                .exec()
                .then( (user) => {
                  if (!user) {
                    // console.log('no user found, with empty github key, try looking for existing user with different github id...');
                    const target2 = {
                      'profile.email': profile.emails[0].value
                    };
                    User.findOneAndUpdate(target2, updates, options)
                    .exec()
                    .then( (err, user) => {
                      if (err) {
                        console.log(err);
                        return done(err, false);
                      }
                      if (!user) {
                        // console.log('no user found, make a new user');
                        // console.log('gh new user');
                        // if no user found with that email, create one
                        var newUser = new User();
                        newUser.github.id = profile.id;
                        newUser.github.token = token;
                        newUser.github.email = profile.emails[0].value;
                        newUser.profile.firstName = profile.displayName.split(' ')[0];
                        newUser.profile.lastName = profile.displayName.split(' ').slice(1);
                        newUser.profile.email = profile.emails[0].value;
                        newUser.profile.avatarUrl = profile.photos[0].value;

                        // console.log(newUser);

                        // save new user to the database
                        newUser.save((err) => {
                          console.log('saving new github user to db');
                          if (err)
                            console.log(err);
                          return done(err, newUser);
                        });
                      } else {
                        // found user with matching id and different gh key
                        // update & return new user
                        // console.log('github found and updated user with different gh id');
                        // console.log(user);
                        return done(err, user);
                      }
                    }); // findOneAndUpdate (existing user with no gh match)
                  } else {
                    // found user with matching id and empty gh key.
                    // update & return new user
                    // console.log('github found and updated user with empty gh key');
                    // console.log(user);
                    return done(err, user);
                  }
              }); // findOneAndUpdate matching id, empty gh key
            }
          }
        ); // User.findOne with matching mongo id & github id
      } else {
          // found logged-in user. Return
          // console.log('github found user');
          // console.log(req.user);
          return done(err, req.user);
        }
      }
    )
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
    (req, token, refreshToken, profile, done) => {
      console.log(`Google login by ${profile.name}, ID: ${profile.id}`);
      process.nextTick(function() {
        console.log('google profile');
        console.log(profile);
        User.findOne({'profile.email': profile.emails[0].value}, function(err, user) {
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
