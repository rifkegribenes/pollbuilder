const crypto = require('crypto');
const User = require('../models/user');
const passport = require('passport');
const helpers = require('../utils/index');
const userController = require('./user.ctrl');
const mailUtils = require('../utils/mailUtils');
const mailTemplate = require('../utils/mailTemplate');

const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3001';

//= =======================================
// Local Login Route
//= =======================================
exports.login = function (req, res, next) {
  console.log('auth.ctrl.js > 17: login');
  if (!req.user) {
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
      // If email is not unique
      if (existingUser) {
        // check if local account already exists.
        if (existingUser.local && existingUser.local.email === email) {
            return res.status(422).send({ message: 'Oops! Looks like you already have an account with that email address. Please try logging in.' });
        } else {
          // if not, email matches an acct created with social login.
          // allow user to create new local acct & merge w social login details
          // update existing and return updated user
          const target = { 'profile.email': email }
          const updates = {
            local: { email, password },
            profile: {
              firstName,
              lastName,
              email,
              avatarUrl: existingUser.profile.avatarUrl
            }
          };

          // return updated document rather than the original
          const options = { new: true };

          User.findOneAndUpdate(target, updates, options)
          .exec()
          .then( (user) => {
            // Respond with JWT if user was updated
            // don't need to verify email bc it has already been verified
            // by passport (matched the email used with another social account)
            const userInfo = helpers.setUserInfo(user);
            const token = `Bearer ${helpers.generateToken(userInfo)}`;
            res.status(201).json({
              token,
              user
            });
          }) // then
          .catch( (err) => {
            console.log('authentication.js > register > catch block 95');
            console.log(err);
            return next(err);
          }); // catch
        }
      } else {
        // If email is unique and password was provided, create account
        const key = mailUtils.makeSignupKey();

        // assign generic avatar URL, will be overwritten if user later links
        // a social media accout
        const avatarUrl = 'https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder_icon.png';
        const user = new User({
          local: { email, password },
          profile: { firstName, lastName, email, avatarUrl },
          signupKey: key
        });

        user.save((err, user) => {
          if (err) {
            console.log(err);
            return next(err);
          }

          // Send verification email
          const subject = "pollbuilder | Email Verification Required";
          const url = mailUtils.makeVerificationUrl(key.key);
          const html = mailTemplate.verificationTemplate(url);
          const text = `Please click here to verify your email: ${url}`;
          mailUtils.sendMail(email, subject, html, text)
            .then(() => {
              console.log('email sent (authentication.js > 124)');
            })
            .catch((err) => {
              console.log(err);
              return next(err);
            });

          // Respond with JWT if user was created
          const userInfo = helpers.setUserInfo(user);
          const token = helpers.generateToken(userInfo);
          res.status(201).json({
            token,
            user
          });
        });
      }
  }) // then (User.findOne)
    .catch( (err) => {
      console.log('authentication.js > register > catch 146');
      console.log(err);
      return next(err);
    }); // catch (User.findOne)
} // register

//= =======================================
// Social Auth Callback
//= =======================================

exports.socialAuthCallback = (req, res) => {
  console.log('social auth callback');
  if (req.user && req.user.err) {
    res.status(401).json({
        success: false,
        message: `social auth failed: ${req.user.err}`,
        error: req.user.err
    })
  } else {
    const userObj = req.user ? { ...req.user } :
      req.session && req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from provider
      console.log('successful social auth');
      // generate token
      // return user ID & social auth redirect flag as URL params
      const user = userObj._doc;
      const userInfo = helpers.setUserInfo(user);
      const token = helpers.generateToken(userInfo);
      return res.redirect(`${CLIENT_URL}/#/redirect=profile/${userObj._doc._id}/${token}`);

    } else {
      return res.redirect('/login');
    }
  }
};


//= =======================================
// Verify Email Route
//= =======================================

