var storeModel = require('../models/storeModel');

module.exports = {
  getStores: function(req, res, next){
    storeModel.getStores(function(err, stores){
      if (err){
        res.sendStatus(400);
      } else {
        res.status(200).json(stores);
      }
    });
  }
};