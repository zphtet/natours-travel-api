const express = require('express');
const app = express();
const mongoose = require('mongoose');
const tourRouter = require('./src/routes/tourRouter');
const globalErrorHandler = require('./src/controller/error.controller');
const AppError = require('./src/utils/AppError');
const PORT = 8000;

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT ERROR 💥 Shutting down');
  process.exit(1);
});

require('dotenv').config();

// middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.route('/').get((req, res) => {
  return res.send('<h1> This is Natour API Home </h1>');
});

app.use(tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

// connections

async function DBconnect() {
  try {
    await mongoose.connect(
      `mongodb+srv://zinpainghtet215108:${process.env.DB_USER_PASSWORD}@cluster0.cyjpa19.mongodb.net/natours`
    );
    console.log(`DB connect success`);
    return true;
  } catch (err) {
    console.log(`DB connect fail`);
    return false;
  }
}

let server;
async function startServer() {
  if (!(await DBconnect()))
    return console.log('Error occured while connecting to DB');

  server = app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}

startServer();

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECT 💥 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
