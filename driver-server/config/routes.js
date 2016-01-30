var userController = require('../../server/controllers/userController.js')
var jobModel = require('../../server/models/jobModel');

module.exports = function(app,express,passport){

//test This
  app.get('/api/myJob',function(req, res){
      var user = JSON.parse(req.cookies.user);
      var userId = user.id;
      
      jobModel.getJob(userId, function(err, job){
        console.log("this is the job returned from api/myJob", job);
        res.json(job);
      });
  });

//<---------Passport-------->
  app.get('/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile'] }),
    function(req, res){

    });

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/login' }),
    function(req, res) {
      console.log("This is the user before adding him to cookie", req.user);
      res.cookie('user', JSON.stringify(req.user));
      res.redirect('/#/profile/dashboard');
    });

  app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/#/login');
  });
//<---------Passport-------->

};