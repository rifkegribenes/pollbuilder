'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
		}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	// ==========================================================================
	// AUTHENTICATE (FIRST LOGIN) ===============================================
	// ==========================================================================

  // locally --------------------------------
      // LOGIN ===============================
      // show the login form
      // process the login form

      // SIGNUP =================================
      // show the signup form
      // process the signup form

  // facebook -------------------------------
  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));

  // twitter --------------------------------
      // send to twitter to do the authentication
      // handle the callback after twitter has authenticated the user


  // google ---------------------------------
      // send to google to do the authentication
      // the callback after google has authenticated the user

	// ==========================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) ==========
	// ==========================================================================

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
      res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  	});
  app.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  	}));

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope : ['public_profile', 'email']
  	}));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

  // google ---------------------------------

  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
};
