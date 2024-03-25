const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid value ${err.value} of ${err.path}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldInputErrorDB = (err) => {
  const value = err.keyValue.itemName;
  const message = `Duplicate field input. It already exsist: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Validation : ${errors.join(' ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  const message = `Please log in again: ${err.message}.`;
  return new AppError(message, 401);
};

const handleJWTExpiredError = (err) => {
  const message = `Please log in again: ${err.message}`;
  return new AppError(message, 401);
};

const sendErrDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).render('error', {
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let prodErr = { ...err };
    prodErr.message = err.message;

    if (err.name === 'CastError') {
      prodErr = handleCastErrorDB(prodErr);
    }
    if (err.code === 11000) {
      prodErr = handleDuplicateFieldInputErrorDB(prodErr);
    }
    if (err.name === 'ValidationError') {
      prodErr = handleValidationErrorDB(prodErr);
    }
    if (err.name === 'JsonWebTokenError') {
      prodErr = handleJWTError(prodErr);
    }
    if (err.name === 'TokenExpiredError') {
      prodErr = handleJWTExpiredError(prodErr);
    }
    sendErrProduction(prodErr, res);
  }
};

module.exports = errorHandler;
