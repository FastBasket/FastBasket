var userModel = require('../models/userModel');

module.exports = {
  getUsers: function(req, res, next){
    userModel.getUsers(function(err, users){
      if (err){
        res.sendStatus(400);
      } else {
        res.status(200).json(users);
      }
    });
  },

  insertUser: function(req, res, next){
    var userToInsert = req.body;
    userModel.insertUser(userToInsert, function(err, userCreated){
      if (err){
        console.log('err',err);
        res.sendStatus(400);
      } else {
        console.log('userCreated', userCreated);
        res.status(200).json(userCreated);
      }
    });
  },

  authenticateUser: function(facebookProfile, callback){
    console.log('im here');
    userModel.findByFacebookId(facebookProfile.id, function(err, user){
      if (user){
        console.log('user does exists');
        //TODO update user information
        callback(user);
      } else {
        console.log('before userInser');
        var userToInsert = {
          facebookid: facebookProfile.id,
          name: facebookProfile.displayName,
          picture: facebookProfile.photos[0].value
        };
        console.log('user doesnt exists');
        userModel.insertUser(userToInsert, function(err, userCreated){
          if (err){
            console.log('error when inserting');
            callback(err);
          }
          console.log('user inserted', userCreated);
          callback(userCreated);
        });
      }
    });
  }
};