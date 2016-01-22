var pg = require('pg');
var constants = require('../config/constants');

module.exports = {

  getProducts: function(callback){
    pg.connect(constants.DATABASE_URL, function(err, client, done){
      if(err) {
        console.error('error fetching client from pool', err);
        callback(err, null);
      }

      client.query('Select * from Products', function(err, products){
        done();
        callback(err, products.rows);
      });
    });
  }

};