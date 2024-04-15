const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'An item must have a name!'],
    unique: true,
    maxlength: [150, 'An item name can not have more than 150 characters!'],
    minlength: [3, 'An item name can not have less than 3 characters!'],
  },
  itemValue: {
    type: Number,
    default: 1,
    required: [true, 'An item must have a value!'],
    min: [1, 'A value can not be less than 1!'],
    max: [50, 'A value can not be more than 50!'],
  },
  itemDescription: {
    type: String,
    required: [true, 'An item must have a description!'],
    maxlength: [1000, 'A description can not have more than 1000 characters!'],
    minlength: [3, 'A description can not have less than 10 characters!'],
  },
  itemAverageRating: {
    type: Number,
    min: [1, 'Rating must be higher than 1.0'],
    max: [5, 'Rating can not be higher than 5.0'],
    default: 2.5,
  },
  numberOfRatings: {
    type: Number,
    default: 0,
  },
  itemCoverImage: { type: String, default: 'default.jpg' },
  itemOtherImages: [String],
  itemCategory: {
    type: String,
    default: 'other',
  },
  itemCreatedAt: { type: Date, default: Date.now() },
});

itemSchema.index({ itemValue: 1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
