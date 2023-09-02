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
  getDistance,
  getDistanceWithinByMile,
  convertImgArr,
} = require('../controller/tour.controller');
const reviewRouter = require('./reviewRouter');

const { protect, checkPermission } = require('../controller/auth.controller');

const { uploadManyPhoto } = require('../controller/multer');

const router = express.Router();

router.route('/').post(createMiddleware, createTour).get(getTours);

router.route('/top-5-cheap-tours').get(topFiveMiddleware, getTours);
router.route('/getdistance/:lnglat').get(getDistance);
router.route('/distwithin/:lnglat/:mi').get(getDistanceWithinByMile);
router.route('/get-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.use(protect);
router
  .route('/:id')
  .get(getTour)
  .delete(protect, checkPermission('admin', 'lead-guide'), deleteTour)
  .patch(protect, uploadManyPhoto, convertImgArr, updateTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
