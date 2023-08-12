const express = require('express');
const {
  createTour,
  deleteTour,
  updateTour,
  createMiddleware,
  getTours,
  topFiveMiddleware,
  getTourStats,
  getMonthlyPlan,
} = require('../controller/tour.controller');
const router = express.Router();

router.route('/tours').post(createMiddleware, createTour).get(getTours);
router.route('/tours/top-5-cheap-tours').get(topFiveMiddleware, getTours);
router.route('/tours/:id').delete(deleteTour).put(updateTour);
router.route('/tours/get-stats').get(getTourStats);
router.route('/tours/monthly-plan/:year').get(getMonthlyPlan);

module.exports = router;
