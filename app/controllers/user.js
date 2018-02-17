const User = require('../models/user');


const setUserInfo = (request) => {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.profile.email,
    avatarUrl: request.profile.avatarUrl
  };

  return getUserInfo;
};

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = function (req, res, next) {
  console.log('viewProfile controllers/user.js > 20');
  const userId = req.params.userId;

// add client-side error handling here
  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};