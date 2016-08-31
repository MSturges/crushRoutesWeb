var express = require('express')
var path = require('path')
var logger = require('morgan')

var app = express()

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function(req,res,next) {
  res.sendFile('index.html', { root: __dirname + '/public/' })
})

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: {}
  })
})


module.exports = app
