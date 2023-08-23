const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  setTourUserId,
  updateReview,
  getReview
} = require('../controller/review.controller');

const { protect, checkPermission } = require('../controller/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, checkPermission('user'), setTourUserId, createReview);

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);

module.exports = router;
