var amqp = require('amqplib/callback_api');




module.exports = function (app, redis) {
  redis.on("message", function (channel, message) {
    console.log("client1 channel " + channel + ": " + message);
    if (message === '6') {
      // empty redis
      redis.unsubscribe()

      redis.lrange('1', 0, 5, function(err, reply){
        redis.ltrim('1', 6, -1)
        console.log(reply)

        // process data
          // grab from postgres
        var buckets = {
          0: [],
          1: [],
          2: []
        }
          // groups of 2
          reply.forEach(function(element, index){
            buckets[index % 3].push(element)
          })

          // queue up
          amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
              var q = 'task_queue';
                for(var key in buckets){
                  var msg = JSON.stringify({data: buckets[key]})

                  ch.assertQueue(q, {durable: true});
                  ch.sendToQueue(q, new Buffer(msg), {persistent: true});
                  console.log(" [x] Sent '%s'", msg);
                }
            });
            setTimeout(function() { conn.close() }, 500);
          });

          redis.subscribe("jobs");
      })


    }
  });

};
