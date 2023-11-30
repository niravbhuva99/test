const express = require('express');
const router = express.Router({ mergeParams: true });

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getReviews);
router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = router;
