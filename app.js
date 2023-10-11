const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();
const mongoose = require('mongoose');
const toursRouter = require(`./routes/toursRoute`);

const port = 8000;
app.use(express.json());
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

app.use(express.json());

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use('/api/v1/tours', toursRouter);

app.listen(port, () => console.log('server started...'));
