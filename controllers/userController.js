const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const handlerFactory = require('./handlerFactoty');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.newName) {
      updates.name = req.body.newName;
    }
    if (req.body.newEmail) {
      updates.email = req.body.newEmail;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: `Name: ${user.name} - Email: ${user.email}`,
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
