const express = require('express');
const toursRouter = express.Router();

const toursControllers = require('../controllers/toursControllers');

toursRouter
  .route('/')
  .get(toursControllers.getAllTours)
  .post(toursControllers.getChecked, toursControllers.createTours);
toursRouter
  .route('/:id')
  .get(toursControllers.getAllTourMidW, toursControllers.getTour);

module.exports = toursRouter;
