var productModel = require('../models/productModel');
var redis = require('redis').createClient();
var constants = require('../config/constants');
var stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

module.exports = {
  
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
        res.sendStatus(204);
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
            redis.publish('jobs', redisRes);
          }
          res.status(200).json(order);
        });
      }
    });
  }
};
