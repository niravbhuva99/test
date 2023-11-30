const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  console.log(req.params.id);
  if (!req.body.tours) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);

// exports.createReview = async (req, res) => {
//   if (!req.body.tours) req.body.tours = req.params.id;
//   if (!req.body.user) req.body.user = req.user.id;
//   const review = await Review.create(req.body);

//   res.json({
//     result: review.length,
//     data: review,
//   });
// };

// exports.getReviews = async (req, res, next) => {
//   let filter = {};
//   if (req.params.id) filter = { tours: { _id: req.params.id } };
//   const reviews = await Review.find(filter);

//   res.json({
//     data: reviews,
//   });
// };

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review, 'tour user');
