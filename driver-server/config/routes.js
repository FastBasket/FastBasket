module.exports = function (app, express) {
  io.on('connection', function(socket){
    console.log('a driver connected');

    socket.on('dequeue', function(msg){
      console.log('driver selected, picking up items');

      amqp.connect('amqp://localhost', function(err, conn) {
        var q = 'task_queue';

         ch.assertQueue(q, {durable: true});
         ch.prefetch(1);
         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
         ch.consume(q, function(msg) {
           var secs = msg.content.toString().split('.').length - 1;

           // send job
           console.log(" [x] Received %s", msg.content.toString());
           setTimeout(function() {
             console.log(" [x] Done");
             ch.ack(msg);
           }, secs * 1000);
         }, {noAck: false});
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

    // socket.on('disconnect', function(){
    //   console.log('driver disconnected');
    //
    //   // need to consider reconnections on incomplete orders
    // });
  });
};
