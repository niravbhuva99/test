const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: newTour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((ele) => delete queryObj[ele]);

    const q = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(q));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    if (req.query.fields) {
      const sortBy = req.query.fields.split(',').join(' ');
      console.log(sortBy);
      query = query.select(sortBy);
    } else query = query.select('-_v');

    const tour = await query;

    res.status(200).json({
      result: query.length,
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'failed',
      message: 'there is a error',
      error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const params = req.params.id;
    const result = await Tour.findById(params);
    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: 'not found',
      error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidatours: true,
    });

    res.status(200).json({
      updatedValue: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  const id = req.params.id;
  try {
    const del = await Tour.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted',
      del,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      error,
    });
  }
};
