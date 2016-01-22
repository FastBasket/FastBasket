var db = require('../db/db');

module.exports = {

  getStores: function(callback){
    db.query('Select * from Stores')
      .then(function(stores){
        callback(null, stores);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

};