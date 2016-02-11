var db = require('../db/db');
var io = require('../server.js').io;
var orderModel = require('./orderModel');
var redis = require('redis').createClient();

module.exports = {

  checkout: function(request, callback){
    var orderParams = [request.userId, request.shippingAddress, request.total, 'pending', request.storeId, request.x, request.y];

    //insert master order table
    db.one('Insert into Orders(UserId, ShippingAddress, Total, Status, StoreId, ShippingAddressPoint) ' +
            ' Values ($1, $2, $3, $4, $5, point($6, $7)) returning id', orderParams)
    .then(function(orderInserted){

      //build array of productIds for SQL Insertion
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

        //update user information for future purchases
        db.none('update users set name = $1, phone = $2, email = $3, address = $4, city = $5, state = $6, zipcode = $7, DriverInstructions = $8 where id = $9',
          [request.user.name, request.user.phone, request.user.email, request.user.address, request.user.city, request.user.state, request.user.zipcode, request.user.driverinstructions, request.userId])
        .then(function(){

          //get order info to be sent to the store dashboard
          orderModel.getOrderInfo(orderInserted.id, function(order){
            io.to('store_chanel').emit('new_order', order);

            //save in redis order history of productIds
            redis.sadd(request.userId + '_orderhistory', request.productIds, function(err, redisRes){
              callback(null, orderInserted);
            });

          });

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
