const ErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  return res.render('error', {
    title: 'Error Page',
    message: err.message,
  });
};

const ErrorProd = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // error: err,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    return ErrorDev(err, req, res);
  } else {
    console.log('it work');
    return ErrorProd(err, req, res);
  }
};
