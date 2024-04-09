const multer = require('multer');
const sharp = require('sharp');
const Item = require('./../models/itemModel');
const handlerFactory = require('./handlerFactoty');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
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
  { name: 'uploadedCoverImage', maxCount: 1 },
  { name: 'otherUploadedImages', maxCount: 3 },
]);

exports.resizeItemImages = async (req, res, next) => {
  try {
    if (!req.files.uploadedCoverImage || !req.files.otherUploadedImages) {
      return next();
    }

    console.log(req.files);
    console.log(req.body.itemName);
    req.body.itemCoverImage = `item-cover-${Date.now()}.jpeg`;

    await sharp(req.files.uploadedCoverImage[0].buffer)
      .resize(400, 400)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/items/${req.body.itemCoverImage}`);

    req.body.itemOtherImages = [];

    await Promise.all(
      req.files.otherUploadedImages.map(async (image, index) => {
        const imageName = `item_image_${index + 1}_${Date.now()}.jpeg`;

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

exports.deleteManyItems = async (req, res, next) => {
  try {
    console.log(req.body.itemsToDelete);
    await Item.deleteMany({ _id: { $in: req.body.itemsToDelete } });
    res.status(200).json({
      status: 'success',
    });
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
