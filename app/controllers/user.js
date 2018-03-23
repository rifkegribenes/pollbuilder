const User = require('../models/user');
const helpers = require('../utils/index');

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  console.log('viewProfile');
  const userId = req.params.userId;
  console.log(`userid: ${userId}`);
  if (req.user._id.toString() !== userId) { return res.status(401).json({ message: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ message: 'No user could be found for this ID.' });
      return next(err);
    } else {
      return res.status(200).json({ user });
    }

  });
};

exports.updateProfile = (req, res, next, userObj) => {
  console.log('updateProfile');

  const target = {
    _id: req.params.userId
  };

  // kick off promise chain
  new Promise( (resolve, reject) => {

    // make sure the requesting user ID and target user ID match
    if (target._id === req.token._id.toString()) {
      resolve(target);
    } else {
      reject('Error: user ID mismatch.');
    }

  })
  .then( () => {
    // map enumerable req body properties to updates object
    const updates = { ...userObj };
    // return updated document rather than the original
    const options = { new: true };

    User.findOneAndUpdate(target, updates, options)
      .exec()
      .then( user => {
        if (!user) {
          return res
            .status(404)
            .json({message: 'User not found!'});
        } else {
          // add logic here to send vnew erification email if email is changed
          // and return this message to client
          return res
            .status(200)
            .json({
              message: 'User updated!',
              user
          });
        }
      });
  })
  .catch( err => {
    console.log('Error!!!', err);
    return res
      .status(400)
      .json({ message: err});
  });

}

// REFRESH USER TOKEN
//   Example: GET >> /api/refresh_token
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT
//   Returns: user profile and new JWT on success
//
exports.refreshToken = (req, res) => {
  console.log('refreshToken');
  const userId = req.token._id;

  User.findById(userId)
    .exec()
    .then( user => {

      // generate a token
      const token = helpers.generateToken(user);

      // return the user profile & JWT
      return res
        .status(200)
        .json({
            profile : user,
            token   : token
        });

      })
    .catch( err => {
      console.log('Error!!!', err);
        return res
          .status(400)
          .json({ message: err});
    });

}