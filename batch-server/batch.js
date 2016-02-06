var redis = require('redis').createClient();
var pg = require('pg');

redis.on('connect', function() {
    console.log('redis connected');
});
redis.subscribe("jobs");

require('./config/routes.js')(redis);


module.exports = redis;
