const TourModel = require('../model/tourModel');

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

async function createTour(req, res) {
  const doc = req.body;

  try {
    await TourModel.create(doc);
    return res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err,
    });
  }
}

async function deleteTours(req, res) {
  const condition = req.body;
  try {
    await TourModel.deleteMany(condition);
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
    });
  }
}

async function deleteTour(req, res) {
  const id = req.params.id;
  try {
    await TourModel.findByIdAndDelete(id);
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
    });
  }
}

async function updateTour(req, res) {
  const { id } = req.params;
  try {
    const data = await TourModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

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

async function getTours(req, res) {
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

  try {
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
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err,
    });
  }
}

// getStats

async function getTourStats(req, res) {
  console.log('TOur stats work');
  try {
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
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err,
    });
  }
}
const yearArr = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
async function getMonthlyPlan(req, res) {
  console.log('GetMonyhlyPlan');
  const { year } = req.params;
  console.log(year);
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
}

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
};
