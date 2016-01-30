var jobModel = require('../../server/models/jobModel');


module.exports = function (app, express, io, amqp) {

  io.on('connection', function(socket){
    console.log('a driver connected');

    socket.on('request', function(userId){
      console.log('driver selected, picking up items');

      amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
          var q = 'task_queue';

         ch.assertQueue(q, {durable: true});
         ch.prefetch(1);
         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
         ch.get(q, {noAck:true},function(err, order) {
      
          //when q is empty it returns order = false

          if (err){
            console.log(err);
          };

          var fetchedJob = order.content.toString();
          var fetchedJobParse = JSON.parse(fetchedJob);

          //TESTING
          fetchedJobParse = [{orderId:1},{orderId:2},{orderId:3}]
          
          //create job  fsdvsdv
          var newJob = {
            userId : userId,
            status: false
          };

          jobModel.createJob(newJob, function(err, jobCreated){
            if (err){
              console.log('err',err);
            } else {
              console.log('jobCreated!:', jobCreated);

              for (var i = 0; i < fetchedJobParse.length; i++){
                //using the current orderID, updated order with JobID
                jobModel.updateOrder(fetchedJobParse[i]["orderId"], jobCreated.id, function(orderUpdated){
                    if (err){
                      console.log('err',err);
                    } else {
                      console.log('orderUpdated!:', orderUpdated);
                    }
                })
              }
            }
          });

          //add jobId to every order in the new Job
   
            console.log(" [x] Received %s", fetchedJob);
            console.log(" [x] Done", fetchedJob);
            socket.emit('dequeue', fetchedJob);
            
            conn.close()
       
         }, {noAck:false});
        });
        // dequeue and send job to driver

      });
  });
  });
};
