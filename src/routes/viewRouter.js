const express = require('express');
const viewController = require('../controller/view.controller');
const router = express.Router();
const TourModel = require('../model/tourModel');

router.route('/').get(viewController.getOverview);

router.get('/hello', async (req, res) => {
  const tour = await TourModel.find({ slug: 'the-northern-lights' });
  return res.status(200).json({
    status: 'success',
    tour,
  });
});

router.route('/title/:til').get((req, res) => {
  return res.render('title', {
    title: 'This is title',
  });
});

router.route('/tour/:slug').get(viewController.getTour);

module.exports = router;
