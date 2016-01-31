var db = require('../db/db');
module.exports = {
  
  updateJobStatus: function(jobId, callback){
    db.query('UPDATE jobs SET status = $1 where id = $2', [true, jobId])
      .then(function(){
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
		//creates a new job
		console.log("INSERTING A NEW JOB:", jobToInsert);
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
    db.query('select * from jobs where UserId = $1 AND status = false', [userId])
      .then(function(job){
        var result;
        
        if (job.length > 0){
          var jobId;
          result = job[0];
          jobId = result.id;

          callback(null, result);
        }else{  
          callback(null,null);
        }

      })
      .catch(function (err) {
        console.log('err when getting job',err)
      })
  },

  getOrders: function(orderIds, callback){
    var orders = [];
    var params = [];
    var strQuery = "";
    for (var i=0; i<orderIds.length; i++){
      params.push(orderIds[i]);
      strQuery += "$" + (i+1) + ",";
    }
    strQuery = strQuery.slice(0, -1);
    db.query('Select * from Orders where id in (' + strQuery + ')', params)
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
      callback(null, orders);
    });
  }
 
};


