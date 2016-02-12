var storeModel = require('../models/storeModel');
var orderModel = require('../models/orderModel');

module.exports = {
  getStores: function(req, res, next){
    storeModel.getStores(function(err, stores){
      if (err){
        res.sendStatus(400);
      } else {
        res.status(200).json(stores);
      }
    });
  },

  getDashboardOrders: function(req, res, next){
    orderModel.getDashboardOrders(function(orders){
      res.status(200).json(orders);
    });
  },

  getOrderInfo: function(req, res, next){
    var orderId = req.params.orderId;
    orderModel.getOrderInfo(orderId, function(order){
      res.status(200).json(order);
    });
  },

  getStoreStats: function(req, res, next){
    orderModel.getStoreStats(function(err, results){
      if (err) {
	console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).json(results);
      }
    });
  }
};
