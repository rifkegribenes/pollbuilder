'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
require('dotenv').load();
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var configDB = require('./app/config/database.js');
const User = require('./app/models/user');
const session = require('express-session');
const passport = require('passport');
const user = require('./app/config/passport-serialize');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
mongoose.Promise = global.Promise;
require('./app/config/passport')(passport); // pass passport for configuration

// Basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(morgan('dev')); // Log requests to API using morgan


// Enable CORS from client side
app.use(cors());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(user.serialize);
passport.deserializeUser(user.deserialize);

// routes ======================================================================
const router = require('./router');
router(app);

// launch ======================================================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
