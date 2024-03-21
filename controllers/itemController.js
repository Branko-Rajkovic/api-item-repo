const Item = require('./../models/itemModel');
const handlerFactory = require('./handlerFactoty');

exports.getAllItems = handlerFactory.getAll(Item);
exports.getItem = handlerFactory.getOne(Item);
exports.createItem = handlerFactory.createOne(Item);
exports.updateItem = handlerFactory.updateOne(Item);
exports.deleteItem = handlerFactory.deleteOne(Item);

exports.getItemsStat = async (req, res, next) => {
  try {
    const itemStats = await Item.aggregate([
      {
        $group: {
          _id: null,
          numItems: { $sum: 1 },
          avgItemValue: { $avg: '$itemValue' },
          minItemValue: { $min: '$itemValue' },
          maxItemValue: { $max: '$itemValue' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      itemStats,
    });
  } catch (err) {
    next(err);
  }
};
