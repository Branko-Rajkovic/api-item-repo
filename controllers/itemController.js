const multer = require('multer');
const sharp = require('sharp');
const Item = require('./../models/itemModel');
const handlerFactory = require('./handlerFactoty');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith(image)) {
    cb(null, true);
  } else {
    cb(new AppError('File is not an image', 400, false));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadItemImages = upload.fields([
  { name: 'itemCoverImage', maxCount: 1 },
  { name: 'itemOtherImages', maxCount: 5 },
]);

exports.resizeItemImages = async (req, res, next) => {
  try {
    req.body.itemCoverImage = `item-cover-${Date.now()}.jpeg`;

    await sharp(req.files.uploadedCoverImage[0].buffer)
      .resize(400, 400)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/items/${req.body.itemCoverImage}`);

    req.body.itemOterImages = [];

    await Promise.all(
      req.files.otherUploadedImages.map(async (image, index) => {
        const imageName = `item-image_${index + 1}_${Date.now()}.jpg`;

        await sharp(image.buffer)
          .resize(400, 400)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/items/${imageName}`);

        req.body.itemOtherImages.push(imageName);
      })
    );

    next();
  } catch (err) {
    next(err);
  }
};

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
