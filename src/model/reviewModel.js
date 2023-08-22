const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must contain'],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
      required: [true, 'Tour Id must contain'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, 'User Id must contain'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARES
// document middleware

// query middleware
reviewSchema.pre(/^find/, async function (next) {
  this.select('-__v ');
  next();
});

// reviewSchema.pre(/^find/, async function (next) {
//   this.lean().populate('tour', { name: 1, guides: 0 });
//   next();
// });

// reviewSchema.pre(/^find/, async function (next) {
//   this.populate({
//     path: 'user',
//     select: 'name',
//   });
//   next();
// });

// create MODEL
const reviewModel = mongoose.model('reviews', reviewSchema);

// export MODEL
module.exports = reviewModel;
