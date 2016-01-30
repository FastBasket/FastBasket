var db = require('../db/db');
module.exports = {
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
        console.log("HERE is the job", job);
        
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
  }
 
}


