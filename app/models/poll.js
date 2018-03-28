const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

const Schema = mongoose.Schema;
const toLower = (str) => {
  return str.toLowerCase();
};

const AnswerSchema = new Schema({
  text: {
    type: String,
    unique: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

AnswerSchema.method('vote', function voting(vote, cb) {
  this.votes += 1;
  this.parent().save(cb);
});

var PollSchema = new Schema({
  question: {
    type: String,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  answers: [AnswerSchema],
  created: Date,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  active: Boolean,
});

// Sanitize HTML from inputs and generate slug on save
PollSchema.pre('save', function(next) {
  const sanitize = {
    allowedTags: [],
    allowedAttributes: []
  };

  this.question = sanitizeHtml(this.question, sanitize);
  this.answers = this.answers.map((answer) => {
      answer.text = sanitizeHtml(answer.text, sanitize);
      return answer;
    });
  this.slug = slugify(this.question, {
    replacement: '-',
    remove: null,
    lower: true
  });
  next();
});

module.exports = mongoose.model('Poll', PollSchema);