'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

/* =========================== INIT CONTROLLERS ============================ */

const staticCtrl = require('../controllers/static.ctrl');

module.exports = function (app, passport) {

	// route middleware to check if user is logged in
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	// =====================================
  // HOME PAGE (with login links) ========
  // =====================================
	app.route('/')
		.get(isLoggedIn, function (req, res) {
			// change this to render client build ????
			// router.get('/', staticCtrl.serveClient);
			res.sendFile(path + '/public/index.html');
		});

		// if(err){
        //     res.send("Error logs - " +err);
        // }else{
        //     res.json(user);
        // }

	// ==========================================================================
	// AUTHENTICATE (FIRST LOGIN) ===============================================
	// ==========================================================================

	// =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
			// need to pass flash message to client but not using templating engine, how to pass this to react frontend?
      // res.render('login.ejs', { message: req.flash('loginMessage') });
		});

	// process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // facebook -------------------------------
  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', {
  	scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/login'
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
		}));

  // twitter --------------------------------
  // send to twitter to do the authentication
  app.get('/auth/twitter', passport.authenticate('twitter', {
  	scope : 'email' }));

  // handle the callback after twitter has authenticated the user
  app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));


  // google ---------------------------------
  // send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', {
  	scope : 'email' }));

  // handle the callback after google has authenticated the user
  app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));


  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.route('/signup')
		.get(function (req, res) {
			res.sendFile(path + '/public/signup.html');
			// need to pass flash message to client but not using templating engine, how to pass this to react frontend?
      // res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  // =====================================
  // LOGOUT ==============================
  // =====================================
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	// =====================================
  // PROFILE SECTION =====================
  // =====================================
  // must be logged in to view
  // middleware verifies this (isLoggedIn function)
	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
			// need to get the user object out of session and pass to template
			// res.render('profile.ejs', {
   		//    user : req.user
   		//  });
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			// need to change this to handle multiple strategies ??
			res.json(req.user.github);
		});

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);


	// ==========================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) ==========
	// ==========================================================================

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
      res.sendFile(path + '/public/connect-local.html');
			// need to pass flash message to client but not using templating engine, how to pass this to react frontend?
      // res.render('connect-local.ejs', { message: req.flash('loginMessage') });
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
        failureRedirect : '/login'
    }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/login'
    }));

  // google ---------------------------------

  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/login'
    }));

  // github ---------------------------------

  // send to github to do the authentication
  app.get('/connect/github', passport.authorize('github', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/github/callback',
    passport.authorize('github', {
        successRedirect : '/profile',
        failureRedirect : '/login'
    }));
};
