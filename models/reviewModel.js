const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
  },
  rating: {
    type: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tours: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tours',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
