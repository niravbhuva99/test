const mongoose = require('mongoose');
var validator = require('validator');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    minLength: [10, 'min of 10 Character is required'],
    maxLength: [50, 'name is too long'],
  },

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  priceDiscount: {
    type: Number,
    //
    validate: {
      validator: function (val) {
        return val < this.price;
      },
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

//document middleware : run before save command and create command
tourSchema.pre('save', function (next) {
  console.log('from middleware', this);
  next();
});

tourSchema.post('save', function (docs, next) {
  console.log(docs);
  next();
});

// query middleware

tourSchema.pre('find', function (next) {
  this.find({ price: { $lte: 400 } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
