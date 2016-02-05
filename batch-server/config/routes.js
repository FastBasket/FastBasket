var amqp = require('amqplib/callback_api');
var kmeans = require('./kmeans.js');

module.exports = function (app, redis) {
  redis.on("message", function (channel, message) {
    console.log("client1 channel " + channel + ": " + message);

    message = JSON.parse(message);
    if (message.len > 2) {
      redis.unsubscribe();
      redis.lrange(message.storeId, 0, 9, function(err, reply){
        redis.ltrim('1', 10, -1);
        console.log(reply);

        var data = reply.map(function(ele){
          return JSON.parse(ele);
        });

        // process data
          // grab from postgres

          var buckets = kmeans(data ,4 , 10);

          // queue up
          amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
              var q = 'task_queue';
                for(var key in buckets){

                  if(buckets[key].length > 0){
                    var msg = JSON.stringify({data: buckets[key]});

                    ch.assertQueue(q, {durable: true});
                    ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                    console.log(" [x] Sent '%s'", msg);
                  }
                }
            });
            setTimeout(function() { conn.close(); }, 500);
          });

          redis.subscribe("jobs");
      });
    }
  });
};
