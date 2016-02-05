var productModel = require('../models/productModel');
var elastic = require('../elastic');
var redis = require('redis').createClient();
var neo4j = require('neo4j');
var neo = new neo4j.GraphDatabase('http://neo4j:fastbasket@127.0.0.1:7474');
var _ = require('underscore');


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
          return obj['name'].split(' ').concat(obj.subCategory.split(' '));

        })), function(word){
          return word.toLowerCase();
        });
        var cypherquery = 'match (a)-[r:Contains]->(b) \
        where b.name in {basket} \
        with a, count(r) as count order by count desc limit 100 \
        match (a)-[s:Contains]->(d) where not d.name in {basket} \
        return d, count(s) as count order by count desc limit 7';

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
    elastic.search({
      type: 'products',
      body: {
        query: {
          bool: {
            should: [
              {
                match_phrase: {
                  name: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              },
              {
                match_phrase: {
                  category: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              },
              {
                match_phrase: {
                  subCategory: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              }
            ]
          }
        }
      },
      size: 5
    })
    .then(function(body){
      var result = [];
      for (var i=0; i<body.hits.hits.length; i++){
        result.push(body.hits.hits[i]._source);
      }

      // //=========== appending categories =================
      elastic.search({
        type:'categories',
        body: {
          query: {
            bool: {
              should: [
                {
                  match_phrase: {
                    name: {
                      query: textToSearch,
                      fuzziness: 10,
                      prefix_length: 1
                    }
                  }
                }
              ]
            }
          }
        },
        size: 2 })
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
  },

  showResults: function(req, res, next){
    var textToSearch = req.params.text;
    elastic.search({
      type: 'products',
      body: {
        query: {
          bool: {
            should: [
              {
                match_phrase: {
                  name: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              },
              {
                match_phrase: {
                  category: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              },
              {
                match_phrase: {
                  subCategory: {
                    query: textToSearch,
                    fuzziness: 10,
                    prefix_length: 1
                  }
                }
              }
            ]
          }
        }
      },
      size: 100
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
  }

};