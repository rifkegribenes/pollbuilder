'use strict';

module.exports = {
  'url' : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds117148.mlab.com:17148/voting-app`,
  options: {
		keepAlive: 1,
		connectTimeoutMS: 30000,
		reconnectTries: 30,
		reconnectInterval: 5000
		}
};
