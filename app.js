const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
// const data = require('./dev-data/data/tours.json');
const userRoute = require('./routes/userRoute');
const app = express();
const Tour = require('./models/tourModel');
const mongoose = require('mongoose');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const toursRouter = require(`./routes/toursRoute`);
const reviewRouter = require('./routes/reviewRoute');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));

const connectDB = async () => {
  try {
    mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`);
    console.log('connected');
  } catch (error) {
    console.log(error);
  }
};
connectDB();
//global middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request per from this ip try again in Hour',
});
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use('/api', limiter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/reviews', reviewRouter);

app.listen(process.env.PORT, () => console.log('server started...'));
