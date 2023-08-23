const catchAsync = require('../utils/catchAsync');
const reviewModel = require('../model/reviewModel');
const { deleteOneById , createOne, updateOneById, getOneById, getAll} = require('./factory');

// MIDDLEWARES 

const setTourUserId = (req,res,next)=>{
       if (!req.body.tour) req.body.tour = req.params.tourId;
       if (!req.body.user) req.body.user = req.user._id;
  next()
}

// get all reviews
// const getAllReviews = catchAsync(async function (req, res) {
//   const filter = {};
//   if (req.params.tourId) filter.tour = req.params.tourId;
//   const allReviews = await reviewModel.find(filter);
//   return res.status(200).json({
//     status: 'success',
//     count: allReviews.length,
//     data: {
//       reviews: allReviews,
//     },
//   });
// });


// from factory funs

const createReview = createOne(reviewModel)
const deleteReview = deleteOneById(reviewModel);
const updateReview = updateOneById(reviewModel)
const getReview = getOneById(reviewModel)
const getAllReviews = getAll(reviewModel)


module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  setTourUserId,
  updateReview,
  getReview
};
