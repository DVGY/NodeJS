const express = require('express');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//set HTTP Security header using helmet
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, Try again after 1 hour',
});

//Limit access to api route
app.use('/api', limiter);

//Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data santization agains NO sql query injection
app.use(mongoSanitize());

//Data sanitization against XSS (Like entering html code inside  form)
app.use(xss());

//Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//handle all global error
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   msg: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
