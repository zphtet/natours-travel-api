const express = require('express');
const router = express.Router();
const bookController = require('../controller/book.controller');

router
  .route('/create-checkout-session')
  .post(bookController.getTourAndPass, bookController.bookTour);

module.exports = router;
