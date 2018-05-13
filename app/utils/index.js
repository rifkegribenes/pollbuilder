const jwt = require('jsonwebtoken');

exports.setUserInfo = (request) => {
  const getUserInfo = {
    _id: request._id
  };

  return getUserInfo;
};

// Generate JWT
exports.generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

exports.avatarFormula = (user) => {
      let avatarUrl;
      if (user.facebook.id) {
        avatarUrl = `http://graph.facebook.com/${user.facebook.id}/picture?height=400`
      } else {
        avatarUrl = user.profile.avatarUrl;
      }
      return avatarUrl;
    }