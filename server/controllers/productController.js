var productModel = require('../models/productModel');
var elastic = require('../elastic');
var redis = require('redis').createClient();
var neo4j = require('neo4j');
var neo = new neo4j.GraphDatabase('http://neo4j:fastbasket@127.0.0.1:7474');
var _ = require('underscore');

var getProductHistoryOfUserId = function(userId, callback){
  redis.smembers(userId + '_orderhistory', function(err, reply) {
    var orderhistory = [];

    if (!err){
      orderhistory = reply;
    }

    callback(orderhistory);
  });
};

module.exports = {
  getRecommendations: function(req, res, next){
    var userId = req.body.userId;

    redis.get(userId + "recom", function(err, redisRes){
      if (err) {
        res.status(200).json(false);
      } else {
        res.status(200).json(redisRes);
      }
    });
  },

  getShoppingCart: function(req, res, next){
    var userId = req.body.userId;

    redis.get(userId + "cart", function(err, redisRes){
      if (err) {
        res.status(200).json(false);
      } else {
        res.status(200).json(redisRes);
      }
    });
  },

  setShoppingCart: function(req, res, next){
    var userId = req.body.userId;
    var cart = JSON.stringify(req.body.cart);

    redis.set(userId + "cart", cart, function(err, redisRes){
      if (err) {
        res.sendStatus(400);
      } else {
        //split json data
        terms = _.map(_.flatten(_.map(req.body.cart, function(obj){
          return obj.name.split(' ').concat(obj.subCategory.split(' '));
        })), function(word){
          return word.toLowerCase();
        });

        var cypherquery =
  	    'match (a)-[z:Contains]->(b) ' +
          'where b.name in {basket} with a, count(z) as count1 ' +
  	    'match (a)-[y:Contains]->(c) ' +
          'with a, count1, count1*100/count(y) as tf order by tf desc limit 1000 ' +
  	    'match (a)-[x:Contains]->(d) ' +
          'where not d.name in {basket} with d, count(x) as count2 order by count2 desc limit 250 ' +
          'where count2 > 1 ' +
  	    'match (e)-[w:Contains]->(d) ' +
    	    'return d, count2*100/count(w) as idf order by idf desc limit 5 ';

        neo.cypher({
            query: cypherquery,
            params: {
                basket: terms,
            }
        },function (err, results) {
          if(err){
            console.log(err);
            res.sendStatus(400);
          } else {
            if (results.length > 0) {
              redis.set(userId + "recom", JSON.stringify(results.map(function(obj){ return obj.d.properties.name; })) , function(err, redisRecRes){
                res.status(200).json(results);
              });
            } else {
              res.status(200).json(results);
            }
          }
        });
      }
    });
  },

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
    var textToSearch = req.params.text;
    var userId = req.params.userId;

    getProductHistoryOfUserId(userId, function(orderHistory){
      elastic.search({
        index: 'elastic_products',
        type: 'products',
        body: {
          size: 5,
          query: {
            bool: {
              should: [
                {
                  function_score: {
                    query: {
                      match: {
                        _all: textToSearch
                      }
                    },
                    functions: [{
                      filter: { terms: { dbId: orderHistory }},
                      weight: 10
                    }]
                  }
                },
                {
                  match: {
                    _all: {
                      query: textToSearch,
                      fuzziness: 1,
                      prefix_length: 2
                    }
                  }
                }
              ]
            }
          }
        }
      })
      .then(function(body){
        var result = [];
        for (var i=0; i<body.hits.hits.length; i++){
          result.push(body.hits.hits[i]._source);
        }
        // //=========== appending categories =================
        elastic.search({
          index: 'elastic_products',
          type: 'categories',
          body: {
            size: 2,
            query: {
              match: { _all: textToSearch },
            }
          }
        })
        .then(function(body){
          var resultCategory = [];
          for (var i=0; i<body.hits.hits.length; i++){
            resultCategory.push(body.hits.hits[i]._source);
          }
          result = resultCategory.concat(result);

          res.status(200).json(result);
        },
        function (err) {
          console.log(err);
          res.sendStatus(400);
        });
        // //========== appending categories ==================

      },
      function (err) {
        console.log(err);
        res.sendStatus(400);
      });
    });
  },

  showResults: function(req, res, next){
    var textToSearch = req.params.text;
    var userId = req.params.userId;

    getProductHistoryOfUserId(userId, function(orderHistory){
      elastic.search({
        index: 'elastic_products',
        type: 'products',
        body: {
          size: 50,
          query: {
            bool: {
              should: [
                {
                  function_score: {
                    query: {
                      match: {
                        _all: textToSearch
                      }
                    },
                    functions: [{
                      filter: { terms: { dbId: orderHistory }},
                      weight: 10
                    }]
                  }
                },
                {
                  match: {
                    _all: {
                      query: textToSearch,
                      fuzziness: 1,
                      prefix_length: 2
                    }
                  }
                }
              ]
            }
          }
        }
      })
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
    });
  }
};
