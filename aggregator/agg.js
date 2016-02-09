var amqp = require('amqplib/callback_api');

storage = {};

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q_in = 'q_in';
    var q_out = 'q_out';

    ch.assertQueue(q_in, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q_in);
    ch.assertQueue(q_out, {durable: true});
    console.log(" [*] Established connection with %s. To exit press CTRL+C", q_out);


    ch.prefetch(1);


    ch.consume(q_in, function(msg) {

      console.log(" [x] Received %s", msg.content.toString());

      /////////////////////
      job = JSON.parse(msg.content.toString());
      storeid = job.storeId;


      storage[storeid] ? storage[storeid].push(job) : storage[storeid] = [job];
      if(storage[storeid].length > 1){
        var batch = JSON.stringify(storage[storeid]);
        ch.sendToQueue(q_out, new Buffer(batch), {persistent: true});
        console.log(" [x] Sent '%s'", batch);
        delete storage[storeid];
      }

      console.log(" [x] Done");
      ch.ack(msg);
    }, {noAck: false});
  });
});
