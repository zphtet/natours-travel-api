const express = require('express');
const {
  createTour,
  deleteTour,
  updateTour,
  createMiddleware,
} = require('../controller/tour.controller');
const router = express.Router();

router.route('/tours').post(createMiddleware, createTour);

router.route('/tours/:id').delete(deleteTour).put(updateTour);

module.exports = router;
