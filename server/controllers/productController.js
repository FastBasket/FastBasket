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
    var textToSearch = req.params.text + "~";
    elastic.search({q: textToSearch})
      .then(function(body){
        res.status(200).json(body.hits.hits);
      },
      function (err) {
        console.log(err);
        res.sendStatus(400);
      });
  }
};