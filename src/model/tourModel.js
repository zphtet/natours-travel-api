const mongoose = require('mongoose');
// const mongoose = require('../../server');
const tourSchema = new mongoose.Schema({
  title: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  price: Number,
});

const TourModel = mongoose.model('tours', tourSchema);
// console.log('from Model', TourModel);
//  TourModel.create({title : 'Bagab'})
module.exports = TourModel;
