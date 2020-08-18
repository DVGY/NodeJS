const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });
// Get user data that is logged in
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//Deactivate acc
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //Check is password and confirmPassword is not submitted
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('This is not the correct route to update the password', 400)
    );
  }

  //Update a user document
  const filterdBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'server error', msg: 'Please use Sign/Up page' });
};

// exports.getUser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'server error', msg: 'This route is not yet defined' });
// };

/**Update for admins only not used for change password */
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.updateUserData = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

// exports.updateUserData = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'server error', msg: 'This route is not yet defined' });
// };

// exports.deleteUser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'server error', msg: 'This route is not yet defined' });
// };
