const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('../controller/review.controller');

const { protect, checkPermission } = require('../controller/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, checkPermission('user'), createReview);

module.exports = router;
