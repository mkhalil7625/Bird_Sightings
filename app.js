var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//require mongoose
var mongoose=require('mongoose');
//require flash and session libraries
var flash=require('express-flash');
var session=require('express-session');
//register helper
var hbs=require('hbs');
var helpers=require('./hbshelpers/helpers');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//connect to mlab
var db_url=process.env.BIRD_DB_URL;
mongoose.connect(db_url)
    .then(()=>{console.log('Connected to mlab');})
    .catch((err)=>{console.log('Error connecting to mlab',err);})


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//register the helper
hbs.registerHelper(helpers)
//app.use() adds them as middleware
app.use(session({secret:'top secret',resave:false, saveUninitialized:false}));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //for invalid ObjectId consider 404
    if(err.kind==='ObjectId'&&err.name==='CastError'){
      err.status=404;

    }
if (err.status===404){
    res.render('404');
}
// render the error page
    else {
        res.status(err.status || 500);
        res.render('error');
    }
});

module.exports = app;
