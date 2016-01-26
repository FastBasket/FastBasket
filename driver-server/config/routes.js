module.exports = function (app, express, io, amqp) {

  io.on('connection', function(socket){
    console.log('a driver connected');

    socket.on('request', function(msg){
      console.log('driver selected, picking up items');

      amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
          var q = 'task_queue';

         ch.assertQueue(q, {durable: true});
         ch.prefetch(1);
         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
         ch.consume(q, function(order) {

           // send job
          console.log(" [x] Received %s", order);
          setTimeout(function() {
            console.log(" [x] Done");
            socket.emit('dequeue', JSON.parse(order.content.toString()))
            // ch.ack(order);
            // conn.close()
          }, 1000);
         });
        });
        // dequeue and send job to driver

      });

    socket.on('arriving', function(msg){
      console.log('driver arriving');
    });

    socket.on('shipped', function(msg){
      console.log('order complete');
    });
  });



    // socket.on('disconnect', function(){
    //   console.log('driver disconnected');
    //
    //   // need to consider reconnections on incomplete orders
    // });
  });
};
