const Review = require('./../models/reviewModel');
const handlerFactory = require('./handlerFactoty');

exports.setUserAndItemIdInRequest = (req, res, next) => {
  if (!req.body.item) req.body.aboutItem = req.params.itemId;
  if (!req.body.user) req.body.createdFromUser = req.user.id;
  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
