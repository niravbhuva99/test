exports.deleteOne = (Model) => async (req, res) => {
  const id = req.params.id;
  const doc = await Model.deleteOne({ _id: id });
  if (!doc) throw new Error('not found');
  try {
    res.status(200).json({
      message: 'deleted',
      doc,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      error,
    });
  }
};

exports.updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidatours: true,
    });

    res.status(200).json({
      updatedValue: doc,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    const params = req.params.id;
    console.log(params);
    let query = Model.findById(params);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    console.log(doc);
    res.status(200).json({
      doc,
    });
  } catch (error) {
    res.status(400).json({
      message: 'not found',
      error,
    });
  }
};

exports.getAll = (Model) => async (req, res) => {
  try {
    const tour = await Model.find();
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
