const Item = require('./../models/itemModel');
const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');

exports.getOverview = async (req, res, next) => {
  try {
    const items = await Item.find();

    res.status(200).render('overview', {
      items,
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    const reviews = await Review.find({ aboutItem: id });

    res.status(200).render('item', {
      item,
      reviews,
    });
  } catch (err) {
    next(new AppError('Requested item can not be found!', 404));
  }
};

exports.getLoginForm = (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Log in',
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
  }
};

exports.getSigninForm = (req, res, next) => {
  try {
    res.status(200).render('signin', {
      title: 'Sign in',
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
  }
};
