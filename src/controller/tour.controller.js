const TourModel = require('../model/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
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

const createTour = catchAsync(async function (req, res, next) {
  const doc = req.body;
  await TourModel.create(doc);
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});
const deleteTours = catchAsync(async function (req, res, next) {
  const condition = req.body;
  await TourModel.deleteMany(condition);
  return res.status(200).json({
    status: 'success',
  });
});

const deleteTour = catchAsync(async function (req, res, next) {
  const id = req.params.id;

  const tour = await TourModel.findByIdAndDelete(id);
  if (!tour) {
    return next(new AppError('Not found tour with that ID', 404));
  }
  return res.status(200).json({
    status: 'success',
  });
});

const updateTour = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const data = await TourModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError('Not found tour with that ID', 404));
  }
  return res.status(200).json({
    status: 'success',
    data,
  });
});

function sortByValue(query) {
  let sortBy = query['sort'] || null;
  return (
    sortBy?.split(',').reduce((accum, val) => {
      if (val[0] === '-') {
        return {
          ...accum,
          [val.slice(1)]: -1,
        };
      }
      return {
        ...accum,
        [val]: 1,
      };
    }, {}) || {}
  );
}

function pagination(query) {
  let page = query['page'] * 1 || 1;
  let limit = query['limit'] * 1 || 3;
  let skip = limit * (page - 1);
  return {
    limit,
    skip,
  };
}

const getTours = catchAsync(async function (req, res, next) {
  let queryObj = JSON.stringify(req.query).replace(
    /gt|gte|lte|lt|eq|ne/gi,
    (val) => `$${val}`
  );
  query = JSON.parse(queryObj);

  // sort
  const sortByObj = sortByValue(query);
  // limit
  let fieldObj = query['fields'] ? query['fields'].split(',').join(' ') : '';
  // pagination
  const { limit, skip } = pagination(query);
  // delete fileds from querys
  ['sort', 'fields', 'limit', 'skip', 'page'].forEach(
    (field) => delete query[field]
  );

  const tours = await TourModel.find({ ...query })
    .sort({
      cretatedAt: 1,
      ...sortByObj,
    })
    .select(fieldObj)
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = catchAsync(async function (req, res) {
  const { id } = req.params;

  const tour = await TourModel.findById(id).populate('reviews');
  if (!tour) return next(new AppError('No tour found with that ID', 404));
  return res.status(200).json({
    status: 'success',
    tour,
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
