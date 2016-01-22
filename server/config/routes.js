var productController = require('../controllers/productController');
var storeController = require('../controllers/storeController');

module.exports = function (app, express) {
  app.get('/api/product/getProducts', productController.getProducts);
  app.get('/api/store/getStores', storeController.getStores);

  app.use(function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  });

  app.use(function (error, req, res, next) {
    res.status(500).send({ error: error.message });
  });
};