const crypto = require('crypto');
const User = require('../models/user');
const passport = require('passport');
const helpers = require('../utils/index');
const userController = require('./user');
const mailUtils = require('../utils/mailUtils');
const mailTemplate = require('../utils/mailTemplate');

const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:8080';

//= =======================================
// Local Login Route
//= =======================================
exports.login = function (req, res, next) {
  console.log('login controller');
  if (!req.user) {
    console.log('authentication.js > 18');
    console.log(res);
      return res.status(422).send({ message: 'Login error: No account found.' });
    }
    const userInfo = helpers.setUserInfo(req.user);
    res.status(200).send({
      token: helpers.generateToken(userInfo),
      user: req.user
    });
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
    return res.status(422).send({ message: 'You must enter an email address.' });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ message: 'You must enter your full name.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ message: 'You must enter a password.' });
  }

  User.findOne({ 'profile.email': email })
    .then( (existingUser) => {
      console.log('authentication.js > 57');
      // console.log(existingUser.profile.email);
      // If email is not unique
      if (existingUser) {
        // check if local account already exists.
        console.log('authentication.js > 63');
        if (existingUser.local && existingUser.local.email === email) {
            console.log('existing user has matching email in local key');
            return res.status(422).send({ message: 'Oops! Looks like you already have an account with that email address. Please try logging in.' });
        } else {
          console.log('skipped matching email block');
          // if not, email matches an acct created with social login.
          // allow user to create new local acct & merge w social login details
          // update existing and return updated user
          const target = { 'profile.email': email }
          console.log(target);
          const updates = {
            local: { email, password },
            profile: {
              firstName,
              lastName,
              email,
              avatarUrl: existingUser.profile.avatarUrl
            }
          };
          console.log(updates);
          // return updated document rather than the original
          const options = { new: true };

          User.findOneAndUpdate(target, updates, options)
          .exec()
          .then( (user) => {
            console.log('authentication.js > 100');
            console.log(user.profile.email);
            console.log('found and updated user with no local acct');
            console.log(user);

            // Respond with JWT if user was updated
            // don't need to validate email bc it has already been validated
            // by passport (matched the email used with another social account)
            const userInfo = helpers.setUserInfo(user);
            console.log(userInfo);
            console.log('authentication.js > 104');
            const token = `JWT ${helpers.generateToken(userInfo)}`;
            console.log(token);
            res.status(201).json({
              token,
              user
            });
          }) // then
          .catch( (err) => {
            console.log('authentication.js > 100');
            console.log(err);
            return next(err);
          }); // catch
        }
      } else {
        // If email is unique and password was provided, create account
        console.log('creating new account');
        const key = mailUtils.makeSignupKey();

        // assign generic avatar URL, will be overwritten if user later links
        // a social media accout
        const avatarUrl = 'https://raw.githubusercontent.com/rifkegribenes/voting-app/master/public/rainbow_icon_120.png';
        const user = new User({
          local: { email, password },
          profile: { firstName, lastName, email, avatarUrl },
          signupKey: key
        });

        user.save((err, user) => {
          if (err) {
            console.log('authentication.js > 87');
            console.log(err);
            return next(err);
          }

          console.log(`saved new user with id ${user.id}`);
          // Send validation email
          const subject = "Voting App: Email Confirmation Required";
          console.log(user.id);
          const url = mailUtils.makeValidationUrl(user.id, key.key);
          const text = `Please click here to validate your email: ${url}`;
          mailUtils.sendMail(email, subject, text)
            .then(() => {
              console.log('email sent');
            })
            .catch((err) => {
              console.log(err);
            });

          // Respond with JWT if user was created

          const userInfo = helpers.setUserInfo(user);
          console.log('authentication.js > 135');
          const token = `JWT ${helpers.generateToken(userInfo)}`;
          res.status(201).json({
            token,
            user
          });
        });
      }
  }) // then (User.findOne)
    .catch( (err) => {
      console.log('catch block line 143');
      console.log(err);
      throw err;
    }); // catch (User.findOne)
} // register

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
    } else {
      return res.redirect('/login');
    }
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
// Validate Email Route
//= =======================================

