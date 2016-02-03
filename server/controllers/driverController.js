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
    var phone = req.body.phone;
    
    jobModel.updateOrderStatus('ready', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        io.to(orderId).emit('doneOrderReceived', { message: "Your order is ready to be shipped " + orderId });
        sendSms(phone, 'Your order is ready to be shipped', function(message){
          
        });
        res.sendStatus(200);
      }
    });
  },

  doneInProgress: function(req, res, next){
    var orderId = req.body.orderId;
    var phone = req.body.phone;

    jobModel.updateOrderStatus('inProgress', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        io.to(orderId).emit('doneInProgress', { message: "Your order is on route " + orderId });
        sendSms(phone, 'Your order is on route', function(message){
          
        });

        res.sendStatus(200);
      }
    });

  },
  
  doneOntheWay: function(req, res, next){
    var orderId = req.body.orderId;
    var phone = req.body.phone;

    jobModel.updateOrderStatus('delivered', orderId, function(err){
      if (err){
        console.log('error from controller', err);
        req.sendStatus(400);
      } else {
        io.to(orderId).emit('doneOntheWay', { message: "Your order was delivered, Thanks for using FastBasket " + orderId });
        sendSms(phone, 'Your order was delivered, Thanks for using FastBasket', function(message){
          
        });

        res.sendStatus(200);
      }
    });

  }
};