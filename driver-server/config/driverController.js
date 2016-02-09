var jobModel = require('../../server/models/jobModel');
var orderModel = require('../../server/models/orderModel');


module.exports = function (app, express, io, amqp) {

  io.on('connection', function(socket){
    console.log('a driver connected');

    socket.on('request', function(userId){
      console.log('driver selected, picking up items');

      amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
          var q = 'task_queue';
         console.log('-----------------------------------------------------------');
         ch.assertQueue(q, {durable: true});
         ch.prefetch(1);
         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
         ch.get(q, {noAck:true},function(err, order) {
          if (err){
            console.log(err);
          }
          if (order && order.content){
            console.log('order.content',order.content.toString());

            var fetchedJob = order.content.toString();
            var fetchedJobParse = JSON.parse(fetchedJob);
            var arrayOfOrderId = fetchedJobParse.data;

            var newJob = {
              userId : userId,
              status: false
            };

            if (arrayOfOrderId.length === 0){
              console.log('empty array');
              socket.emit('dequeue', false);
            } else {
              jobModel.createJob(newJob, function(err, jobCreated){
                if (err){
                  console.log('err',err);
                } else {
                  console.log('jobCreated!:', jobCreated);

                  arrayOfOrderId.forEach(function(item){
                    jobModel.updateOrder(item.id, jobCreated.id, function(orderUpdated){
                      if (err){
                        console.log('err',err);
                      }
                    });
                  });

                  console.log(" [x] Received %s", fetchedJob);
                  console.log(" [x] Done", fetchedJob);
                  socket.emit('dequeue', { orders: fetchedJobParse.data, jobId: jobCreated.id });
                }
              });

            }
          } else{
            console.log('no jobs in queue');
            socket.emit('dequeue', false);
          }

          conn.close();
         }, {noAck:false});

        });
      });
  });
  });
};
