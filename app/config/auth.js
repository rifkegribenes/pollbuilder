'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': 'https://pollbuilder.glitch.me/api/auth/github/callback'
	},
	'facebookAuth': {
		'clientID': process.env.FACEBOOK_KEY,
		'clientSecret': process.env.FACEBOOK_SECRET,
		'callbackURL': 'https://pollbuilder.glitch.me/api/auth/facebook/callback'
	},
	'googleAuth': {
		'clientID': process.env.GOOGLE_KEY,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL': 'https://pollbuilder.glitch.me/api/auth/google/callback'
	}
};
