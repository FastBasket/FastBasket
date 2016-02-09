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
  },

  mostPopularCategories: function(callback){
    db.query("SELECT categories.name as category, count(*) \
              FROM OrderDetails \
              INNER JOIN products ON orderDetails.ProductId = products.Id \
              INNER JOIN categories ON categories.id = products.subcategory \
              GROUP BY categories.name \
              ORDER BY count(categories.name) desc limit 10")
    .then(function(result){
      callback(result);
    });
  },

  mostSoldItems: function(callback){
    db.query("SELECT products.name, count(*) \
              FROM OrderDetails \
              INNER JOIN products ON orderDetails.ProductId = products.Id \
              GROUP BY products.name \
              ORDER BY count(products.name) desc limit 10")
    .then(function(result){
      callback(result);
    });
  },

  totalItemsSold: function(callback){
    db.query("SELECT count(*) FROM OrderDetails")
    .then(function(result){
      callback(result);
    });
  },

  totalOrders: function(callback){
    db.query("SELECT count(*) FROM orders")
    .then(function(result){
      callback(result);
    });
  },

  totalSales: function(callback){
    db.query("SELECT sum(total) FROM orders")
    .then(function(result){
      callback(result);
    });
  },

  rankHighestRevenueProduct: function(callback){
      db.query("SELECT products.name , sum(products.price) \
                FROM OrderDetails \
                INNER JOIN products ON orderDetails.ProductId = products.Id \
                GROUP BY products.name \
                ORDER BY sum(products.price) desc limit 10")
      .then(function(result){
        callback(result);
      });
    },

  avgOrderSize: function(callback){
    db.query("SELECT count (orderDetails.id) * 1.0 / count( distinct orders.id ) \
              FROM OrderDetails \
              INNER JOIN orders ON orderDetails.orderId = orders.Id")
    .then(function(result){
      callback(result);
    });
  },

  avgOrderSales: function(callback){
    db.query("SELECT avg(total) FROM orders")
    .then(function(result){
      callback(result);
    });
  },

};