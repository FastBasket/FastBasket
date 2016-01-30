var amqp = require('amqplib/callback_api');
q = process.argv[2];

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
   ch.assertQueue(q, {durable: true});
   ch.prefetch(1);
   console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
   ch.consume(q, function(order) {
    console.log(" [x] Dumping message %s", order);
      ch.ack(order);
      conn.close();
   });
  });

});
