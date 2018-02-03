'use strict';

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

// load up the user model
var User = require('../models/users');
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and deserialize users out of session

  // serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // github  =================================================================
  // =========================================================================
  passport.use(new GitHubStrategy({
  	clientID: configAuth.githubAuth.clientID,
  	clientSecret: configAuth.githubAuth.clientSecret,
  	redirect_uri: configAuth.githubAuth.callbackURL
  	},
  	function (token, refreshToken, profile, done) {
  		console.log('passport.js > new GitHubStrategy');
  		process.nextTick(function () {
				var newUser = new User();

				newUser.github.id = profile.id;
				newUser.github.username = profile.username;
				newUser.github.displayName = profile.displayName;
				newUser.github.publicRepos = profile._json.public_repos;
				newUser.nbrClicks.clicks = 0;

				newUser.save(function (err) {
          console.log('saving new user');
					if (err) {
						throw err;
					}

					return done(null, newUser);
				});
			});
    }));
}