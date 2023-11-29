const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
  if (!req.body.tours) req.body.tours = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  console.log(review);
  res.json({
    result: review.length,
    data: review,
  });
};

exports.getReview = async (req, res) => {
  let filter = {};
  if (req.params.id) filter = { tours: { _id: req.params.id } };
  const reviews = await Review.find(filter);

  res.json({
    data: reviews,
  });
};
