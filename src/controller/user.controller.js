const userModel = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError.js');
const { deleteOneById , updateOneById, getOneById, getAll} = require('./factory');

// MIDDLEWARE

const setChangedAt = (req , res , next)=>{
  delete req.body.role;
  delete req.body.email;
   req.body.changedAt = Date.now();
   next();
}

const filterOnlyEmailName = (req,res,next)=>{
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

  req.body = updateObj;
  req.params.id = userId;
  next()
}



// get all users
// const getAllUsers = catchAsync(async function (req, res, next) {
//   const users = await userModel.find({});
//   return res.status(200).json({
//     status: 'success',
//     count: users.length,
//     data: {
//       users,
//     },
//   });
// });

// MIDDLEWARE




const updateInfo = updateOneById(userModel)
const updateUser = updateOneById(userModel);
const deleteUser = deleteOneById(userModel);
const getUser = getOneById(userModel)
const getAllUsers = getAll(userModel)


module.exports = {
  getAllUsers,
  updateUser,
  updateInfo,
  deleteUser,
  setChangedAt,
  filterOnlyEmailName,
  getUser
};
