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

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();

    res.status(200).render('manageItems', {
      items,
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
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

exports.getUserAccount = (req, res, next) => {
  try {
    res.status(200).render('account', {
      title: 'Account',
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
  }
};

exports.getPasswordUpdatePage = (req, res, next) => {
  try {
    res.status(200).render('updatePassword', {
      title: 'update your password',
    });
  } catch (err) {
    next(new AppError('Something went wrong', 500));
  }
};

exports.getUpdateItemPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    const reviews = await Review.find({ aboutItem: id });

    res.status(200).render('itemUpdate', {
      item,
      reviews,
    });
  } catch (err) {
    next(new AppError('Requested item can not be found!', 404));
  }
};

exports.getAcctivationPage = async (req, res, next) => {
  console.log(req.data);
  res.status(200).render('acctivateAccount', {
    status: 'success',
  });
};
