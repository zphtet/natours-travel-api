const mongoose = require('mongoose');
const TourModel = require('./tourModel');

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

// create Index for one user - one review - one tour

reviewSchema.index({tour : 1 , user : 1},{unique : true})


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



// Static Method

reviewSchema.statics.setRatingStatsToTour =async function(tourId){
   const stats = await this.aggregate([
    {
      $match : {tour : tourId}
    },
    {
      $group :{
           _id : '$tour',
           nRating : {$sum : 1},
           avgRating : {$avg :'$rating' }
      }
    }
   ])

   await TourModel.findByIdAndUpdate(tourId,{
    ratingsAverage : stats[0]?.avgRating || 4.5,
    ratingsQuantity : stats[0]?.nRating || 0
   })
}


// I want to update tour doc stats when relate reviews create / update / delete
//for create i can use document middleware

// for create
reviewSchema.post('save',function(){
    this.constructor.setRatingStatsToTour(this.tour);
})


// for update and delete 
reviewSchema.pre(/^findOneAnd/, async function(next){
   this.tour = await this.findOne().clone()
  next()
})

reviewSchema.post(/^findOne/, async function(){
    if(!this.tour) return;
   await this.tour.constructor.setRatingStatsToTour(this.tour.tour)
})



// create MODEL
const reviewModel = mongoose.model('reviews', reviewSchema);

// export MODEL
module.exports = reviewModel;
