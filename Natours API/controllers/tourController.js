const Tour = require('../models/tourModel');

//Get All Tours
//Note: req.query take key in present in doc
exports.getAllTours = async (req, res) => {
  //Filtering
  const queryObj = { ...req.query };

  const excludedQueryKey = ['sort', 'limit', 'fields', 'page'];
  excludedQueryKey.forEach(queryKey => delete queryObj[queryKey]);

  const queryStr = JSON.stringify(queryObj).replace(
    /(gte|lt|lte|gt)/g,
    match => `$${match}`
  );

  //Sorting
  const sortQuery = req.query.sort ? req.query.sort.split(',').join(' ') : {};
  //Field Limiting
  const selectFieldsQuery = req.query.fields
    ? req.query.fields.split(',').join(' ')
    : {};
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  try {
    const tours = await Tour.find(JSON.parse(queryStr))
      .sort(sortQuery)
      .select(selectFieldsQuery)
      .skip(skip)
      .limit(limit);

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
