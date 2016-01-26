var express = require('express');
var app = express();
var redis = require('redis').createClient()
var pg = require('pg')

redis.on('connect', function() {
    console.log('redis connected');
});
redis.subscribe("jobs");

var backlog = 0;
require('./config/routes.js')(app, backlog, redis);

app.listen((process.env.PORT || 8001), function () {
  console.log('App listening on port', (process.env.PORT || 8000));
});

module.exports = app;
