const user = {
  serialize: (user, done) => {
  	log('serialize: ' + user._id)
    done(null, user.id)
  },
  deserialize: (id, done) => {
  	log('deserialize: ' + id)
    User.findOne({_id: id}, function(err, user) {
    	done(err, user);
  	});
	}
}

module.exports = user;