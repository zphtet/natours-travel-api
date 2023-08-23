const catchAsync = require('../utils/catchAsync');
const reviewModel = require('../model/reviewModel');

// get all reviews
const getAllReviews = catchAsync(async function (req, res) {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;
  const allReviews = await reviewModel.find(filter);
  return res.status(200).json({
    status: 'success',
    count: allReviews.length,
    data: {
      reviews: allReviews,
    },
  });
});

const createReview = catchAsync(async function (req, res) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const obj = req.body;
  const createdReview = await reviewModel.create(obj);
  return res.status(200).json({
    status: 'success',
    review: createdReview,
  });
});

module.exports = {
  getAllReviews,
  createReview,
};
