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
  }
};