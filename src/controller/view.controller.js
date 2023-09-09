const TourModel = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');

exports.getOverview = catchAsync(async (req, res) => {
  // const resp = await axios.get(`${process.env.URL}/api/tours`);
  const resp = await axios.get(`/api/tours`);

  const data = resp.data.data.data;

  return res.render('overview', {
    title: 'All tours',
    message: 'Sever-side rendering with pug engine',
    data,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const resp = await TourModel.find({ slug: slug }).populate({
    path: 'reviews',
  });

  return res.render('tour', {
    title: resp[0].name + ' tour',
    message: 'Sever-side rendering with pug engine',
    tour: resp[0],
  });
});

exports.login = catchAsync(async (req, res) => {
  return res.render('login', {
    title: 'login page',
  });
});

exports.signup = catchAsync(async (req, res) => {
  return res.render('signup', {
    title: 'signup page',
  });
});

exports.getProifile = catchAsync(async (req, res) => {
  return res.render('me', {
    title: 'My Profile',
  });
});
