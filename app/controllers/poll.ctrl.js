const Poll = require('../models/poll');
const path = require('path');
const fs = require('fs');

// Get all polls
exports.getAllPolls = (req, res, next) => {
  console.log('getAllPolls');
  Poll.find( (err, polls) => {

    if (err) { return handleError(res, err); }
    return res.status(200).json({polls});
  });
};

// Get all polls for a specific user
exports.getUserPolls = (req, res, next) => {
  console.log(req.params.userId);
  Poll.find( { ownerId: req.params.userId }, (err, polls) => {

    if (err) { return handleError(res, err); }
    console.log('poll.ctrl.js > 18');
    console.log(polls);
    return res.status(200).json({polls});
  });
};

// Get a single poll by id
exports.viewPollById = (req, res, next) => {
  Poll.findById( req.params.pollId,  (err, poll) => {
    if (err) { return handleError(res, err); }
    if (!poll) { return res.status(404).send({message: 'Error: Poll not found'}); }
    
    const filePath = path.join(__dirname, 'client/build/200.html');

    // read in the static html file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);  }

      // replace the variables with server generated strings
      data = data.replace(/\$OG_TITLE/g, 'Pollbuilder');
      data = data.replace(/\$OG_DESCRIPTION/g, poll.question);
      data = data.replace(/\__SERVER_DATA__/g, JSON.stringify(poll));
      let result = data.replace(/\$OG_IMAGE/g, 'https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/og-img_1200x628.png');
      res.status(200).send(result);
    });
    
    
    // return res.status(200).json({poll});
  });
};

// Create a new poll
exports.newPoll = (user, req, res, next) => {
  if (!user) {
    console.log('no user returned from reqireAuth (poll.ctrl.js > 43)');
    return res.status(422).json({ message: 'You must be logged in to create a new poll.' });
  } else {
    console.log('poll.ctrl.js > 46');
    console.log(user._id);
    const body = {
      question: req.body.question,
      options: [ ...req.body.options ],
      ownerId: user._id,
      ownerName: `${user.profile.firstName} ${user.profile.lastName}`,
      ownerAvatar: user.profile.avatarUrl
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
                return res.status(201).json({ user, poll });
              }
            });
          }
      }) // then (Poll.findOne)
      .catch( (err) => {
        console.log('poll.ctrl.js > catch block 71');
        console.log(err);
        return next(err);
      }); // catch (Poll.findOne)
    }
}; // newPoll

// Update an existing poll.
exports.updatePoll = (user, req, res, next) => {
  const pollId = req.body._id;

  const target = {
    _id: pollId
  };

  // kick off promise chain
  new Promise( (resolve, reject) => {
    // Must be poll owner or site admin to update
    if (req.body.ownerId.toString() === user._id.toString() || user.role === 'admin') {
      resolve(target);
    } else {
      reject({message: 'You do not have permission to update this poll.'});
    }

  })
  .then( () => {
    // map enumerable req body properties to updates object
    if (req.body._id) { delete req.body._id };
    const updates = { ...req.body };

    updates.ownerId = user._id;
    updates.ownerName = `${user.profile.firstName} ${user.profile.lastName}`;
    updates.ownerAvatar = user.profile.avatarUrl;

    // return updated document rather than the original
    const options = { new: true };
    Poll.findOneAndUpdate(target, updates, options)
      .exec()
        .then((poll) => {
          if (!poll) {
            return res
              .status(404)
              .json({message: 'Poll not found'});
          } else {
            return res
              .status(200)
              .json({
                message: 'Poll updated successfully',
                user,
                poll
            });
          }
        })
        .catch(err => {
          console.log('catch block poll.ctrl.js > 115');
          console.log(err);
          return handleError(res, err);
        });

    })
  .catch(err => {
    console.log('catch block poll.ctrl.js > 121');
    console.log(err);
    return handleError(res, err);
  });
};

// add voter to poll
exports.vote = (req, res, next) => {
  const { pollId, optionId } = req.params;
  const target = {
    _id: pollId
  };
  if (req.body._id) { delete req.body._id };
  const updates = { ...req.body };
  const options = { new: true };

  // get voter IP
  let voterIP = (req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];

  // only allow one vote per IP address
  if (updates.voters.indexOf(voterIP) !== -1) {
    console.log('already voted');
    return res
      .status(404)
      .json({message: 'You have already voted in this poll'});
  }

  // add voter IP to voters array
  updates.voters.push(voterIP);

  // map through options and increase votes on matching option
  const pollOptions = [ ...updates.options ];
  updates.options = pollOptions.map((option) => {
    if (option._id === optionId) {
      option.votes++;
      return option;
    } else {
      return option;
    }
  })

  Poll.findOneAndUpdate(target, updates, options)
    .exec()
    .then((poll) => {
      if (!poll) {
        return res
          .status(404)
          .json({message: 'Poll not found'});
      } else {
        return res
          .status(200)
          .json({
            message: 'Vote recorded successfully',
            poll
          });
      }
    })
    .catch(err => {
      console.log('catch block poll.ctrl.js > 178');
      console.log(err);
      return handleError(res, err);
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
exports.deletePoll = (user, req, res, next) => {
  Poll.findOne({ _id: req.params.pollId })
    .then((poll) => {
      if (!poll) {
        console.log('poll.ctrl.js > 195: Poll not found');
        return res.status(404).json({message: 'Poll not found.'});
      } else {
        // Only owners and admins can delete
        if (poll.ownerId.toString() === user._id.toString() ||
          user.role === 'admin') {
          poll.remove((err) => {
            if (err) {
              return handleError(res, err);
            } else {
              console.log('poll.ctrl.js > 203');
              return res.status(204).json({message: 'Poll was successfully deleted.'});
            }
          });
        } else {
          return res.status(403).json({message: 'You do not have permission to delete this item.'});
        }
      }
  })
  .catch((err) => {
      console.log('poll.ctrl.js > 190');
      console.log(err);
      return handleError(res, err);
    });
}

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}