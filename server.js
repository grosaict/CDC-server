const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(cors())
app.use(morgan('dev'));

//Importing routes
const kidRoute = require('./routes/kid');
const loginRoute = require('./routes/login');
const userRoute = require('./routes/user');
const searchRoute = require('./routes/search');

const itemRoute = require('./routes/item'); // EXCLUIR

app.use(
  "/files",
  express.static(path.resolve(__dirname, "uploads"))
);

mongoose.connect(
  process.env.DB_CONNECT, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

//Make routes available
app.use('/api/kid', kidRoute);
app.use('/api/login', loginRoute);
app.use('/api/user', userRoute);
app.use('/api/search', searchRoute);

app.use('/api/item', itemRoute); // EXCLUIR

const port = process.env.PORT;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});
