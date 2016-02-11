var db = require('../db/db');

module.exports = {
  getOrderStatus: function(orderId, callback){
    db.one('Select * from Orders where id = $1', orderId)
    .then(function(order){
      callback(order.status);
    });
  },

  getDashboardOrders: function(callback){
    db.query("Select o.*, d.id as driverId, d.name as drivername, u.id as userid, u.name as username, j.status as jobstatus, u.picture as user_picture " +
              "from Orders as o " +
              "left join Jobs as j on j.id = o.jobid " +
              "left join Users as d on j.userid = d.id " +
              "left join Users as u on o.userid = u.id " +
              "Where o.status in ('pending', 'ready', 'inProgress') or (o.status = 'delivered' and o.orderdate > now() - interval '24 hour')")
    .then(function(orders){
      callback(orders);
    });
  },

  getOrderInfo: function(orderId, callback){
    db.query("Select o.*, d.id as driverId, d.name as drivername, u.id as userid, u.name as username, j.status as jobstatus, u.picture as user_picture " +
              "from Orders as o " +
              "left join Jobs as j on j.id = o.jobid " +
              "left join Users as d on j.userid = d.id " +
              "left join Users as u on o.userid = u.id " +
              "where o.id = $1", [orderId])
    .then(function(order){
      if (order.length > 0){
        callback(order[0]);
      } else {
        callback(order);
      }
    });
  },

  //------------------ Dashborad stats ---------------------------------------------------------------

  getStoreStats: function(callback){
    db.tx(function (t) {
        return t.batch([
            t.query("SELECT categories.name as category, count(*) as mostPopularCategories " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "INNER JOIN categories ON categories.id = products.subcategory " +
                      "GROUP BY categories.name " +
                      "ORDER BY count(categories.name) desc limit 5"),
            t.query("SELECT products.name, count(*) as mostSoldItems " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "GROUP BY products.name " +
                      "ORDER BY count(products.name) desc limit 10"),
            t.query("SELECT count(*) as totalItemsSold FROM OrderDetails"),
            t.query("SELECT count(*) as totalOrders FROM orders"),
            t.query("SELECT sum(total) as totalSales FROM orders"),
            t.query("SELECT products.name , sum(products.price) as rankHighestRevenueProduct " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "GROUP BY products.name " +
                      "ORDER BY sum(products.price) desc limit 10"),
            t.query("SELECT count (orderDetails.id) * 1.0 / count( distinct orders.id ) as avgOrderSize " +
                      "FROM OrderDetails " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id"),
            t.query("SELECT avg(total) as avgOrderSales FROM orders"),
            t.query("SELECT categories.name as category, count(*) as mostPopularCategories, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "INNER JOIN categories ON categories.id = products.subcategory " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY categories.name, timestamp " +
                      "ORDER BY timestamp ASC, count(*) desc limit 50"),
            t.query("SELECT products.name, count(*) as MostSoldItemsPerHour, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY products.name, timestamp " +
                      "ORDER BY timestamp ASC, count(*) desc limit 100"),
            t.query("SELECT categories.name, sum(products.price) as highestRevenueCategoryPerHour , date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "INNER JOIN categories ON categories.id = products.subcategory " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY categories.name , timestamp " +
                      "ORDER BY timestamp ASC, sum(products.price) desc limit 100"),
            t.query("SELECT products.name , sum(products.price) as highestRevenueItemPerHour , date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails " +
                      "INNER JOIN products ON orderDetails.ProductId = products.Id " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY products.name, timestamp " +
                      "ORDER BY timestamp ASC, sum(products.price) desc limit 100"),
            t.query("SELECT count (orderDetails.id) * 1.0 / count( distinct orders.id ) as avgOrderSizePerHour, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails  " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY timestamp Order By timestamp ASC"),
            t.query("SELECT avg(total) as avgOrderSales, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM orders " +
                      "GROUP BY timestamp Order By timestamp ASC"),
            t.query("SELECT count(*) as totalItemsSoldPerHour, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM OrderDetails " +
                      "INNER JOIN orders ON orderDetails.orderId = orders.Id " +
                      "GROUP BY timestamp Order By timestamp ASC"),
            t.query("SELECT count(*) as totalOrdersPerHour, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM orders " +
                      "GROUP BY timestamp Order By timestamp ASC"),
            t.query("SELECT sum(total) as totalSalesPerHour, date_trunc('hour',orders.orderdate) as timestamp " +
                      "FROM orders " +
                      "GROUP BY timestamp Order By timestamp ASC")
        ]);
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      callback(error, null);
    });
  }
};
