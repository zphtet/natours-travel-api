const catchAsync = require('../utils/catchAsync');

const deleteOneById = (Model) =>
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError('Not found document with that ID', 404));
    }
    return res.status(200).json({
      status: 'success',
    });
  });

const createOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const doc = req.body;
    const createdDoc = await Model.create(doc);
    return res.status(200).json({
      status: 'success',
      data: createdDoc,
    });
  });

const updateOneById = (Model) =>
  catchAsync(async function (req, res, next) {
    console.log('I am working');
    const { id } = req.params;
    const data = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      return next(new AppError('Not found docuument with that ID', 404));
    }
    return res.status(200).json({
      status: 'success',
      data,
    });
  });

const getOneById = (Model, populateObj) =>
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const populate = populateObj || '';

    /*
    // alternative APPROACH
    let query = Model.findById(id)
    if(populateObj){
      query = query.populate(populateObj)
    }
    const doc = await query
    */
    const doc = await Model.findById(id).populate(populate);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    return res.status(200).json({
      status: 'success',
      data: doc,
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
  let limit = query['limit'] * 1 || 100;
  let skip = limit * (page - 1);
  return {
    limit,
    skip,
  };
}

const getAll = (Model) =>
  catchAsync(async function (req, res, next) {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

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

    const data = await Model.find({ ...query, ...filter })
      .sort({
        cretatedAt: 1,
        ...sortByObj,
      })
      .select(fieldObj)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 'success',
      count: data.length,
      data: {
        data,
      },
    });
  });

module.exports = {
  deleteOneById,
  createOne,
  updateOneById,
  getOneById,
  getAll,
};
