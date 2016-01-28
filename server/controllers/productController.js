var productModel = require('../models/productModel');
var elastic = require('../elastic');
var redis = require('redis').createClient();

module.exports = {
  getProducts: function(req, res, next){
    productModel.getProducts(function(err, products){
      if (err){
        res.sendStatus(400);
      } else {
        res.status(200).json(products);
      }
    });
  },

  search: function(req, res, next){
    var textToSearch = req.params.text + "~";
    elastic.search({ type:'products', q: textToSearch, size: 5 })
      .then(function(body){
        var result = [];
        for (var i=0; i<body.hits.hits.length; i++){
          result.push(body.hits.hits[i]._source);
        }
        res.status(200).json(result);
      },
      function (err) {
        console.log(err);
        res.sendStatus(400);
      });
  },

  searchCategories: function(req, res, next){
    var textToSearch = req.params.text + "~";
    elastic.search({ type:'categories', q: textToSearch, size: 2 })
      .then(function(body){
        var result = [];
        for (var i=0; i<body.hits.hits.length; i++){
          result.push(body.hits.hits[i]._source);
        }
        res.status(200).json(result);
      },
      function (err) {
        console.log(err);
        res.sendStatus(400);
      });
  },

  showResults: function(req, res, next){
    var textToSearch = req.params.text + "~";
    elastic.search({ type:'products', q: textToSearch })
      .then(function(body){
        var result = [];
        for (var i=0; i<body.hits.hits.length; i++){
          result.push(body.hits.hits[i]._source);
        }
        res.status(200).json(result);
      },
      function (err) {
        console.log(err);
        res.sendStatus(400);
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