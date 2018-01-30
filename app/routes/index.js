'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

/* =========================== INIT CONTROLLERS ============================ */

const staticCtrl = require('../controllers/static.ctrl');

module.exports = function (app, passport) {
	console.log('routes');

	// route middleware to check if user is logged in
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	// ==========================================================================
	// AUTHENTICATE (FIRST LOGIN) ===============================================
	// ==========================================================================

	// =====================================
  // LOGIN ===============================
  // =====================================

	// process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // github ---------------------------------
  // send to github to do the authentication
  app.route('/auth/github')
		.get(passport.authenticate('github'));

	// handle the callback after github has authenticated the user
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}), function(req, res) {
			// successful authentication, redirect home.
			console.log('success');
			res.redirect('/');
		});

};
