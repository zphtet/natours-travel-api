const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const fs = require('fs');
require('dotenv').config();
const TourModel = require('../../src/model/tourModel');
// middlewares
app.use(express.json());

// connections

mongoose.connect(
  `mongodb+srv://zinpainghtet215108:${process.env.DB_USER_PASSWORD}@cluster0.cyjpa19.mongodb.net/natours`
);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));
const importData = async () => {
  //   console.log(data);
  await TourModel.create(data);
  console.log('Completed import');
};

const deleteData = async () => {
  await TourModel.deleteMany({});
  console.log('deleted successful');
};

let command = process.argv[2];

if (command === '--import') importData();
if (command === '--delete') deleteData();
