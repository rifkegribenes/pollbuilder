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
  	callbackURL: configAuth.githubAuth.callbackURL
  	},
  	function (token, refreshToken, profile, done) {
  		console.log('passport.js > new GitHubStrategy');
  		process.nextTick(function () {
        // check if the user is already logged in
        if (!req.user) {
  			  User.findOrCreate({ 'github.id': profile.id }, function (err, user) {
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
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current user's github credentials
          user.github.id = profile.id;
          user.github.username = profile.username;
          user.github.displayName = profile.displayName;
          user.github.publicRepos = profile._json.public_repos;

          // save the user
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        }
      });
    }
  ));
}