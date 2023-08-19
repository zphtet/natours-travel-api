const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Email is not valid',
    },
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is requried'],
    minlength: 4,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password must be the same',
    },
    select: false,
  },
  changedAt: { type: Date, default: Date.now() },
  resetPasswordToken: String,
  resetTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// document middleware
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = null;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.changedAt = Date.now();
  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// instance Methods
userSchema.methods.passwordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const resetTokenExpire = Date.now() + 10 * 1000 * 60;
  return { resetToken, resetPasswordToken, resetTokenExpire };
};

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
