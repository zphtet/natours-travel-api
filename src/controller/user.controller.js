const userModel = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError.js');


// get all users
const getAllUsers = catchAsync(async function (req, res, next) {
  const users = await userModel.find({});
  return res.status(200).json({
    status: 'success',
    count: users.length,
    data: {
      users,
    },
  });
});

// delete all users
const deleteAllUsers = catchAsync(async function (req, res, next) {
  await userModel.deleteMany({});
  return res.status(200).json({
    status: 'success',
  });
});

// update User not using this route anymore
const updateUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const data = await userModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
      changedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!data) {
    return next(new AppError('Not found user with that ID', 404));
  }
  return res.status(200).json({
    status: 'success',
    data,
  });
});

// update username and emial
const updateInfo = catchAsync(async function (req, res, next) {
  const { name, email } = req.body;
  const updateObj = {};

  if (name) updateObj.name = name;
  if (email) updateObj.email = email;

  let jwtToken = req.headers.authorization?.split(' ')[1];
  if (!jwtToken) return next(new AppError('jwt token not defined', 401));
  // verify token
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  if (!decoded.id) return next(new AppError('Invalid Id', 401));

  const userId = decoded.id;
  // userId = req.user.id

  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      ...updateObj,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({
    status: 'success',
    user,
  });
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteAllUsers,
  updateInfo,
};
