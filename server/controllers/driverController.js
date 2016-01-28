var io = require('../server.js');

module.exports = {
  doneOrderReceived: function(req, res, next){
    var orderId = req.body.orderId;

    io.to(orderId).emit('doneOrderReceived', { message: "done with Order received " + orderId });

    res.sendStatus(200);
  },
  doneInProgress: function(req, res, next){
    var orderId = req.body.orderId;

    io.to(orderId).emit('doneInProgress', { message: "done with In Progress " + orderId });

    res.sendStatus(200);
  },
  doneOntheWay: function(req, res, next){
    var orderId = req.body.orderId;

    io.to(orderId).emit('doneOntheWay', { message: "done with On the Way " + orderId });

    res.sendStatus(200);
  }
};