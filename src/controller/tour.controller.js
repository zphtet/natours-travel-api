const TourModel = require('../model/tourModel');

const catchAsync = require('../utils/catchAsync');

const { protect } = require('../controller/auth.controller');

const {
  deleteOneById,
  createOne,
  updateOneById,
  getOneById,
  getAll,
} = require('./factory');
// Middleware Functions
function createMiddleware(req, res, next) {
  next();
}

function topFiveMiddleware(req, res, next) {
  req.query.sort = 'price,-ratingsAverage';
  req.query.limit = 5;
  next();
}

const convertImgArr = (req, res, next) => {
  const imageCover = req.files.imageCover[0].filename;
  const imgArr = req.files.images.map(({ filename }) => filename);
  req.body.images = imgArr;
  req.body.imageCover = imageCover;
  next();
};

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

const getDistance = catchAsync(async function (req, res, next) {
  const { lnglat } = req.params;
  const strArr = lnglat.split(',');
  const lat = strArr[1] * 1;
  const lng = strArr[0] * 1;
  const tours = await TourModel.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lat, lng] },
        // spherical: true,
        // query: { category: "Parks" },
        distanceField: 'calcDistance',
      },
    },
    {
      $project: {
        name: 1,
        calcDistance: 1,
      },
    },
  ]);
  return res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

const getDistanceWithinByMile = catchAsync(async function (req, res, next) {
  const { lnglat, mi } = req.params;
  const lnglatArr = lnglat.split(',');
  const lat = lnglatArr[1] * 1;
  const lng = lnglatArr[0] * 1;
  const tours = await TourModel.find(
    {
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lat, lng], (mi * 1) / 3963.2],
        },
      },
    },
    { name: 1, guides: 0 }
  ).lean();
  return res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
});

// from factory funs

const getTour = getOneById(TourModel, { path: 'reviews' });
const getTours = getAll(TourModel);
const createTour = createOne(TourModel);
const deleteTour = deleteOneById(TourModel);
const updateTour = updateOneById(TourModel);
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
  getDistance,
  getDistanceWithinByMile,
  convertImgArr,
};
