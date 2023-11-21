const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Random = require('./models/random');
const Tour = require('./models/tourModel');
const app = express();
const mongoose = require('mongoose');
const data = require('./dev-data/data/tours.json');
const toursRouter = require(`./routes/toursRoute`);

const { faker } = require('@faker-js/faker');

const createRandomUser = () => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),

    age: faker.number.int().toString().slice(0, 2) * 1,
  };
};
const datas = [];
for (let i = 0; i < 100; i++) {
  datas.push(createRandomUser());
}

const port = 8000;
app.use(express.json());
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

app.use(express.json());

const connectDB = async () => {
  try {
    mongoose.connect(
      `mongodb+srv://niravbhuva99:nirav123@cluster0.f4fi2nn.mongodb.net/nature`
    );

    console.log('connected');
  } catch (error) {
    console.log(error);
  }
};
connectDB();

app.use('/api/v1/tours', toursRouter);

app.listen(port, () => console.log('server started...'));
