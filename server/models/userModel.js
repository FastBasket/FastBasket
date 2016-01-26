var db = require('../db/db');

module.exports = {

  getUsers: function(callback){
    db.query('Select * from Users')
      .then(function(users){
        callback(null, users);
      })
      .catch(function(error){
        callback(error, null);
      });
  },

  insertUser: function(userToInsert, callback){
    console.log("INSERTING USER:", userToInsert);
    var parameters = [userToInsert.name || "", userToInsert.email || "", userToInsert.facebookid || "", userToInsert.zipcode || "", userToInsert.address || "", userToInsert.phone || "", userToInsert.picture || "", true];
    db.one("insert into users(name, email, facebookid, zipcode, address, phone, picture, active) values($1, $2, $3, $4, $5, $6, $7, $8) returning id",
      parameters)
      .then(function (newUser) {
          callback(null, newUser);
      })
      .catch(function (error) {
          console.log('error',error);
          callback(error, null);
      });
  },

  findByFacebookId: function(facebookid, callback){
    db.one('Select * from Users where facebookid = $1', [facebookid])
      .then(function(user){
        callback(null, user);
      })
      .catch(function(error){
        callback(error, null);
      });
  }
};