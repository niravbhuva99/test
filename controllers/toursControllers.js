const Tour = require('../models/tourModel');

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((ele) => delete queryObj[ele]);

    const q = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(q));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const sortBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(sortBy);
    } else this.query = this.query.select('-_v');

    return this;
  }
  pagination() {
    if (this.queryString.page) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = query.skip(skip).limit(limit);
    }
    return this;
  }
}
exports.alies = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-ratingsAverage,price'),
    (req.query.fields = 'name,price,ratingsAverage,summary,difficulty');
  next();
};
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
    // const queryObj = { ...req.query };

    // const excludeField = ['page', 'sort', 'limit', 'fields'];
    // excludeField.forEach((ele) => delete queryObj[ele]);

    // const q = JSON.stringify(queryObj).replace(
    //   /\b(gte|gt|lt|lte)\b/g,
    //   (match) => `$${match}`
    // );

    // let query = Tour.find(JSON.parse(q));
    // const features = new ApiFeatures(Tour.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .pagination();

    const tour = await Tour.find();

    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //   filter.query = filter.query.sort(sortBy);
    // }
    // fields => meaning what prop you want to send in res not all prop
    // if (req.query.fields) {
    //     const sortBy = req.query.fields.split(',').join(' ');
    //     console.log(sortBy);
    //     query = query.select(sortBy);
    //   } else query = query.select('-_v');

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip > numTours) {
    //     throw new Error('this page does not exist');
    //   }
    // }

    res.status(200).json({
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'failed',
      message: 'there is a error',
      error: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const params = req.params.id;
    const result = await Tour.findById(params).populate('reviews');
    console.log(result.reviews);
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          averageRating: { $avg: '$ratingsAverage' },
          price: { $min: '$price' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);

    res.json({ data: stats });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $group: {
          _id: { $month: '$startDates' },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { month: 1 } },
    ]);

    res.json({ data: stats });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
