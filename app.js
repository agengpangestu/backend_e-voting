require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./src/routes');
const usersRouter = require('./src/routes/users');
const ErrorHandler = require('./src/middlewares/error.handler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views')); // must src/views if in directory src
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors('*'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public'))); // must src/public if in directory src
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req,res,next) =>  {
  res.statusCode(200).send('Hello')
})
app.use('/api', indexRouter, ErrorHandler);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
