'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var User = new Schema({
	local: {
		id: String,
		email: String,
		password: String
	},
	github: {
		id: String,
		token: String,
		displayName: String,
		username: String,
    publicRepos: Number,
    avatarUrl: String
	},
	facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    avatarUrl: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
    avatarUrl: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    avatarUrl: String
   },
   nbrClicks: {
      clicks: Number
   }
});

// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
