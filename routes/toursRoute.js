const express = require('express');
const toursRouter = express.Router();

const toursControllers = require('../controllers/toursControllers');
const authController = require('../controllers/authController');

toursRouter
  .route('/top-5-tour')
  .get(toursControllers.alies, toursControllers.getAllTours);

toursRouter
  .route('/')
  .post(toursControllers.createTour)
  .get(authController.protect, toursControllers.getAllTours);

toursRouter.route('/s').get(toursControllers.getTourStats);
toursRouter.route('/monthly').get(toursControllers.getMonthlyPlan);
toursRouter
  .route('/:id')
  .get(toursControllers.getTour)
  .patch(toursControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteDocument
  );

module.exports = toursRouter;
