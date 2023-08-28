const TourModel = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const fetch = require('node-fetch-commonjs');
const axios = require('axios');
const http = require('http');

exports.getOverview = catchAsync(async (req, res) => {
  const resp = await axios.get(`${process.env.URL}/api/tours`);
  const data = resp.data.data.data;

  return res.render('overview', {
    title: 'This is the overview page',
    message: 'Sever-side rendering with pug engine',
    data,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;
  // const resp = await axios(`${process.env.URL}/api/tours/${id}`);
  const resp = await TourModel.find({ slug: slug }).populate({
    path: 'reviews',
  });
  // return res.json({ resp });

  // return res.status(200).json({
  //   tour: resp[0],
  // });
  return res.render('tour', {
    title: 'This is the single tour page',
    message: 'Sever-side rendering with pug engine',
    tour: resp[0],
  });
});
