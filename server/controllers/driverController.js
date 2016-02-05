var io = require('../server.js');
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_TOKEN;
var twilioClient = require('twilio')(accountSid, authToken);
var jobModel = require('../models/jobModel');
var redis = require('redis').createClient();

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

  },

  updateLocation: function(req, res, next){
    var lat = req.body.lat;
    var lon = req.body.lon;
    var driverId = req.body.driverId;

    if (lat === 0 && lon === 0){
      redis.del(driverId + '_location', function(err){
        if (err){
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      redis.set(driverId + '_location', JSON.stringify({ lat: lat, lon: lon, id: driverId }), function(err, redisRes){
        if (err){
          res.sendStatus(400);
        } else {
          redis.keys('*_location', function(err, keys){
            if (err){
              res.sendStatus(400);
            } else {
              redis.mget(keys, function(err, resValues){
                if (err){
                  res.sendStatus(400);
                } else {
                  console.log(resValues);
                  io.to('store_chanel').emit('updatePositions', resValues);
                  res.sendStatus(200);
                }
              });
            }
          });
        }
      });
    }
  }
};