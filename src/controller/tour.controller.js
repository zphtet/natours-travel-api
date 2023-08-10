const TourModel = require('../model/tourModel');

function createMiddleware(req, res, next) {
  // if (!req.body.title) {
  //   return res.send({
  //     status: 'fail',
  //     message: 'title is required',
  //   });
  // }
  // if (req.body.title.length < 5) {
  //   return res.send({
  //     status: 'fail',
  //     message: 'title must be greter than 5 ',
  //   });
  // }

  next();
}
async function createTour(req, res) {
  const doc = req.body;
  const count = 1;
  try {
    await TourModel.create(doc);
    return res.send({
      status: 'success',
      count,
      data: doc,
    });
  } catch (err) {
    return res.send({
      status: 'error',
      message: err,
    });
  }
}

async function deleteTours(req, res) {
  const condition = req.body;
  try {
    await TourModel.deleteMany(condition);
    return res.send({
      status: 'success',
    });
  } catch (err) {
    return res.send({
      status: 'fail',
    });
  }
}

async function deleteTour(req, res) {
  const id = req.params.id;
  try {
    await TourModel.findByIdAndDelete(id);
    return res.send({
      status: 'success',
    });
  } catch (err) {
    return res.send({
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
    return res.send({
      status: 'success',
      data,
    });
  } catch (err) {
    return res.send({
      status: 'fail',
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
};
