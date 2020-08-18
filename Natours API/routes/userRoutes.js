const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

/**Auth Routes */
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// Protect all routes after this middleware
router.use(authController.protect);

/*User Routes*/
router.patch('/updateMe', userController.updateMe);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUserData)
  .delete(userController.deleteUser);

module.exports = router;
