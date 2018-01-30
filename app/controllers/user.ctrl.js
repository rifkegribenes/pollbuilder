/*
   functions to handle user profile retrieval, creation, update, and deletion
*/

/* ================================= SETUP ================================= */
const passport  = require('passport');
const User      = require('../models/users');
const projection = { signupKey: 0, passwordResetKey: 0, hash: 0, salt: 0 };

// (function () {

//    var profileId = document.querySelector('#profile-id') || null;
//    var profileUsername = document.querySelector('#profile-username') || null;
//    var profileRepos = document.querySelector('#profile-repos') || null;
//    var displayName = document.querySelector('#display-name');
//    var apiUrl = appUrl + '/api/:id';

//    function updateHtmlElement (data, element, userProperty) {
//       element.innerHTML = data[userProperty];
//    }

//    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
//       var userObject = JSON.parse(data);

//       if (userObject.displayName !== null) {
//          updateHtmlElement(userObject, displayName, 'displayName');
//       } else {
//          updateHtmlElement(userObject, displayName, 'username');
//       }

//       if (profileId !== null) {
//          updateHtmlElement(userObject, profileId, 'id');
//       }

//       if (profileUsername !== null) {
//          updateHtmlElement(userObject, profileUsername, 'username');
//       }

//       if (profileRepos !== null) {
//          updateHtmlElement(userObject, profileRepos, 'publicRepos');
//       }

//    }));
// })();

// NEW_USER REGISTRATION
// Dispatches new user validation email
//   Example: POST >> /api/register
//   Secured: no
//   Expects:
//     1) request body properties : {
//          username : String
//          password : String
//          email    : String
//        }
//   Returns: user profile object & JWT on success
//
function register(req, res) {

  // fail if missing required inputs
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res
      .status(400)
      .json({ 'message': 'Please complete all required fields.' });
  }

 const target = {
    $or: [{ username: req.body.username }, { email: req.body.email }]
  };

  User.findOne(target)
    .exec()
    .then( user => {

      // finding a user is bad - reject --> catch block
      if (user && user.username === req.body.username) {
        return Promise.reject('Username already taken.');
      } else if (user && user.email === req.body.email) {
        return Promise.reject('Email already registered.');
      } else {
        return undefined;
      }

    })
    .then( () => {

      // no user found, let's build a new one
      const newUser = new User();

      newUser.username   = req.body.username;
      newUser.email      = req.body.email;
      newUser.hashPassword(req.body.password);

      return newUser;
    })
    .then( newUser => {

      // save new user to database
      newUser.save( (err, savedUser ) => {
        if (err) { throw err; }

        // build filtered user profile for later response
        const profile = {
          username  : savedUser.username,
          email     : savedUser.email,
          _id       : savedUser._id
        };

        // generate auth token
        const token = savedUser.generateJWT();

        // respond with profile & JWT
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

}


//  GITHUB AUTH
//   Example: GET >> /auth/github
//   Secured: no
//   Expects:
//     1) request body params : {
//          email : String
//          password : String
//        }
//   Returns: success status, user profile & JWT on success
//
function authGithub(req, res, next) {

  passport.authenticate('github', (err, user, info) => {

    if (err) { return next(err); }

    // if auth failed, there will be no user - fail
    if (!user) {
      return res
        .status(401)
        .json(info);

    } else {

      // exclude sensitive info from field selection
      const proj  = { hash : 0, salt : 0, signupKey : 0 };

      // find the authenticated user
      User.findById(user._id, proj)
        .exec()
        .then( (profile) => {

          // generate a token
          const token = profile.generateJWT();

          // return the user profile & JWT
          return res
            .status(200)
            .json({
              'profile' : profile,
              'token'   : token
            });

        })
        .catch( err => {
          console.log('Error!!!', err);
            return res
              .status(400)
              .json({ message: err});
        });

      }

  })(req, res, next);

}

// LOGIN
//   Example: POST >> /api/login
//   Secured: no
//   Expects:
//     1) request body params : {
//          email : String
//          password : String
//        }
//   Returns: success status, user profile & JWT on success
//
function login(req, res, next) {

  // fail if missing required inputs
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ 'message': 'Please complete all required fields.'});
  }

  passport.authenticate('local', (err, user, info) => {

    if (err) { return next(err); }

    // if auth failed, there will be no user - fail
    if (!user) {
      return res
        .status(401)
        .json(info);

    } else {

      // exclude sensitive info from field selection
      const proj  = { hash : 0, salt : 0, signupKey : 0 };

      // find the authenticated user
      User.findById(user._id, proj)
        .exec()
        .then( (profile) => {

          // generate a token
          const token = profile.generateJWT();

          // return the user profile & JWT
          return res
            .status(200)
            .json({
              'profile' : profile,
              'token'   : token
            });

        })
        .catch( err => {
          console.log('Error!!!', err);
            return res
              .status(400)
              .json({ message: err});
        });

      }

  })(req, res, next);

}


// GET ONE PROFILE
//   Example: GET >> /api/profile/597dccac7017890bd8d13cc7
//   Secured: yes, valid JWT required.
//   Expects:
//     1) '_id' from request params
//   Returns: user profile object on success
//
function getOneProfile(req, res) {

   const target = req.params.id;

   User.findOne({_id: target}, projection, (err, profile) => {

    if (!profile) {
      return res
        .status(404)
        .json({ message : 'User profile not found!'});
     }

    return res
      .status(200)
      .json(profile);

   });

}

/* ============================== EXPORT API =============================== */

module.exports = {
   register,
   login,
   authGithub,
   getOneProfile
};
