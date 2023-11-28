const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
  },
  rating: {
    type: String,
  },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  });
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
