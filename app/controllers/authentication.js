const crypto = require('crypto');
const User = require('../models/user');
const passport = require('passport');
const helpers = require('./helpers');
const userController = require('./user');

const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:8080';

//= =======================================
// Local Login Route
//= =======================================
exports.login = function (req, res, next) {
  if (!req.user) {
      return res.status(422).send({ message: 'Login error: No account found.' });
    }
    // if (err) {
    //   console.log(err);
    //   throw err;
    //   return res.status(422).send({ message: err });
    // }
    if (req.user) {
      const userInfo = helpers.setUserInfo(req.user);
      res.status(200).json({
        token: helpers.generateToken(userInfo),
        user: req.user
      });
    }
};


//= =======================================
// Local Registration Route
//= =======================================
exports.register = function (req, res, next) {

  console.log(req.body);

  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ 'local.email': email }, (err, existingUser) => {
    if (err) {
      console.log('authentication.js > 68');
      console.log(err);
      return next(err);
    }

      // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address is already in use.' });
    }

      // If email is unique and password was provided, create account
    const user = new User({
      local: { email, password },
      profile: { firstName, lastName, email }
    });

    user.save((err, user) => {
      if (err) {
        console.log('authentication.js > 87');
        console.log(err);
        return next(err);
      }

      // Respond with JWT if user was created

      const userInfo = helpers.setUserInfo(user);

      res.status(201).json({
        token: `JWT ${helpers.generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};

//= =======================================
// Facebook Callbacks
//= =======================================

exports.fbCallback = (req, res) => {
    const userObj = req.user ? { ...req.user } :
      req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from facebook
      console.log('Facebook Auth Succeeded');

      // generate token and return user ID & token to client as URL parameters
      const userInfo = helpers.setUserInfo(userObj._doc);
      const token = helpers.generateToken(userInfo);
      return res.redirect(`${CLIENT_URL}/user/${userObj._doc._id}/${token}`);
    }
    return res.redirect('/login');
  };

exports.fbConnectCallback = (req, res, next) => {
    console.log('fbConnectCallback');
    const userObj = req.user ? { ...req.user } :
      req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from facebook
      console.log('Facebook Connect Succeeded');
      console.log(userObj);

      userController.updateProfile(req, res, next, userObj);

      // generate token and return user ID & token to client as URL parameters
      const userInfo = helpers.setUserInfo(userObj._doc);
      const token = helpers.generateToken(userInfo);
      console.log('made it to line 132 of authentication.js');
      return res.redirect(`${CLIENT_URL}/user/${userObj._doc._id}/${token}`);
    }
    return res.redirect('/login');
  };

//= =======================================
// Github Callback
//= =======================================

exports.ghCallback = (req, res) => {
  console.log('ghCallback');
  console.log(req.user);
    const userObj = req.user ? { ...req.user } :
      req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from github
      console.log('Github Auth Succeeded');

      // generate token and return user ID & token to client as URL parameters
      const userInfo = helpers.setUserInfo(userObj._doc);
      const token = helpers.generateToken(userInfo);
      return res.redirect(`${CLIENT_URL}/user/${userObj._doc._id}/${token}`);
    }
    // need client-side error handling here
    return res.redirect('/login');
  };

//= =======================================
// Google Callback
//= =======================================

exports.googleCallback = (req, res) => {
  console.log('googleCallback');
  console.log(req.user);
    const userObj = req.user ? { ...req.user } :
      req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from github
      console.log('Google Auth Succeeded');

      // generate token and return user ID & token to client as URL parameters
      const userInfo = helpers.setUserInfo(userObj._doc);
      const token = helpers.generateToken(userInfo);
      return res.redirect(`${CLIENT_URL}/user/${userObj._doc._id}/${token}`);
    }
    // need client-side error handling here
    return res.redirect('/login');
  };

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    const user = req.user;

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (getRole(foundUser.role) >= getRole(requiredRole)) {
        return next();
      }

      return res.status(401).json({ error: 'You are not authorized to view this content.' });
    });
  };
};

//= =======================================
// Forgot Password Route
//= =======================================

exports.forgotPassword = function (req, res, next) {
  const email = req.body.email;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
      return next(err);
    }

      // If user is found, generate and save resetToken

      // Generate a token with Crypto
    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) { return next(err); }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      existingUser.save((err) => {
          // If error in saving token, return it
        if (err) { return next(err); }

        const message = {
          subject: 'Reset Password',
          text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

          // Otherwise, send user email via Mailgun
        mailgun.sendEmail(existingUser.email, message);

        return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
      });
    });
  });
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

      // Otherwise, save new password and clear resetToken from database
    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save((err) => {
      if (err) { return next(err); }

        // If password change saved successfully, alert user via email
      const message = {
        subject: 'Password Changed',
        text: 'You are receiving this email because you changed your password. \n\n' +
          'If you did not request this change, please contact us immediately.'
      };

        // Otherwise, send user email confirmation of password change via Mailgun
      mailgun.sendEmail(resetUser.email, message);

      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    });
  });
};