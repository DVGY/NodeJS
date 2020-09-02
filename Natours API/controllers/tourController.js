const Tour = require('../models/tourModel');

//Get All Tours
//Note: req.query take key in present in doc
exports.getAllTours = async (req, res) => {
  const queryObj = { ...req.query };

  const excludedQueryKey = ['sort', 'limit'];
  excludedQueryKey.forEach(queryKey => delete queryObj[queryKey]);

  const queryStr = JSON.stringify(queryObj).replace(
    /(gte|lt|lte|gt)/g,
    match => `$${match}`
  );

  try {
    const tours = await Tour.find(JSON.parse(queryStr));
    res.status(200).json({
      msg: 'success',
      results: tours.length,
      data: tours
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      msg: 'fail',
      error: error
    });
  }
};

exports.getTour = (req, res) => {};

exports.createTour = (req, res) => {
  // console.log(req.body);
};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
