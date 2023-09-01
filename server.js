const express = require('express');
const app = express();
const mongoose = require('mongoose');
const tourRouter = require('./src/routes/tourRouter');
const userRouter = require('./src/routes/userRouter');
const authRouter = require('./src/routes/authRouter');
const reviewRouter = require('./src/routes/reviewRouter');
const viewRouter = require('./src/routes/viewRouter');
const globalErrorHandler = require('./src/controller/error.controller');
const AppError = require('./src/utils/AppError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const PORT = 8000;

// const upload = multer({ dest: './public/upload/' });

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT ERROR 💥 Shutting down');
  process.exit(1);
});

require('dotenv').config();

// GLOBAL MIDDLEWARE

// prse json file
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// sever static files
app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//limit rate
// app.use(limiter);

// set http response headers
app.use(helmet());

// sanitize input
app.use(mongoSanitize());

// h parameter pollution
app.use(hpp('/', hpp()));

// ROUTES

app.use(function (req, res, next) {
  // console.log(req.cookies);
  next();
});

// app.get('/hello', (req, res) => res.json({ status: 'success', tour: 'hell' }));

// app.patch('/uploadphoto', upload?.single('photo'), (req, res) => {
//   // console.log(req.file);
//   // console.log(req.body.name);
//   console.log('to update data');
//   console.log({
//     ...req.body,
//     photo: req.file.filename,
//   });
//   return res.status(200).json({
//     status: 'success',
//   });
// });

app.use(viewRouter);
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api', authRouter);
app.use('/api/reviews', reviewRouter);

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
  console.log(err.name, err.message, err.stack);
  console.log('UNHANDLED REJECT 💥 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
