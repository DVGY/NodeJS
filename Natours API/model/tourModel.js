const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

/**Mongoose model and Schema */
/**schema */
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour should not exceed 40 characters'],
      minlength: [10, 'A tour should have min of 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be :easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be exceed 5'],
    },
    ratingsQuantity: {
      type: Number,

      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //warning : this only point to current doc on new doc creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],

    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, for embeddeing guides

    // referencing guides
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/** */

// See the access pattern of our application, which fields are queryed more.
// balance frequency of queries with cost of maintainng ,also read write resources (bit fuzzr, experi ,exp required)
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); // to query geospatial data
/*Virtual Property is not persisted in db, only show when get is run, cannot be used in agregation  */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Let make a virtual populate to connect Single Tour with reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/**Document pre middleware, runs before  doc is saved in db (runs before save(), create())*/
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
/**Tour guide using embedding , a tour guide update property, if tour has that user has guide then update, so we will not use this embedding rather, referncing  */
// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

/**Query middleware */
tourSchema.pre(/^find/, function (next) {
  // this points to query object
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  // this points to query object
  this.populate({
    path: 'guides',
    select:
      '-__v -passwordChangedAt -passwordResetToken -passwordResetTokenExpires',
  });
  next();
});

/**Aggregation middleware */
tourSchema.pre('aggregate', function (next) {
  // this point to current aggregation obj
  //Pipeline has array of arregation func
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  //Geo near should be first one to run
  next();
});

// tourSchema.pre('save', function (doc, next) {
//   console.log(this);
//   next();
// });
/** Model */
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
