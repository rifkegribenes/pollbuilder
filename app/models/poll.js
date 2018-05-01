const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

const Schema = mongoose.Schema;
const toLower = (str) => {
  return str.toLowerCase();
};

const OptionSchema = new Schema({
  text: String,
  votes: {type: Number, default: 0},
  addedBy: String
});

const PollSchema = new Schema({
  question: {type: String, required: true, unique: true},
  slug: {type: String },
  options: [OptionSchema],
  voters: [],
  ownerId: {type: Schema.Types.ObjectId, required: false},
  ownerName: {type: String, required: false},
  ownerAvatar: {type: String, required: false}
},{
  timestamps: true
});

// Sanitize HTML from inputs and generate slug on save
PollSchema.pre('save', function(next) {
  const sanitize = {
    allowedTags: [],
    allowedAttributes: []
  };

  this.question = sanitizeHtml(this.question, sanitize);
  this.options = this.options.map((option) => {
      option.text = sanitizeHtml(option.text, sanitize);
      return option;
    });
  this.slug = slugify(this.question, {
    replacement: '-',
    remove: /[$*_+~.()'"!\-:;^%={}<>?|,@]/g,
    lower: true
  });
  next();
});

// Also do this on update i guess? no way to combine these functions?
PollSchema.pre('update', function(next) {
  const sanitize = {
    allowedTags: [],
    allowedAttributes: []
  };

  this.question = sanitizeHtml(this.question, sanitize);
  this.options = this.options.map((option) => {
      option.text = sanitizeHtml(option.text, sanitize);
      return option;
    });
  this.slug = slugify(this.question, {
    replacement: '-',
    remove: /[$*_+~.()'"!\-:;^%={}<>?|,@]/g,
    lower: true
  });
  next();
});

module.exports = mongoose.model('Poll', PollSchema);