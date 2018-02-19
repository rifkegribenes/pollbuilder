'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.CLIENT_URL + 'api/auth/github/callback/'
	},
	'facebookAuth': {
		'clientID': process.env.FACEBOOK_KEY,
		'clientSecret': process.env.FACEBOOK_SECRET,
		'callbackURL': process.env.SERVER_URL + 'api/auth/facebook/callback'
	},
	'googleAuth': {
		'clientID': process.env.GOOGLE_KEY,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL': process.env.CLIENT_URL + 'api/auth/google/callback'
	}
};
