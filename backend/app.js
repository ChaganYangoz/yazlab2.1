var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');


var app = express();


mongoose.set('strictQuery', false);
const key =
	'mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
main().catch((err) => console.log(err));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



let yayinRouter = require('./routes/YayinRouter');
app.use('/Yayin', yayinRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function main() {
	await mongoose.connect(key);
}

module.exports = app;
