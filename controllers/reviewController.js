const Review = require('./../models/reviewModel');
const handlerFactory = require('./handlerFactoty');

exports.setUserAndItemIdInRequest = (req, res, next) => {
  console.log(req);
  if (!req.body.aboutItem) req.body.aboutItem = req.params.itemId;
  if (!req.body.createdFromUser) req.body.createdFromUser = req.user.id;
  next();
};

exports.deleteManyReviews = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToDelete);
    await Review.deleteMany({ _id: { $in: req.body.reccordsToDelete } });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.deacctivateManyReviews = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToDeacctivate);
    await Review.updateMany(
      { _id: { $in: req.body.reccordsToDeacctivate } },
      { reviewActive: false }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.acctivateManyReviews = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToAcctivate);
    await Review.updateMany(
      { _id: { $in: req.body.reccordsToAcctivate } },
      { reviewActive: true }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
