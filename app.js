const express = require('express');
const app = express();
const port = 8000;
app.use(express.json());

const toursRouter = require(`./routes/toursRoute`);

app.use('/api/v1/tours', toursRouter);

app.listen(port, () => console.log('server started...'));
