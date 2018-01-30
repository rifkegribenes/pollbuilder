'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
require('dotenv').load();
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var corsMiddleware = require('./app/config/cors');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./app/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
mongoose.Promise = global.Promise;

require('./app/config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
       extended: true
}));
app.use(cors());
app.use(corsMiddleware);
app.use(bodyParser.json());

// required for passport
app.use(session({
	secret: '46erdvryv5rtyvhgbjhtdctrytjgvf54e5f4357fyrdv',
	resave: true,
	saveUninitialized: true
}));

// session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
// const apiRoutes = require('./app/routes/apiroutes');
// const authRoutes    = require('./app/routes/authroutes');
// const staticRoutes  = require('./app/routes/index');

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


// const router = require('express').Router();
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}), function(req, res) {
			// successful authentication, redirect home.
			console.log('success');
			res.redirect('/');
		});

// launch ======================================================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
