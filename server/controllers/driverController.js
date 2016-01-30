var io = require('../server.js');
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_TOKEN;
var twilioClient = require('twilio')(accountSid, authToken);

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

    //TODO: get 4158025390 from the request
    io.to(orderId).emit('doneOrderReceived', { message: "done with Order received " + orderId });
    sendSms('4158025390', 'done with Order received', function(message){
      console.log('message sent');
    });

    res.sendStatus(200);
  },

  doneInProgress: function(req, res, next){
    var orderId = req.body.orderId;

    //TODO: get 4158025390 from the request
    io.to(orderId).emit('doneInProgress', { message: "done with In Progress " + orderId });
    sendSms('4158025390', 'done with In Progress', function(message){
      console.log('message sent');
    });

    res.sendStatus(200);
  },
  
  doneOntheWay: function(req, res, next){
    var orderId = req.body.orderId;

    //TODO: get 4158025390 from the request
    io.to(orderId).emit('doneOntheWay', { message: "done with On the Way " + orderId });
    sendSms('4158025390', 'done with On the Way', function(message){
      console.log('message sent');
    });

    res.sendStatus(200);
  }
};