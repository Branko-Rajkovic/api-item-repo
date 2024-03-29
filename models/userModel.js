const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
    maxlength: [50, 'A username can not have more than 50 characters!'],
    minlength: [3, 'A username can not have less than 3 characters!'],
  },
  email: {
    type: String,
    required: [true, 'Email must be entered!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email!'],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    required: true,
    enum: ['user', 'item-admin', 'user-admin', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A password must be set!'],
    maxlength: [150, 'A password can not have more than 150 characters!'],
    minlength: [8, 'A password can not have less than 3 characters!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password confirmation does not match the password!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 3000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.isPasswordChanged = function (timeStampOfJWT) {
  if (this.passwordChangedAt) {
    return (
      timeStampOfJWT < parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    );
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 600000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
