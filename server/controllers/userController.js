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

  getOrders: function(req, res, next){
    var userId = req.params.userId;
    userModel.getOrders(userId, function(err, orders){
      if (err) {
        res.sendStatus(400);
      } else {
        res.status(200).json(orders);
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
        res.status(200).json(userCreated);
      }
    });
  },

  update: function(req, res, next){
    var user = req.body;
    userModel.updateUser(user, function(err, userUpdated){
      if (err){
        console.log('err', err);
        res.sendStatus(400);
      } else {
        res.status(200).json(true);
      }
    });
  },

  authenticateUser: function(facebookProfile, callback){
    userModel.findByFacebookId(facebookProfile.id, function(err, user){
      if (user){
        //TODO update user information
        callback(user);
      } else {
        var userToInsert = {
          facebookid: facebookProfile.id,
          name: facebookProfile.displayName,
          picture: facebookProfile.photos[0].value
        };
        userModel.insertUser(userToInsert, function(err, userCreated){
          if (err){
            callback(err);
          }
          callback(userCreated);
        });
      }
    });
  }
};
