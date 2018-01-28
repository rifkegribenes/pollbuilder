'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
require('dotenv').load();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

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

app.use(bodyParser.json());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

// required for passport
app.use(session({
	secret: '46erdvryv5rtyvhgbjhtdctrytjgvf54e5f4357fyrdv',
	resave: true,
	saveUninitialized: true
}));

// session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
const apiRoutes     = require('./app/routes/apiroutes');
const authRoutes    = require('./app/routes/authroutes');
const staticRoutes  = require('./app/routes/index');

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// launch ======================================================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
