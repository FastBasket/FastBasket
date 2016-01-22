var pg = require('pg');
var constants = require('../config/constants');

module.exports = {

  getStores: function(callback){
    pg.connect(constants.DATABASE_URL, function(err, client, done){
      if(err) {
        console.error('error fetching client from pool', err);
        callback(err, null);
      }

      client.query('Select * from Stores', function(err, stores){
        done();
        callback(err, stores.rows);
      });
    });
  }

};