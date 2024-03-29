const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const handlerFactory = require('./handlerFactoty');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users/');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('file is not an image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  filter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `user-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    const userUpdates = filterObj(req.body, 'name', 'email');
    if (req.file) userUpdates.photo = req.file.filename;

    const user = await User.findByIdAndUpdate(req.user.id, userUpdates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.createUser = handlerFactory.createOne(User);
