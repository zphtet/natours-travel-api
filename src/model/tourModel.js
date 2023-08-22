const mongoose = require('mongoose');
// const mongoose = require('../../server');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, 'A tour must have name '],
      trim: true,
      unique: true,
      // minLength: [true, 'A tuour name must have minimun 10 characters'],
      // maxLength: [true, 'A tour name must have maximun 40 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Invalid difficulty {VALUE} not support',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than or equal 1'],
      max: [5, 'Rating must be less than or equal 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount must be lower than the actual value {VALUE}',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        emum: ['Point'],
      },
      description: String,
      coordinates: [Number],
      address: String,
    },
    locations: [
      {
        description: String,
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        day: Number,
      },
    ],
  },
  {
    virtuals: {
      slug: {
        get() {
          return this.name.toLowerCase().split(' ').join('-');
        },
      },
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const TourModel = mongoose.model('tours', tourSchema);

// Virtual
// tourSchema.virtual('slug').get(function () {
//   return this.name.toLowerCase().split(' ').join('/');
// });

// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function (next) {
  console.log(this);
  this.priceDiscount = 1.2 * this.price;
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
});

module.exports = TourModel;
