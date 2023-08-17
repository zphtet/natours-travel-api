const userModel = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError.js');
const bcrypt = require('bcrypt');
// helper functions
const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

// controllers

const signup = catchAsync(async function (req, res, next) {
  const { name, email, password, confirmPassword } = req.body;
  const returnUser = await userModel.create({
    name,
    email,
    password,
    confirmPassword,
  });

  const token = getToken(returnUser._id);

  return res.status(200).json({
    status: 'success',
    jwt: token,
    data: {
      user: returnUser,
    },
  });
});

const signin = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  // find user on database
  const user = await userModel.findOne({ email }).select('+password');
  // check password equal
  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!user || !isPasswordEqual)
    return next(new AppError('Invalid email or password', 401));

  // generate token
  const token = getToken(user?._id);

  return res.status(200).json({
    status: 'success',
    jwt: token,
    data: {
      user,
    },
  });
});

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

// protect middleware

const protect = catchAsync(async (req, res, next) => {
  // get token from headers
  let jwtToken = req.headers.authorization?.split(' ')[1];
  // check token
  if (!jwtToken) return next(new AppError('jwt token not defined', 401));
  // verify token
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  // user still exist
  const user = await userModel.findOne({ _id: decoded.id });
  if (!user) return next(new AppError('User no longer exist', 404));
  // user password change
  const changeDate = Date.parse(user?.changedAt) / 1000;
  const jwtStartDate = decoded.iat;
  if (changeDate > jwtStartDate)
    return next(
      new AppError('jwt no longer valid because of user updated', 401)
    );

  next();
});
module.exports = {
  signup,
  signin,
  getAllUsers,
  protect,
  updateUser,
};
