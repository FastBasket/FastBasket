var db = require('../db/db');

module.exports = {

  getProducts: function(callback){
    db.query('Select p.*, c.name as categoryName, c2.name as subCategoryName ' +
      ' from Products as p ' +
        ' inner join Categories as c on p.category = c.id ' +
        ' inner join Categories as c2 on p.subcategory = c2.id '
      )
      .then(function(products){
        callback(null, products);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

  getCategories: function(callback){
    db.query("Select * from Categories")
    .then(function(categories){
      callback(null, categories);
    })
    .catch(function(error){
      callback(error, null);
    });
  }
};