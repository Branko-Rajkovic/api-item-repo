const Review = require('./../models/reviewModel');
const handlerFactory = require('./handlerFactoty');

exports.setUserAndItemIdInRequest = (req, res, next) => {
  console.log(req);
  if (!req.body.aboutItem) req.body.aboutItem = req.params.itemId;
  if (!req.body.createdFromUser) req.body.createdFromUser = req.user.id;
  next();
};

exports.deactivateManyReviews = async (req, res, next) => {
  try {
    console.log(req.body.reviewsToDeactivate);
    await Review.updateMany(
      { _id: { $in: req.body.reviewsToDeactivate } },
      { reviewActive: false }
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
