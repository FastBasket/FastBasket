var io = require('../server.js');
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_TOKEN;
var twilioClient = require('twilio')(accountSid, authToken);
var jobModel = require('../models/jobModel');

var sendSms = function(toNumber, message, callback){
  toNumber = "+1" + toNumber;
  twilioClient.messages.create({
    to: toNumber,
    from: "+12565026081",
    body: message,
  }, function(err, message) {
    callback(message);
  });
};

module.exports = {
  doneOrderReceived: function(req, res, next){
    var orderId = req.body.orderId;

    //take orderId and update status to Order Received
    jobModel.updateOrderStatus('ready', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        io.to(orderId).emit('doneOrderReceived', { message: "Your order is ready to be shipped " + orderId });
        //TODO: get 4158025390 from the request
        sendSms('4158025390', 'Your order is ready to be shipped', function(message){
          
        });
        res.sendStatus(200);
      }
    });
  },

  doneInProgress: function(req, res, next){
    var orderId = req.body.orderId;

    jobModel.updateOrderStatus('inProgress', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        //TODO: get 4158025390 from the request
        io.to(orderId).emit('doneInProgress', { message: "Your order is on route " + orderId });
        sendSms('4158025390', 'Your order is on route', function(message){
          
        });

        res.sendStatus(200);
      }
    });

  },
  
  doneOntheWay: function(req, res, next){
    var orderId = req.body.orderId;

    jobModel.updateOrderStatus('delivered', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        //TODO: get 4158025390 from the request
        io.to(orderId).emit('doneOntheWay', { message: "Your order was delivered, Thanks for using FastBasket " + orderId });
        sendSms('4158025390', 'Your order was delivered, Thanks for using FastBasket', function(message){
          
        });

        res.sendStatus(200);
      }
    });

  }
};