/* HANDLE EMAIL VERIFICATION LINKS
// Toggles user's `verified` property to `true`
//   Example: GET >> /api/auth/verify
//   Secured: no
//   Expects:
// @ params   [object]   params
// @ params   [string]    * key      [randomly generated key]
//   Returns: updated user profile & JWT or error message
*/

exports.verifyEmail = (req, res) => {
  const key = req.body.key;
  const target = {
    'signupKey.key': key,
    'signupKey.exp': { $gt: Date.now() }
    };
  const updates = {
    verified: true
  };
  const options = { new: true };

  User.findOneAndUpdate(target, updates, options)
    .exec()
    .then( user => {
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Sorry, your token has expired, please try again.' });
    } else {
      // Respond with updated JWT if user was verified
      const userInfo = helpers.setUserInfo(user);
      const token = helpers.generateToken(userInfo);
      res.status(201).json({
        token,
        user
      });
    }
    }) // then
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
    const url     = `${CLIENT_URL}/resetpassword/${params.key}`;
    const subject = 'pollbuilder | Password Reset Request';
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
exports.sendReset = (req, res, next) => {

  // generate reset key
  const resetKey = mailUtils.makeSignupKey();

  // find user by email
  User.findOne({ 'local.email': req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .json({ message: 'No user found with that email.\nIf you have an account, did you create it by logging in with Facebook, Google, or Github? If so, you don\'t need a password, just log in using one of those services.' });
      } else {
        //store key on user
        user.passwordResetKey = resetKey;

        user.save((err, user) => {

          if (err) {
            console.log(err);
            return next(err);
          }
          // build email parameter map
          const emailParams = {
            key         : user.passwordResetKey.key,
            to_email    : user.profile.email,
            recUserId   : user._id
          };

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

// SEND VERIFICATION EMAIL
// Finds user, generates key, sends verification link in email msg
//   Example: POST >> /api/sendverifyemail
//   Secured: no
//   Expects:
//     1) request body params : {
//          email : String
//        }
//   Returns: success status & message on success
//
exports.sendVerify = (req, res, next) => {

  const email = req.body.email;
  const key = mailUtils.makeSignupKey();

  const target = { 'profile.email': email }
  const updates = {
    signupKey: key
  };
  const options = { new: true };

  User.findOneAndUpdate(target, updates, options)
  .exec()
  .then( (user) => {
    if (!user) {
      return res
        .status(400)
        .json({
          message: 'Sorry, no user account found with that email, please log in and then try again to resend the verification email.'
        });
      } else {
          // Send verification email
          const subject = "pollbuilder | Email Verification Required";
          const url = mailUtils.makeVerificationUrl(key.key);
          const html = mailTemplate.verificationTemplate(url);
          const text = `Please click here to verify your email: ${url}`;
          mailUtils.sendMail(email, subject, html, text)
            .then(() => {
              // console.log('email sent (authentication.js > 396)');
            })
            .catch((err) => {
              console.log(err);
              return next(err);
            });

          // Respond with success message if email sent sucessfully
          res.status(201).json({
            message: `Verification email sent to ${email}`
          });
        }
      })
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
  const target = {
    'passwordResetKey.key': req.body.key,
    'passwordResetKey.exp': { $gt: Date.now() }
    };
  User.findOne(target)
    .exec()
    .then(user => {
      // If query returned no results, token expired or was invalid. Return error.
      if (!user) {
        return res.status(422).json({ message: 'Your token has expired.\nPlease request a new password reset link.' });
      }

      // Otherwise, save new password and clear passwordResetKey
      user.local.password = req.body.password;
      user.passwordResetKey = {};

      user.save((err) => {
        if (err) { return next(err); };

        // Send user email confirmation of password change via Mailgun
        const subject = "pollbuilder | Password Changed";
        const text = 'You are receiving this email because you changed your password. \n\n' +
        'If you did not request this change, please contact us immediately.';
        const html = mailTemplate.pwResetConfirmation();
        mailUtils.sendMail(user.profile.email, subject, html, text)
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