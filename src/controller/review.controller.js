const catchAsync = require('../utils/catchAsync');
const reviewModel = require('../model/reviewModel');

// get all reviews
const getAllReviews = catchAsync(async function (req, res) {
  const allReviews = await reviewModel.find({});
  return res.status(200).json({
    status: 'success',
    count: allReviews.length,
    data: {
      reviews: allReviews,
    },
  });
});

const createReview = catchAsync(async function (req, res) {
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
