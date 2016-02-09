var db = require('../db/db');
var redis = require('redis');

var client = redis.createClient();


module.exports = {

  updateJobStatus: function(jobId, userId,callback){
    db.query('UPDATE jobs SET status = $1 where id = $2', [true, jobId])
      .then(function(){

        var newKeyUserId = "driver" + JSON.stringify(userId);
        var value = JSON.stringify(false);

        client.set(newKeyUserId,value);

        callback();
      })
      .catch(function(error){
        callback(error);
      });
  },

  updateOrderStatus: function(status, orderId, callback){
    db.query('UPDATE orders SET status = $1 where id = $2', [status, orderId])
      .then(function(){
        callback();
      })
      .catch(function(error){
        callback(error);
      });
  },

	createJob: function(jobToInsert, callback){
		var parameters = [jobToInsert.status,jobToInsert.userId];

      db.one("insert into Jobs(status, userId) values($1, $2) returning id", parameters)
      .then(function (newJobId) {
        callback(null, newJobId);
      })
      .catch(function (error) {
          console.log('error',error);
          callback(error, null);
      });
  },

  updateOrder : function(orderToUpdate, jobId, callback){
    db.query('UPDATE orders SET jobId = $1 where id = $2', [jobId, orderToUpdate])
      .then(function(user){
        callback(null, user);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

  getJob : function(userId,callback){
    var redisKey = "driver" + JSON.stringify(userId);

    client.get(redisKey, function(err, res){
      callback(null,res);
    });
  },

  getOrders: function(orderIds, userId, callback){
    var orders = [];
    var params = [];
    var strQuery = "";
    for (var i=0; i<orderIds.length; i++){
      params.push(orderIds[i]);
      strQuery += "$" + (i+1) + ",";
    }
    strQuery = strQuery.slice(0, -1);
    db.query('Select o.*, u.name, u.picture, u.phone, u.driverinstructions from Orders as o inner join Users as u on u.id = o.userId where o.id in (' + strQuery + ')', params)
    .then(function(ordersRes){
      orders = ordersRes;
      return db.query('Select p.name, p.price, p.size, od.orderid from OrderDetails as od inner join products as p on p.id = od.productId where orderId in ('+ strQuery +')', params);
    })
    .then(function(orderDetails){
      for (var i=0; i<orders.length; i++){
        orders[i].orderDetails = [];
        for (var j=0; j<orderDetails.length; j++){
          if (orderDetails[j].orderid === orders[i].id){
            orders[i].orderDetails.push(orderDetails[j]);
          }
        }
      }

      var redisKeyUserId = "driver" + JSON.stringify(userId);
      var redisValueUsersJob = JSON.stringify(orders);
      client.set(redisKeyUserId,redisValueUsersJob);

      callback(null, orders);
    });
  }

};
