const express = require('express');
const router = express.Router();
const bookController = require('../controller/book.controller');
const authController = require('../controller/auth.controller');

router.use(authController.isLoggedIn);
router
  .route('/create-checkout-session')
  .post(bookController.getTourAndPass, bookController.bookTour);

module.exports = router;
