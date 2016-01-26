var express = require('express');
var app = express();
var io = require('socket.io')(app)
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  console.log('connected to rabbit MQ')
});

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

app.listen((process.env.PORT || 8001), function () {
  console.log('App listening on port', (process.env.PORT || 8000), constants.API_URL);
});

module.exports = app;
