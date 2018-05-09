'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
const path = require('path');
require('dotenv').load();
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var https = require('https');
var configDB = require('./app/config/database.js');
const User = require('./app/models/user');
const session = require('express-session');
const passport = require('passport');
const user = require('./app/utils/passport-serialize');
const MongoStore = require('connect-mongo')(session);


// configuration ===============================================================
mongoose.connect(configDB.url, configDB.options); // connect to db
mongoose.Promise = global.Promise;
require('./app/config/passport')(passport); // pass passport for configuration

// Basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(morgan('dev')); // Log requests to API using morgan


// Enable CORS from client side
app.use(cors());

app.use(session({ 
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(user.serialize);
passport.deserializeUser(user.deserialize);

// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res) => {
  console.log('root route, serving client');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

// routes ======================================================================
const router = require('./router');
router(app);

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
