const express = require('express');
const toursRouter = express.Router();

const toursControllers = require('../controllers/toursControllers');

toursRouter
  .route('/')
  .post(toursControllers.createTour)
  .get(toursControllers.getAllTours);

toursRouter
  .route('/:id')
  .get(toursControllers.getTour)
  .post(toursControllers.updateTour)
  .delete(toursControllers.deleteDocument);
module.exports = toursRouter;
