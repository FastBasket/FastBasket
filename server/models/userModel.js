var db = require('../db/db');

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
      return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
      return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
      return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
      return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
      return interval + " minutes ago";
  }
  if (seconds < 5){
    return "just now";
  }
  return Math.floor(seconds) + " seconds ago";
}

module.exports = {

  getUsers: function(callback){
    db.query('Select * from Users')
      .then(function(users){
        callback(null, users);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

  insertUser: function(userToInsert, callback){
    var parameters = [userToInsert.name || "", userToInsert.email || "", userToInsert.facebookid || "", userToInsert.zipcode || "", userToInsert.address || "", userToInsert.phone || "", userToInsert.picture || "", true];
    db.one("insert into users(name, email, facebookid, zipcode, address, phone, picture, active) values($1, $2, $3, $4, $5, $6, $7, $8) returning id",
      parameters) .then(function (newUser) {
          callback(null, newUser);
      })
      .catch(function (error) {
          console.log('error',error);
          callback(error, null);
      });
  },

  findByFacebookId: function(facebookid, callback){
    db.one('Select * from Users where facebookid = $1', [facebookid])
      .then(function(user){
        callback(null, user);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

  getUserProfile: function(userId, callback){
    //query for db for orders ids and orderdetails for products 
    db.query('select * from OrderDetails INNER JOIN products on orderDetails.ProductId = products.Id INNER JOIN orders ON orders.id = orderDetails.OrderId', function(err, res){
    callback(err, res);
    } );
  },

  updateUser: function(user, callback){
    db.none('update users set name = $1, phone = $2, email = $3, address = $4, city = $5, state = $6, zipcode = $7, DriverInstructions = $8 where id = $9',
      [user.name, user.phone, user.email, user.address, user.city, user.state, user.zipcode, user.driverinstructions, user.id])
    .then(function(){
      callback(null, true);
    })
    .catch(function(error){
      callback(error, null);
    });
  },

  getOrders: function(userId, callback){
    db.query('Select o.id, o.shippingaddress, o.total, o.status, o.orderdate,  od.orderid, od.price, p.name, c1.name as category, c2.name as subCategory, p.id as productid \
      from Orders as o \
      inner join OrderDetails as od on o.id = od.orderid \
      inner join Products as p on p.id = od.productid \
      inner join Categories as c1 on c1.id = p.category \
      inner join Categories as c2 on c2.id = p.subcategory \
      where userId = $1 \
      Order by id desc ', [userId])
    .then(function(orders){
      var orderObject = {};

      for (var i=0; i<orders.length; i++){
        if (orders[i].id in orderObject){
          orderObject[orders[i].id].orderdetails.push({
              name: orders[i].name,
              price: orders[i].price,
              category: orders[i].category,
              subCategory: orders[i].subcategory,
              dbId: orders[i].productid
            });
        } else {
          orderObject[orders[i].id] = {
            id: orders[i].id,
            shippingaddress: orders[i].shippingaddress,
            total: orders[i].total,
            status: orders[i].status,
            orderdate: timeSince(new Date(orders[i].orderdate)),
            orderdetails: [{
              name: orders[i].name,
              price: orders[i].price,
              category: orders[i].category,
              subCategory: orders[i].subcategory,
              dbId: orders[i].productid
            }]
          };
        }
      }

      var result = [];
      for (var key in orderObject){
        result.push(orderObject[key]);
      }

      callback(null, result);
    })
    .catch(function(error){
      console.log(error);
      callback(error, null);
    });
  }

};
