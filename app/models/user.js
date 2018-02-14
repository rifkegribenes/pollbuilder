const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  local: {
    email: { type: String },
    password: { type: String }
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
    email: { type: String }
  },
  facebook: {
    token: { type: String },
    id: { type: String },
    email: { type: String }
  },
  github: {
    token: { type: String },
    id: { type: String },
    email: { type: String }
  },
  google: {
    token: { type: String },
    id: { type: String },
    email: { type: String }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
  {
    timestamps: true
  });

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('local.password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.local.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.local.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);