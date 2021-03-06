var express = require('express');
var constants = require('../server/config/constants');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var amqp = require('amqplib/callback_api');
var passport = require('passport');

require('./config/middleware.js')(app, express, passport);
require('./config/driverController.js')(app, express, io, amqp);
require('./config/routes.js')(app,express,passport);

server.listen(8009, function () {
  console.log('App listening on port', (process.env.PORT || 8009), constants.API_URL);
});

module.exports = app;