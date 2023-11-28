const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
  const review = await Review.create(req.body);
  console.log(review);
  res.json({
    result: review.length,
    data: review,
  });
};

exports.getReview = async (req, res) => {
  const reviews = await Review.find();

  res.json({
    data: reviews,
  });
};
