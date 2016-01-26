var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var amqp = require('amqplib/callback_api');

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express, io, amqp);

server.listen(8002);

module.exports = app;
