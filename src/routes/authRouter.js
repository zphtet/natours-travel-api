
const express = require('express')
const router = express.Router()

const {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    updatePasswrod,
    deleteAcc
  }  = require('../controller/auth.controller')

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/updatepassword').patch(updatePasswrod);
router.route('/deleteacc').delete(deleteAcc);

module.exports = router;