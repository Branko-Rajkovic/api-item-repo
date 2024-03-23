const Item = require('./../models/itemModel');
const Review = require('./../models/reviewModel');

exports.getOverview = async (req, res, next) => {
  try {
    const items = await Item.find();

    res.status(200).render('overview', {
      items,
    });
  } catch (err) {
    next(err);
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
    next(err);
  }
};
