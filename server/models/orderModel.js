var db = require('../db/db');

module.exports = {
  getOrderStatus: function(orderId, callback){
    db.one('Select * from Orders where id = $1', orderId)
    .then(function(order){
      callback(order.status);
    });
  },

  getDashboardOrders: function(callback){
    db.query("Select o.*, d.id as driverId, d.name as drivername, u.id as userid, u.name as username, j.status as jobstatus, u.picture as user_picture \
              from Orders as o \
              left join Jobs as j on j.id = o.jobid \
              left join Users as d on j.userid = d.id \
              left join Users as u on o.userid = u.id \
              Where o.status in ('pending', 'ready', 'inProgress') or (o.status = 'delivered' and o.orderdate > now() - interval '24 hour')")
    .then(function(orders){
      callback(orders);
    });
  },

  getOrderInfo: function(orderId, callback){
    db.query("Select o.*, d.id as driverId, d.name as drivername, u.id as userid, u.name as username, j.status as jobstatus, u.picture as user_picture \
              from Orders as o \
              left join Jobs as j on j.id = o.jobid \
              left join Users as d on j.userid = d.id \
              left join Users as u on o.userid = u.id \
              where o.id = $1", [orderId])
    .then(function(order){
      if (order.length > 0){
        callback(order[0]);
      } else {
        callback(order);
      }
    });
  }

};