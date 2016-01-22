var db = require('../db/db');

module.exports = {

  getProducts: function(callback){
    db.query('Select * from Products')
      .then(function(products){
        callback(null, products);
      })
      .catch(function(error){
        callback(error, null);
      });
  }

};