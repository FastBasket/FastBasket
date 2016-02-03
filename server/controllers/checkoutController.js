var productModel = require('../models/productModel');
var orderModel = require('../models/orderModel');
var redis = require('redis').createClient();
var constants = require('../config/constants');
var stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

module.exports = {

  getOrderStatus: function(req, res, next){
    var orderId = req.params.orderId;
    orderModel.getOrderStatus(orderId, function(status){
      res.status(200).json(status);
    });
  },
  
  charge: function(req, res, next){
    var stripeToken = req.body.stripeToken;
    var amount = req.body.amount;

    stripe.charges.create({
      card: stripeToken,
      currency: 'usd',
      amount: amount
    },
    function(err, charge) {
      if (err) {
        console.log(err);
        res.sendStatus(500, err);
      } else {
        //TODO: update Order table status as paid
        res.sendStatus(202);
      }
    });
  },

  checkout: function(req, res, next){
    var request = req.body;
    productModel.checkout(request, function(err, order){
      if (err){
        console.log(err);
        res.sendStatus(400);
      } else {
        redis.rpush(request.storeId, JSON.stringify({ x: request.x, y: request.y, id: order.id }), function(err, redisRes){
          if (err){
            console.log('error from redis', err);
          } else {
            redis.publish('jobs', JSON.stringify({ len: redisRes, storeId: request.storeId }));
          }
          res.status(200).json(order);
        });
      }
    });
  }
};
