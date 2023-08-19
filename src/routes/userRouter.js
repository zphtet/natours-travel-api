const express = require('express');
const {
  signup,
  signin,
  getAllUsers,
  protect,
  updateUser,
  deleteAllUsers,
  forgotPassword,
  resetPassword,
  updatePasswrod,
  updateInfo,
  deleteAcc,
} = require('../controller/user.controller');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/users').get(protect, getAllUsers).delete(deleteAllUsers);
router.route('/users/:id').put(updateUser);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/updatepassword').patch(updatePasswrod);
router.route('/updateinfo').patch(updateInfo);
router.route('/deleteacc').delete(deleteAcc);

module.exports = router;
