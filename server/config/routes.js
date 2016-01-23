var productController = require('../controllers/productController');
var storeController = require('../controllers/storeController');
var userController = require('../controllers/userController');

module.exports = function (app, express) {
  app.get('/api/product/search/:text', productController.search);
  app.get('/api/product/showResults/:text', productController.showResults);

  app.get('/api/product/getProducts', productController.getProducts);
  app.get('/api/store/getStores', storeController.getStores);
  app.get('/api/user/getUsers', userController.getUsers);
  app.post('/api/user/', userController.insertUser);

  app.use(function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  });

  app.use(function (error, req, res, next) {
    res.status(500).send({ error: error.message });
  });
};