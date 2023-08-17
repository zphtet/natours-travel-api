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
  const user = await userModel.findOne({ email });
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

module.exports = {
  signup,
  signin,
};
