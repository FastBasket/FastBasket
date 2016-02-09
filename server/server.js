var express = require('express');
var constants = require('./config/constants');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
module.exports.io = io;

io.sockets.on('connection', function(socket) {
  socket.join('admin');
  socket.join('store_chanel');
  
  socket.on('create', function(orderId) {
    console.log(orderId, 'room created');
    socket.join(orderId);
  });
});

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

server.listen((process.env.PORT || 8000), function () {
  console.log('App listening on port', (process.env.PORT || 8000), constants.API_URL);
});

module.exports.app = server;