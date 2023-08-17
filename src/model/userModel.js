const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
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
  changedAt: { type: Date, default: new Date() },
});

// document middleware
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = null;
  next();
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
