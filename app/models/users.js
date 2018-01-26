'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('User', User);
