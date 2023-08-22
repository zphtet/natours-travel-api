const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('../controller/review.controller');

const router = express.Router();

router.route('/reviews').get(getAllReviews).post(createReview);

module.exports = router;
