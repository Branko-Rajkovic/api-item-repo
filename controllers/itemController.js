const fs = require('fs');
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
    if (!req.files.uploadedCoverImage && !req.files.otherUploadedImages) {
      return next();
    }

    console.log(req.files);
    console.log(req.body.itemName);
    console.log(req.params.id);
    if (req.files.uploadedCoverImage) {
      req.body.itemCoverImage = `item-cover-${Date.now()}.jpeg`;

      await sharp(req.files.uploadedCoverImage[0].buffer)
        .resize(400, 400)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/items/${req.body.itemCoverImage}`);
    }

    if (req.files.otherUploadedImages) {
      console.log(req.body.otherImagesFlag);
      if (req.params.id) {
        const item = await Item.findById(req.params.id);
        req.body.itemOtherImages = item.itemOtherImages;
      } else {
        req.body.itemOtherImages = [
          'default.jpg',
          'default.jpg',
          'default.jpg',
        ];
      }

      console.log(req.body.itemOtherImages);

      await Promise.all(
        req.files.otherUploadedImages.map(async (image) => {
          if (req.body.otherImagesFlag) {
            const imageName = `item_image_${
              req.body.itemName
            }_${Date.now()}.jpeg`;

            await sharp(image.buffer)
              .resize(400, 400)
              .toFormat('jpeg')
              .jpeg({ quality: 90 })
              .toFile(`public/img/items/${imageName}`);

            const index =
              req.body.otherImagesFlag & 0b001
                ? 0
                : req.body.otherImagesFlag & 0b010
                ? 1
                : req.body.otherImagesFlag & 0b100
                ? 2
                : null;
            req.body.otherImagesFlag &= ~(2 ** index);

            req.body.itemOtherImages[index] = imageName;
            console.log(req.body.itemOtherImages[index]);
          }
        })
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.deleteManyItems = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToDelete);
    await Item.deleteMany({ _id: { $in: req.body.reccordsToDelete } });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteItemsImages = async (req, res, next) => {
  try {
    const deletedItems = await Item.find({
      _id: { $in: req.body.reccordsToDelete },
    });
    for (let i = 0; i < deletedItems.length; i++) {
      console.log(deletedItems[i].itemCoverImage);
      if (deletedItems[i].itemCoverImage !== 'default.jpg')
        fs.unlink(
          `./public/img/items/${deletedItems[i].itemCoverImage}`,
          (err) => {
            if (err) console.log(err);
            console.log(
              `./public/img/users/${deletedItems[i].itemCoverImage} is deleted`
            );
          }
        );
      fs.unlink(
        `./public/img/items/${deletedItems[i].itemOtherImages[0]}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      fs.unlink(
        `./public/img/items/${deletedItems[i].itemOtherImages[1]}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      fs.unlink(
        `./public/img/items/${deletedItems[i].itemOtherImages[2]}`,
        (err) => {
          if (err) console.log(err);
        }
      );
    }
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
