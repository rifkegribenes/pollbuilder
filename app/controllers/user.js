const User = require('../models/user');
const helpers = require('./helpers');

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  const userId = req.params.userId;

// add client-side error handling here
  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    // const userToReturn = helpers.setUserInfo(user);

    return res.status(200).json({ user });
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