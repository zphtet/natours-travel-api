const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  updatePasswrod,
  deleteAcc,
  logout,
  protect,
} = require('../controller/auth.controller');

router.route('/signup').post(signup);
router.route('/login').post(signin);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(protect, forgotPassword);
router.route('/resetpassword/:token').patch(protect, resetPassword);
router.route('/updatepassword').patch(protect, updatePasswrod);
router.route('/deleteacc').delete(protect, deleteAcc);

module.exports = router;
