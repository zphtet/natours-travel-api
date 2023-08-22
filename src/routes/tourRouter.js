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
  getTour,
} = require('../controller/tour.controller');

const { protect, checkPermission } = require('../controller/auth.controller');

const router = express.Router();

router.route('/tours').post(createMiddleware, createTour).get(getTours);
router.route('/tours/top-5-cheap-tours').get(topFiveMiddleware, getTours);
router
  .route('/tours/:id')
  .get(getTour)
  .delete(protect, checkPermission('admin', 'lead-guide'), deleteTour)
  .put(updateTour);
router.route('/tours/get-stats').get(getTourStats);
router.route('/tours/monthly-plan/:year').get(getMonthlyPlan);

module.exports = router;
