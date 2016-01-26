var productController = require('../controllers/productController');
var storeController = require('../controllers/storeController');
var userController = require('../controllers/userController');
var passport = require('./passport');

module.exports = function (app, express) {
  app.get('/api/product/search/:text', productController.search);
  app.get('/api/product/searchCategories/:text', productController.searchCategories);
  app.get('/api/product/showResults/:text', productController.showResults);

  app.get('/api/product/getProducts', productController.getProducts);
  app.get('/api/store/getStores', storeController.getStores);
  app.get('/api/user/getUsers', userController.getUsers);
  app.post('/api/user/', userController.insertUser);

//<---------Passport-------->
  app.get('/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile'] }),
    function(req, res){
    });

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/login' }),
    function(req, res) {
      res.redirect('/#/search');
    });

  app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/#/login');
  });
//<---------Passport-------->

  app.use(function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  });

  app.use(function (error, req, res, next) {
    res.status(500).send({ error: error.message });
  });
};