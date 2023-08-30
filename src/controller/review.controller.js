const reviewModel = require('../model/reviewModel');
const {
  deleteOneById,
  createOne,
  updateOneById,
  getOneById,
  getAll,
} = require('./factory');

// MIDDLEWARES

const setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// from factory funs

const createReview = createOne(reviewModel);
const deleteReview = deleteOneById(reviewModel);
const updateReview = updateOneById(reviewModel);
const getReview = getOneById(reviewModel);
const getAllReviews = getAll(reviewModel);

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  setTourUserId,
  updateReview,
  getReview,
};
