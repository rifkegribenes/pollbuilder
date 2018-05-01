const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const toLower = (str) => {
  return str.toLowerCase();
};

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  local: {
    email: { type: String, set: toLower },
    password: { type: String }
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
    email: { type: String, set: toLower }
  },
  facebook: {
    token: { type: String },
    id: { type: String },
    email: { type: String, set: toLower }
  },
  github: {
    token: { type: String },
    id: { type: String },
    email: { type: String, set: toLower }
  },
  google: {
    token: { type: String },
    id: { type: String },
    email: { type: String, set: toLower }
  },
  signupKey: {
    key: String,
    ts: String,
    exp: String
  },
  passwordResetKey: {
    key: String,
    ts: String,
    exp: String,
  },
  verified: { type: Boolean, default: false },
  role: { type: String }
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

// Same thing on update... hash password if password is modified or new
UserSchema.pre('update', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('local.password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.local.password, salt, null, (err, hash) => {
      if (err) return next(err);
      console.log('hashing password on pwd reset');
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