// HANDLE EMAIL VALIDATION LINKS
// Toggles user's `validated` property to `true`
//   Example: GET >> /api/auth/validate
//   Secured: no
//   Expects:
//     1) request query params
//        * uid : String
//        * key : String
//   Returns: redirect to client-side validation landing page
//
exports.validate = function (req, res) {
  const user_id  = req.query.uid;
  const test_key = req.query.key;
  console.log(`testkey: ${test_key}`);
  const target = {
    _id : user_id
  };
  const updates = {
    validated: true
  };

  User.findOneAndUpdate(target, updates)
    .exec()
    .then( user => {
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user with that ID found.' });
    } else if (user.signupKey.key !== test_key) {
      console.log(`user signupKey: ${user.signupKey.key}`);
        return res
          .status(400)
          .json({ message: 'Registration key mismatch.' });
    } else {
        // build hash fragment for client-side routing
        const hash = '#/redirect=validate';
        console.log(`redirecting to: ${CLIENT_URL}/${hash}`);
        return res
          // redirect to client-side validation landing page
          .redirect(302, `${CLIENT_URL}/${hash}`);
    }
  })
  .catch( err => {
    console.log('Error!!!', err);
      return res
        .status(400)
        .json({ message: err});
  });
}

/* Dispatch new password reset email (called from sendReset())
 *
 * @ params   [object]   params
 * @ params   [string]    * key      [randomly generated key]
 * @ params   [string]    * to_email [user/recipient email address]
 * @ params   [string]    * recUsesrId [user/recipient _id]
*/
const sendPWResetEmail = (params) => {
    // console.log('pwreset', params);
    const url     = `${CLIENT_URL}/resetpassword/${params.key}`;
    const subject = 'Voting App - Password Reset Request';
    const html = mailTemplate.pwResetTemplate(url);
    const text = `Click here to reset your password: ${url}`;
    mailUtils.sendMail(params.to_email, subject, html, text)
      .then(() => {
        console.log('password reset email sent');
      })
      .catch((err) => {
        console.log(err);
      });
}

// SEND PW RESET EMAIL
// Finds user, generates key, calls sendPWResetEmail to send msg
//   Example: POST >> /api/sendresetemail
//   Secured: no
//   Expects:
//     1) request body params : {
//          email : String
//        }
//   Returns: success status & message on success
//
exports.sendReset = (req, res) => {
  console.log(`preparing to send email to ${req.body.email}`);

  // generate reset key
  const resetKey = mailUtils.makeSignupKey();

  // find user by email
  User.findOne({ 'profile.email': req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        console.log('no user found');
        return res
          .status(400)
          .json({ message: 'No user found with that email' });
      } else {
        console.log('found user');
        //store key on user
        user.passwordResetKey = resetKey;

        user.save((err, user) => {

          if (err) { throw err; }
          console.log('saving user');
          console.log(user);
          // build email parameter map
          const emailParams = {
            key         : user.passwordResetKey.key,
            to_email    : user.profile.email,
            recUserId   : user._id
          };

          // console.log(emailParams);

          // send password reset email
          try {
            sendPWResetEmail(emailParams);
            return res
              .status(200)
              .json( {message: 'Password Reset email sent!'});
          } catch (err) {
            console.log(err);
            return res
              .status(400)
              .json({ message: err});
          }
        }); // user.save
      }
    }) // User.findOne.then()
    .catch( err => {
      console.log('Error!!!', err);
      return res
        .status(400)
        .json({ message: err});
    });
}


// RESET PASSWORD
//   Example: POST >> /api/resetpassword
//   Secured: no
//   Expects:
//     1) request body params : {
//          password : String
//          key      : String
//        }
//   Returns: success status & message on success
//

//= =======================================
// Reset Password Route
//= =======================================

exports.resetPass = (req, res, next) => {
  console.log('resetPass');
  console.log(req.body.key);
  const target = {
    'passwordResetKey.key': req.body.key,
    'passwordResetKey.exp': { $gt: Date.now() }
    };
  User.findOne(target)
    .exec()
    .then(user => {
      // If query returned no results, token expired or was invalid. Return error.
      if (!user) {
        return res.status(422).json({ message: 'Your token has expired. Please attempt to reset your password again.' });
      }

      // Otherwise, save new password and clear passwordResetKey
      user.local.password = req.body.password;
      user.passwordResetKey = {};

      user.save((err) => {
        if (err) { return next(err); };

        // Send user email confirmation of password change via Mailgun
        const subject = "Voting App: Password Changed";
        const text = 'You are receiving this email because you changed your password. \n\n' +
        'If you did not request this change, please contact us immediately.';
        mailUtils.sendMail(user.profile.email, subject, text)
          .then(() => {
            console.log('password reset confirmation email sent');
          })
          .catch((err) => {
            console.log(err);
          });

        return res.status(200).json({ message: 'Password changed successfully. Please log in with your new password.' });
      });
    })
    .catch(err => {
      console.log('Error!!!', err);
      return res
        .status(400)
        .json({ message: err});
      });
  };