const reviewModel = require('../model/reviewModel');
const TourModel = require('../model/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOneById , createOne , updateOneById , getOneById, getAll} = require('./factory');
// Middleware Functions
function createMiddleware(req, res, next) {
  next();
}

function topFiveMiddleware(req, res, next) {
  req.query.sort = 'price,-ratingsAverage';
  req.query.limit = 5;
  next();
}


//Controller functions


const deleteTours = catchAsync(async function (req, res, next) {
  const condition = req.body;
  await TourModel.deleteMany(condition);
  return res.status(200).json({
    status: 'success',
  });
});


// getStats

const getTourStats = catchAsync(async function (req, res, next) {
  const stats = await TourModel.aggregate([
    {
      $match: { price: { $gt: 1000 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        ratingAverage: { $avg: '$ratingsAverage' },
        totalDuration: { $sum: '$duration' },
        averageSize: { $avg: '$maxGroupSize' },
        averagePrice: { $avg: '$price' },
      },
    },
    {
      $sort: { averagePrice: -1 },
    },
  ]);
  return res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async function (req, res, next) {
  const { year } = req.params;

  const monthlyPlan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        num: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    count: monthlyPlan.length || 1,
    data: {
      monthlyPlan,
    },
  });
});


// from factory funs

const createTour = createOne(TourModel)
const deleteTour = deleteOneById(TourModel);
const updateTour = updateOneById(TourModel)
const getTour = getOneById(TourModel , {path : 'reviews'})
const getTours = getAll(TourModel)
// findByIdAndDelete()
module.exports = {
  createTour,
  deleteTours,
  deleteTour,
  updateTour,
  createMiddleware,
  getTours,
  topFiveMiddleware,
  getTourStats,
  getMonthlyPlan,
  getTour,
};
