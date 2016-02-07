var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server').app;
var userModel = require('../models/userModel');

chai.use(require('chai-things'));

var userId;

describe('RESTful API', function () {
  beforeEach(function () {
    var user  = { name: "testUser", facebookid: "111111"  };

    userModel.findByFacebookId('111111', function(err, userFound){
      if (userFound){
        userId = userFound.id;
      } else {
        userModel.insertUser(user, function(err, userCreated){
          if (err){
            console.log(err);
          } else {
            userId = userCreated.id;
          }
        });
      }
    });
  });

  describe('/api/checkout/createOrder', function () {
    it('responds with a 200 (OK)', function (done) {
      var requestObj = {shippingAddress: "251 9th street", total: 90, storeId:1, x:1000, y:1000, productIds: [1,2,3]};

      userModel.findByFacebookId('111111', function(err, user){
        requestObj.userId = user.id;
        requestObj.user = user;

        request(app)
          .post('/api/checkout/createOrder')
          .send(requestObj)
          .expect(201, done);
      });

    });
  });

  describe('/api/profile/getOrders/:userId', function () {
    it('responds with a 200 (OK)', function (done) {
      userModel.findByFacebookId('111111', function(err, user){
        request(app)
          .get('/api/profile/getOrders/' + user.id)
          .expect(200, function(err, orders){
            if (err){
              done(err);
            } else {
              expect(orders.body.length > 0).to.equal(true);
              done();
            }
          });
      });
    });
  });

});