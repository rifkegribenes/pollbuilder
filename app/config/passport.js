'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

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
