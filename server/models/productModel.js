var db = require('../db/db');

module.exports = {

  checkout: function(request, callback){
    var orderParams = [request.userId, request.shippingAddress, request. total, 'pending'];
    db.one('Insert into Orders(UserId, ShippingAddress, Total, Status) ' +
            ' Values ($1, $2, $3, $4) returning id', orderParams)
    .then(function(orderInserted){

      var oderDetailParams = [orderInserted.id];
      var strQuery = "";
      for (var i=0; i<request.productIds.length; i++){
        oderDetailParams.push(request.productIds[i]);
        strQuery += "$" + (i+2) + ",";
      }
      strQuery = strQuery.slice(0, -1);

      db.none('Insert into OrderDetails(OrderId, ProductId) ' +
              ' Select $1, id from Products where id in (' + strQuery + '); ', oderDetailParams)
      .then(function(){
        callback(null, orderInserted);
      });
    })
    .catch(function(error){
      callback(error, null);
    });
  },

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