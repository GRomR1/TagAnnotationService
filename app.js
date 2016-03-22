var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var upload = require('./routes/upload');
var analyze = require('./routes/analyze');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//express.bodyParser({ uploadDir: 'upload' });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//
//app.get('/analyze', function(req, res){
//  var query = require('url').parse(req.url,true).query;
//  var textarea1 = query.textarea1;
//  res.send('GET: ' + JSON.stringify(query) + '<br>'+ textarea1);
//});
//
//app.post('/analyze', function(req, res){
//  var textarea1 = req.body.textarea1;
//  res.send('POST: ' + JSON.stringify(req.body) + '<br>'+textarea1);
//});

app.use('/', routes);
app.use('/upload', upload);
app.use('/analyze', analyze);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
