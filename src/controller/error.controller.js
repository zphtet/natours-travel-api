const ErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

const ErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // error: err,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  console.log(process.env.NODE_ENV + 'from controller');
  if (process.env.NODE_ENV === 'development') {
    return ErrorDev(err, res);
  } else {
    console.log('it work');
    return ErrorProd(err, res);
  }
};
