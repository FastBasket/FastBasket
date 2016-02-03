var db = require('../db/db');

module.exports = {
  getOrderStatus: function(orderId, callback){
    db.one('Select * from Orders where id = $1', orderId)
    .then(function(order){
      callback(order.status);
    });
  }
};