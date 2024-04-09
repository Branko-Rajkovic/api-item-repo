const mongoose = require('mongoose');
const Item = require('./itemModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review can not be empty!'],
    maxlength: [300, 'A review can not have more than 300 characters!'],
    minlength: [15, 'A review can not have less than 15 characters!'],
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  reviewCreatedAt: {
    type: Date,
    default: Date.now(),
  },
  aboutItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: [true, 'Review must be about an item!'],
  },
  createdFromUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user!'],
  },
  reviewActive: {
    type: Boolean,
    default: true,
  },
});

//sets one review per one user for one item
reviewSchema.index({ aboutItem: 1, createdFromUser: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'aboutItem',
    select: 'itemName',
  }).populate({
    path: 'createdFromUser',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calculateItemsAverageRating = async function (itemId) {
  const averageRatings = await this.aggregate([
    {
      $match: { aboutItem: itemId },
    },
    {
      $group: {
        _id: '$aboutItem',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (averageRatings.length > 0) {
    await Item.findByIdAndUpdate(itemId, {
      numberOfRatings: averageRatings[0].nRating,
      itemAverageRating: Math.round(averageRatings[0].avgRating * 10) / 10,
    });
  } else {
    await Item.findByIdAndUpdate(itemId, {
      numberOfRatings: 0,
      itemAverageRating: 3,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateItemsAverageRating(this.aboutItem);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
