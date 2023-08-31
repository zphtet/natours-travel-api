const userModel = require('../model/userModel');

const {
  deleteOneById,
  updateOneById,
  getOneById,
  getAll,
} = require('./factory');

// MIDDLEWARE

const setChangedAt = (req, res, next) => {
  delete req.body.role;
  delete req.body.email;
  req.body.changedAt = Date.now();
  next();
};

const filterOnlyEmailName = (req, res, next) => {
  const { name, email } = req.body;
  const updateObj = {};

  if (name) updateObj.name = name;
  if (email) updateObj.email = email;
  req.body = updateObj;
  req.params.id = req.user._id;
  next();
};

const getMeId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const getMe = getOneById(userModel);
const updateInfo = updateOneById(userModel);
const updateUser = updateOneById(userModel);
const deleteUser = deleteOneById(userModel);
const getUser = getOneById(userModel);
const getAllUsers = getAll(userModel);

module.exports = {
  getAllUsers,
  updateUser,
  updateInfo,
  deleteUser,
  setChangedAt,
  filterOnlyEmailName,
  getUser,
  getMeId,
  getMe,
};
