'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
require('dotenv').load();
var mongoose = require('mongoose');
var cors = require('cors');
var corsMiddleware = require('./app/config/cors');
var passport = require('passport');
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

var methodOverride = require('method-override')
app.use(methodOverride());
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

// cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// routes ======================================================================
// const apiRoutes = require('./app/routes/apiroutes');
// const authRoutes    = require('./app/routes/authroutes');
// const staticRoutes  = require('./app/routes/index');

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback/', passport.authenticate('github', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}), function(req, res) {
			// successful authentication, redirect home.
			console.log('success');
			res.redirect('/');
		});

// =====================================
// REGISTER ============================
// =====================================

// Register new users
// Returns fail status + message -or- success status + JWT
app.post('/register', (req, res) => {
	console.log('app/routes/index.js > 31');
	console.log(req.body);

  // fail if missing required inputs
  if (!req.body.password || !req.body.email) {
    return res
      .status(400)
      .json({ 'message': 'Please complete all required fields.' });
  }

 const target = { email: req.body.email };

  User.findOne(target)
    .exec()
    .then( user => {
      // finding a user is bad - reject --> catch block
      if (user && user.email === req.body.email) {
        return Promise.reject('Email already registered.');
      } else {
        return undefined;
      }
    })
    .then( () => {
      // no user found, let's build a new one
      const newUser = new User();
      newUser.email = req.body.email;
      newUser.hashPassword(req.body.password);
      return newUser;
    })
    .then( newUser => {
        // save new user to database
        newUser.save( (err, savedUser ) => {
          if (err) { throw err; }

          // build filtered user profile for later response
          const profile = {
            email     : savedUser.email,
            _id       : savedUser._id
          };

          // generate auth token
          const token = savedUser.generateJWT();

          // respond with profile & JWT
          console.log('app/routes/index.js > 75');
          console.log(profile);
          console.log(token);
          return res
            .status(200)
            .json({
              'profile' : profile,
              'token'   : token
            });
        });
    })
    .catch( err => {
        console.log('Error!!!', err);
        return res
          .status(400)
          .json({ message: err});
    });
});

// launch ======================================================================
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
