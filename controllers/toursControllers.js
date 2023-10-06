const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf8')
);
(exports.getAllTourMidW = (req, res, next) => {
  //   if (req.params.id > tours.length) {
  //     // res.json({
  //     //   status: 200,
  //     //   message: 'not valid request',
  //     // });
  //   } else next();
  console.log('m1');
  next();
}),
  exports,
  (m2 = (req, res, next) => {
    // send a regular response
    res.send('regular');
  });
exports.getChecked = (req, res, next) => {
  if (!req.body.name) {
    return res.json({
      status: 200,
      message: 'not valid Data',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.json(tours);
};

exports.getTour = (req, res) => {
  const id = req.params.id;
  const data = tours.find((item) => item.id === Number(id));
  res.json({
    status: 500,
    data,
  });
};

exports.createTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newEntry = Object.assign({ id: newId }, req.body);
  tours.push(newEntry);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.json(newEntry);
    }
  );
};
