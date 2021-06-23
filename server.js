const express   = require('express');
const dotenv    = require('dotenv');
const morgan    = require('morgan');
const cors      = require('cors');
const mongoose  = require('mongoose');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(cors())
app.use(morgan('dev'));

//Importing routes
const kidRoute      = require('./routes/kid');
const measureRoute  = require('./routes/measure');
const vaccineRoute  = require('./routes/vaccine');
const loginRoute    = require('./routes/login');
const userRoute     = require('./routes/user');

mongoose.connect(
  process.env.DB_CONNECT, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

//Make routes available
app.use('/api/kid',     kidRoute);
app.use('/api/measure', measureRoute);
app.use('/api/vaccine', vaccineRoute);
app.use('/api/login',   loginRoute);
app.use('/api/user',    userRoute);

const port = process.env.PORT;

app.listen(port, function (err) {
  console.log("server.js >>>")
  console.log('Caderneta da Criança server listening on port '+port);
  if (err) {
    console.log("err >>>")
    console.log(err)
  }
});
