const Poll = require('../models/poll');

// Get all polls
exports.getAllPolls = (user, req, res, next) => {
  Poll.find( (err, polls) => {
    console.log('getAllPolls');
    if (err) { return handleError(res, err); }
    return res.status(200).json({user, polls});
  });
};

// Get a single poll by id
exports.viewPollById = (userObj, req, res, next) => {
  Poll.findById(req.params.pollId ,  (err, poll) => {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send({message: 'Not Found'}); }
    return res.json(poll);
  });
};

// Get a single poll by slug
exports.viewPollBySlug = (req, res, next) => {
  Poll.find( { slug: req.params.id }, (err, poll) => {
    if (err) { return handleError(res, err); }
    if (!poll || poll.length === 0) { return res.status(404).send({message: 'Not Found'}); }
    return res.json(poll[0]);
  });
};

// Create a new poll
exports.newPoll = (user, req, res, next) => {
  const body = {
    question: req.body.question,
    options: [ ...req.body.options ],
    ownerID: user._id,
    ownerName: `${user.profile.firstName} ${user.profile.lastName}`
  }
  // check if poll question is unique
  Poll.findOne({ question: req.body.question })
    .then( (existingPoll) => {
      // If poll is not unique
      if (existingPoll) {
        return res.status(422).send({ message: 'Oops! A poll with that question already exists. Please try again with a different question.' });
        } else {
          // if not, poll question is unique; create new poll
          Poll.create(body, (err, poll) => {
            if (err) {
              return handleError(res, err);
            } else {
              return res.status(201).json(poll);
            }
          });
        }
    }) // then (Poll.findOne)
    .catch( (err) => {
      console.log('poll.ctrl.js > newPoll > catch 131');
      console.log(err);
      return next(err);
    }); // catch (Poll.findOne)
}; // newPoll

// Update an existing poll.
exports.updatePoll = (req, res, next) => {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, (err, poll) => {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send({message: 'Not Found'}); }
    const updated = {...poll, ...req.body};

    // Must be poll owner or site admin to update
    if(poll.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
      updated.save( (err) => {
        if (err) { return handleError(res, err); }
        return res.status(200).json(poll);
      });
    } else {
      return res.status(403).send('You do not have permission to update this item');
    }
  });
};

// add voter to poll
exports.vote = (req, res, next) => {
  // if(req.body._id) { delete req.body._id; }  ?????
  Poll.findById(req.params.id, (err, poll) => {  // change to findeOneAndUpdate
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    const updated = {...poll, ...req.body};

    // Add voter IP
    let voterIP = req.headers["x-forwarded-for"];
    if (voterIP){
      const list = voterIP.split(",");
      voterIP = list[list.length-1];
    } else {
      voterIP = req.connection.remoteAddress;
    }
    // need to attach vote to option, so need to know optionID here
    updated.voter.push({
      voterID: Schema.Types.ObjectId,
      option: String,
      voterIP: String
    });

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// reset votes on a poll
exports.resetVotes = (req, res, next) => {
  // if(req.body._id) { delete req.body._id; } ????
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    // Only owners and admins may clear votes
    if(poll.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
      var updated = _.extend(poll, req.body);

      updated.voters = [];
      updated.votes = Array.apply(null, Array(updated.votes.length)).map(Number.prototype.valueOf,0);
      updated.totalVotes = 0;
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(poll);
      });
    } else {
      return res.status(403).send('You do not have permission to clear votes');
    }
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    // Only owners and admins may delete
    if(poll.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
      poll.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.status(204).send('No Content');
      });
    } else {
      return res.status(403).send('You do not have permission to delete this item');
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}