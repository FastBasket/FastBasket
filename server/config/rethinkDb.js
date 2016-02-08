var r = require('rethinkdb');
var io = require('../server.js').io;

r.connect({ db: 'fastbasket' }).then(function(conn) {
  r.db('fastbasket').tableCreate('orders').run(conn, function(){
    console.log('rethinkdb done');
  });

  r.table('orders').changes().run(conn, function(err, cursor) {
    cursor.each(function(err, item) {
      io.to('admin').emit("new_order", item);
    });
  });

});