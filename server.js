const express = require('express');
const app = express();
const mongoose = require('mongoose');
const tourRouter = require('./src/routes/tourRouter');
const userRouter = require('./src/routes/userRouter');
const globalErrorHandler = require('./src/controller/error.controller');
const AppError = require('./src/utils/AppError');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const PORT = 8000;

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})


process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT ERROR 💥 Shutting down');
  process.exit(1);
});

require('dotenv').config();

// GLOBAL MIDDLEWARE

// prse json file
app.use(express.json({limit : '10kb'}));
// sever static files
app.use(express.static(`${__dirname}/public`));

//limit rate
app.use(limiter)

// set http response headers
app.use(helmet())

// sanitize input
app.use(mongoSanitize())

// h parameter pollution
app.use(hpp())



// ROUTES
app.route('/').get((req, res) => {
  return res.send('<h1> This is Natour API Home </h1>');
});

app.use(tourRouter);
app.use(userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 404));
});

// globla error handler

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
  console.log(err.name, err.message , err.stack);
  console.log('UNHANDLED REJECT 💥 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
