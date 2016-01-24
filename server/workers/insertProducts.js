var productModel = require('../models/productModel');
var elastic = require('../elastic');

productModel.getProducts(function(err, products){
  if (err){
    console.log(err);
  } else {
    var bulkBody = [];
    products.forEach(function(product){
      bulkBody.push({index: { _index: 'elastic_products', _type: 'products', _id: product.id }});
      bulkBody.push({ name: product.name, price: product.price, category: product.categoryname, subCategory: product.subcategoryname, dbId: product.id });
    });

    elastic.bulk({
      body: bulkBody
    } , function (err, resp) {
      if (err){
        console.log('ERROR', err);
      } else {
        console.log(resp);
      }
    });
  }
});