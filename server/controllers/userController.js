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

  authenticateUser: function(facebookProfile, done){
    
    // usersController
    //   .findByFacebookId(profile.id)
    //   .then(function(user){
    //     if (user){
    //       user.name = profile.displayName;
    //       user.picture = profile.photos[0].value;
    //       user.gender = profile._json.gender;
    //       user.save();
    //       return done(null, user);
    //     } else {
    //       usersController.create({
    //         facebookId: profile.id,
    //         name: profile.displayName,
    //         picture: profile.photos[0].value,
    //         gender: profile._json.gender
    //       })
    //       .then(function(newUser){
    //         return done(null, newUser);
    //       })
    //       .fail(function (error) {
    //         console.log(error);
    //         next(error);
    //       });
    //     }
    //   });
  }
};