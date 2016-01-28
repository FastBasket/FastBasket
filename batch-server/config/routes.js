var amqp = require('amqplib/callback_api');

module.exports = function (app, redis) {
  redis.on("message", function (channel, message) {
    console.log("client1 channel " + channel + ": " + message);
    if (message === '6') {
      // empty redis
      redis.unsubscribe();


      redis.lrange('number', 0, 9, function(err, reply){
        redis.ltrim('number', 10, -1)
        console.log(reply)


        data = reply.map(function(ele){
          return JSON.parse(ele)
        })
        // process data
          // grab from postgres

          buckets = kmeans(data ,5)

          // queue up
          amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
              var q = 'task_queue';
                for(var key in buckets){
                  var msg = JSON.stringify({data: buckets[key]});

                  ch.assertQueue(q, {durable: true});
                  ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                  console.log(" [x] Sent '%s'", msg);
                }
            });
            setTimeout(function() { conn.close(); }, 500);
          });

          redis.subscribe("jobs");
      });
    }
  });
};
