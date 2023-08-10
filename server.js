const express = require('express');
const app = express();
const mongoose = require('mongoose');
const tourRouter = require('./src/routes/tourRouter');
const PORT = 8000;

require('dotenv').config();

// middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// connections

async function DBconnect() {
  try {
    await mongoose.connect(
      `mongodb+srv://zinpainghtet215108:${process.env.DB_USER_PASSWORD}@cluster0.cyjpa19.mongodb.net/natours`
    );
    //localhost:27017/natours
    // mongodb:
    // await mongoose.connect('mongodb://localhost:27017/natours');
    console.log(`DB connect success`);
    return true;
  } catch (err) {
    console.log(`DB connect fail`);
    return false;
  }
}

async function startServer() {
  if (!(await DBconnect()))
    return console.log('Error occured while connecting to DB');

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}

startServer();

// module.exports = {
//   mongoose,
// };

// Routes

app.route('/').get((req, res) => {
  return res.send('<h1> This is Natour API Home </h1>');
});

app.use(tourRouter);
