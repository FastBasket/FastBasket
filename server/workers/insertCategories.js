var productModel = require('../models/productModel');
var elastic = require('../elastic');

productModel.getCategories(function(err, categories){
  if (err){
    console.log(err);
  } else {
    var bulkBody = [];
    categories.forEach(function(category){
      bulkBody.push({index: { _index: 'elastic_products', _type: 'categories', _id: category.id }});
      bulkBody.push({ name: category.name, dbId: category.id });
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