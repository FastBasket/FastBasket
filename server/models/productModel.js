var db = require('../db/db');

module.exports = {

  checkout: function(request, callback){
    var orderParams = [request.userId, request.shippingAddress, request. total, 'pending', request.storeId, request.x, request.y];
    db.one('Insert into Orders(UserId, ShippingAddress, Total, Status, StoreId, ShippingAddressPoint) ' +
            ' Values ($1, $2, $3, $4, $5, point($6, $7)) returning id', orderParams)
    .then(function(orderInserted){

      var oderDetailParams = [orderInserted.id];
      var strQuery = "";
      for (var i=0; i<request.productIds.length; i++){
        oderDetailParams.push(request.productIds[i]);
        strQuery += "$" + (i+2) + ",";
      }
      strQuery = strQuery.slice(0, -1);

      db.none('Insert into OrderDetails(OrderId, ProductId, price) ' +
              ' Select $1, id, price from Products where id in (' + strQuery + '); ', oderDetailParams)
      .then(function(){

        db.none('update users set name = $1, phone = $2, email = $3, address = $4, city = $5, state = $6, zipcode = $7, DriverInstructions = $8 where id = $9',
          [request.user.name, request.user.phone, request.user.email, request.user.address, request.user.city, request.user.state, request.user.zipcode, request.user.driverinstructions, request.userId])
        .then(function(){
          callback(null, orderInserted);
        });

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