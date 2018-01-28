'use strict';

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User = require('../models/users');
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {

	  // asynchronous
	  // User.findOne wont fire unless data is sent back
	  process.nextTick(function() {

		  // find a user whose email is the same as the forms email
		  // we are checking to see if the user trying to login already exists
		  User.findOne({ 'local.email' :  email }, function(err, user) {
		    // if there are any errors, return the error
		    if (err)
		      return done(err);

		    // check to see if theres already a user with that email
		    if (user) {
		      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
		    } else {

		      // if there is no user with that email
		      // create the user
		      var newUser = new User();

		      // set the user's local credentials
		      newUser.local.email = email;
		      newUser.local.password = newUser.generateHash(password);

		      // save the user
		      newUser.save(function(err) {
		        if (err)
		            throw err;
		        return done(null, newUser);
		      });
		     }

		  });

		});

	}));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

  // find a user whose email is the same as the form's email
  // we are checking to see if the user exists
  User.findOne(
  	// query - find by email
  	{ 'local.email' :  email },

  	// projection - select fields to return
    'email salt hash',

  	// callback - gets error & result of query
    (err, user) => {

    // if there are any errors, return the error before anything else
    if (err)
      return done(err);

    // if no user is found, return the message
    if (!user)
      return done(null, false, { message : 'No user found'});

    // if the user is found but the password is wrong
    if (!user.validPassword(password))
      return done(null, false, { message: 'Invalid Password'});

    // all is well, return successful user
    return done(null, user);
  });

}));

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
		},
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {
				User.findOne({ 'github.id': profile.id }, function (err, user) {
					if (err) {
						return done(err);
					}

					if (user) {
						return done(null, user);
					} else {
						var newUser = new User();

						newUser.github.id = profile.id;
						newUser.github.username = profile.username;
						newUser.github.displayName = profile.displayName;
						newUser.github.publicRepos = profile._json.public_repos;
						newUser.nbrClicks.clicks = 0;

						newUser.save(function (err) {
							if (err) {
								throw err;
							}

							return done(null, newUser);
						});
					}
				});
			});
		})
	);

	passport.use(new TwitterStrategy({
	  consumerKey: configAuth.twitterAuth.consumerKey,
	  consumerSecret: configAuth.twitterAuth.consumerSecret,
	  callbackURL: configAuth.githubAuth.callbackURL
	  }, function(token, tokenSecret, profile, done) {
	    process.nextTick(function () {
	      return done(null, profile);
	    });
	  })
  );

  // ======================================================================
  // FACEBOOK =============================================================
  // ======================================================================
  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      passReqToCallback: true
  },

  // facebook will send back the token and profile
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        // find the user in the database based on their facebook id
        User.findOne({ 'facebook.id': profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          if (err) return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            // save our user to the database
            newUser.save(function(err) {
              if (err)
               	throw err;

              // if successful, return the new user
              return done(null, newUser);
            });
          }

      });

    } else {
      // user already exists and is logged in, we have to link accounts
      var user = req.user; // pull the user out of the session

      // update the current user's facebook credentials
      user.facebook.id = profile.id;
      user.facebook.token = token;
      user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
      user.facebook.email = profile.emails[0].value;

      // save the user
      user.save(function(err) {
        if (err)
          throw err;
        return done(null, user);
      });
    }

  });

  }));

};
