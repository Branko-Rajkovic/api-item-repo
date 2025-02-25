const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //set cookie options. Number of miliseconds in a day: 86400000
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 86400000
    ),
    httpOnly: true,
  };

  if (process.env.ENV_NODE === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createAndSendToken(newUser, 201, res);

    //errror
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      next(new AppError('Email and password are required!', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Email or password is incorrect!', 401));
    }
    createAndSendToken(user, 200, res);

    //error
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //extracting the jwt token from request headers
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      next(new AppError('Please log in!'), 401);
    }

    //verify token
    const payloadToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //checking if user exsist
    const pendingUser = await User.findById(payloadToken.id);
    if (!pendingUser) {
      return next(new AppError('This user is deleted!', 401));
    }

    //checking if password has been changed after the token was created
    if (pendingUser.isPasswordChanged(payloadToken.iat)) {
      return next(
        new AppError(
          'Please log in again! The password is changed recently.',
          401
        )
      );
    }

    //Grant access to protected route
    req.user = pendingUser;

    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have access!', 403));
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    //get user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with provided email!', 404));
    }

    //generate token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send token via email to user
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Please send request with your new password on following address: ${resetURL}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token, valid only 5 min.',
        message: message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Reset token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      next(new AppError('Sending email failed. Please try again later.', 500));
    }

    //error
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //check token and user and set new password
    if (!user) {
      return next(
        new AppError(
          'User not found or token has expired! Please try again.',
          404
        )
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //update user account with new password
    //log the user in - new JWT
    createAndSendToken(user, 200, res);

    //error
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //Get user
    console.log(req.user);
    const user = await User.findById(req.user.id).select('+password');
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError('Password is incorrect', 401));
    }

    //update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createAndSendToken(user, 200, res);

    //error
  } catch (err) {
    next(err);
  }
};
