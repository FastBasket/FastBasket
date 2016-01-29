var productModel = require('../models/productModel');
var elastic = require('../elastic');

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
    var textToSearch = req.params.text + "*~";
    elastic.search({
      type:'products',
      q: textToSearch,
      size: 5
    })
    .then(function(body){
      var result = [];
      for (var i=0; i<body.hits.hits.length; i++){
        result.push(body.hits.hits[i]._source);
      }

      //=========== appending categories =================
      elastic.search({ type:'categories', q: textToSearch, size: 2 })
        .then(function(body){
          var resultCategory = [];
          for (var i=0; i<body.hits.hits.length; i++){
            resultCategory.push(body.hits.hits[i]._source);
          }

          console.log(resultCategory);
          result = resultCategory.concat(result);
          
          res.status(200).json(result);
        },
        function (err) {
          console.log(err);
          res.sendStatus(400);
        });
      //========== appending categories ==================
    },
    function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },

  searchCategories: function(req, res, next){
    var textToSearch = req.params.text + "*~";
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
    var textToSearch = req.params.text + "*~";
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
  }

};