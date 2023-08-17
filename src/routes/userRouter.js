const express = require('express');
const {
  signup,
  signin,
  getAllUsers,
  protect,
  updateUser,
} = require('../controller/user.controller');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/users').get(protect, getAllUsers);
router.route('/users/:id').put(updateUser);

module.exports = router;
