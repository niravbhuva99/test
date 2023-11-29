const express = require('express');
const router = express.Router({ mergeParams: true });

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  )
  .get(reviewController.getReview);

module.exports = router;
