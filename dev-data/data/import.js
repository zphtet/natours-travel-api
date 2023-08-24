const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const fs = require('fs');
require('dotenv').config();
const TourModel = require('../../src/model/tourModel');
const userModel = require('../../src/model/userModel')
const reviewModel = require('../../src/model/reviewModel')
// middlewares
app.use(express.json());

// connections

mongoose.connect(
  `mongodb+srv://zinpainghtet215108:${process.env.DB_USER_PASSWORD}@cluster0.cyjpa19.mongodb.net/natours`
);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const userdata = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviewdata = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
const importData = async () => {
  //   console.log(data);
  await TourModel.create(data);
  await userModel.create(userdata , {validateBeforeSave : false})
  await reviewModel.create(reviewdata)
  console.log('Completed import');
  process.exit();
};

const deleteData = async () => {
  await TourModel.deleteMany({});
  await userModel.deleteMany({});
  await reviewModel.deleteMany({})
  console.log('deleted successful');
  process.exit();
};

let command = process.argv[2];

if (command === '--import') importData();
if (command === '--delete') deleteData();
