const fs = require('fs');
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
  fileFilter: multerFilter,
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
    if (!req.file) {
      req.body.photo = 'default.jpg';
      return next();
    }
    console.log(req.file);
    req.file.filename = `user-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(100, 100)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
    req.body.photo = req.file.filename;
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

exports.deleteManyUsers = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToDelete);
    await User.deleteMany({ _id: { $in: req.body.reccordsToDelete } });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.deacctivateManyUsers = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToDeacctivate);
    await User.updateMany(
      { _id: { $in: req.body.reccordsToDeacctivate } },
      { active: false }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.acctivateManyUsers = async (req, res, next) => {
  try {
    console.log(req.body.reccordsToAcctivate);
    await User.updateMany(
      { _id: { $in: req.body.reccordsToAcctivate } },
      { active: true }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUserImage = async (req, res, next) => {
  try {
    const deletedUsers = await User.find({
      _id: { $in: req.body.reccordsToDelete },
    });
    for (let i = 0; i < deletedUsers.length; i++) {
      console.log(deletedUsers[i].photo);
      if (deletedUsers[i].photo !== 'default.jpg')
        fs.unlink(`./public/img/users/${deletedUsers[i].photo}`, (err) => {
          if (err) console.log(err);
          console.log(`./public/img/users/${deletedUsers[i].photo} is deleted`);
        });
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.createUser = handlerFactory.createOne(User);
