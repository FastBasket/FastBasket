var productController = require('../controllers/productController');
var storeController = require('../controllers/storeController');
var userController = require('../controllers/userController');
var driverController = require('../controllers/driverController');
var checkoutController = require('../controllers/checkoutController');
var passport = require('./passport');
var rethink = require('./rethinkDb');

module.exports = function (app, express) {
  app.get('/api/product/search/:text', productController.search);
  app.get('/api/product/showResults/:text', productController.showResults);

  app.post('/api/checkout/createOrder', checkoutController.checkout);
  app.post('/api/checkout/charge', checkoutController.charge);

  app.get('/api/product/getProducts', productController.getProducts);
  app.get('/api/store/getStores', storeController.getStores);
  app.get('/api/user/getUsers', userController.getUsers);
  app.post('/api/user/', userController.insertUser);

  app.post('/api/getRecommendations', productController.getRecommendations);
  app.post('/api/cart/getCart', productController.getShoppingCart);
  app.post('/api/cart/setCart', productController.setShoppingCart);

  app.post('/api/profile/update', userController.update);
  app.get('/api/profile/getOrders/:userId', userController.getOrders);

  app.get('/api/order/getOrderStatus/:orderId', checkoutController.getOrderStatus);

  app.post('/api/driver/updateLocation', driverController.updateLocation);

  app.get('/api/store/getDashboardOrders', storeController.getDashboardOrders);
  app.get('/api/store/getOrderInfo/:orderId', storeController.getOrderInfo);

//<--------- driverNotifications start -------->

  app.post('/api/driverNotifications/doneOrderReceived', driverController.doneOrderReceived);
  app.post('/api/driverNotifications/doneInProgress', driverController.doneInProgress);
  app.post('/api/driverNotifications/doneOntheWay', driverController.doneOntheWay);

//<--------- driverNotifications start -------->

//<---------Passport Routes Start-------->
  app.get('/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile'] }),
    function(req, res){
    });

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/login' }),
    function(req, res) {
      res.cookie('user', JSON.stringify(req.user));
      res.redirect('/#/search');
    });

  app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/#/login');
  });
//<---------Passport Routes End-------->

  app.use(function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  });

  app.use(function (error, req, res, next) {
    res.status(500).send({ error: error.message });
  });
};
