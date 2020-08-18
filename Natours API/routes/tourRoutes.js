const express = require('express');

const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const reviewRouter = require('../routes/reviewRoutes');

/**Mounting router on top of another route */
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/tour-plans/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlans
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours) // We want every one to access to all tours so no protect
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.addTour
  );

router
  .route('/:id')
  .get(tourController.getTours)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTourData
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.addReview
//   );

//authController.protect to protect the delete of tours be regular user, admin can delete the tours only.
//authController.restricted to protect

module.exports = router;
