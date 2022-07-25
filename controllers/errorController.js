const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token.Please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('ERROR 🔥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  // A)API

  if (req.originalUrl.startsWith('/api')) {
    // A)Operational,trusted error:send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //B)programing or other unknown error:dont,t leak error details
    //1)Log error
    console.error('ERROR 🔥', err);

    // 2)Send generate message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B)RENDERED WEBSITE
  // A)Operational,trusted error:send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //B)programing or other unknown error:dont,t leak error details
  //1)Log error
  console.error('ERROR 🔥', err);

  // 2)Send generate message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please Try Again Later.',
  });
};
////////////////////////////////////
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    // return sendErrorDev(err, res);
    // console.log('Code ', { name: err.name });
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
