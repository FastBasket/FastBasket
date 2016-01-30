angular.module('fastBasket.checkout', [])
.controller('checkoutController', function($scope, $http, $rootScope, $state){
  $scope.user = {};

  $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

  $scope.order = null;
  var geocoder = new google.maps.Geocoder();

  function geocodeAddress(callback) {
    var address = $scope.address;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        callback([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
      } else {
        return false;
      }
    });
  }

  var createOrder = function(callback){
    $scope.address = $scope.user.address + ' ' + $scope.user.city + ' ' + $scope.user.state + ' ' + $scope.user.postalCode;

    geocodeAddress(function(coords){
      if (!coords){
        console.log('incorrect address');
        return;
      }
      var request = {
        productIds: [],
        shippingAddress: $scope.address,
        userId: "4",
        storeId: "1",
        x: coords[0],
        y: coords[1],
        total: $rootScope.shopCartTotal
      };

      for (var i=0; i<$rootScope.shopCart.length; i++){
        request.productIds.push($rootScope.shopCart[i].dbId);
      }

      $http({
        method: "POST",
        url: '/api/checkout/createOrder',
        data: request
      })
      .then(function(result){
        $scope.order = result.data;
        callback(result.data);
      }, function errorCallback(response) {
        console.log(response);
      });
    });
    
  };

  // ============== stripe ===========================

  function onReceiveToken(token, args) {
    $http({
      url: '/api/checkout/charge',
      method: 'POST',
      data: {
        stripeToken: token.id,
        amount: Math.round($rootScope.shopCartTotal * 100)
      }
    })
    .then(function successCallback(result){
      createOrder(function(orderCreated){
        $state.go('finish', { order: orderCreated });
      });
    }, function errorCallback(response) {
      console.log(response);
    });
   }

  var checkout = StripeCheckout.configure({
    key: 'pk_test_QuMujd8pj8I5GBZLxpUu5t7v',
    token: onReceiveToken,
    image: 'https://pbs.twimg.com/media/CTuJIpkU8AAOUu5.jpg',
    name: 'Fast Basket',
    description: 'groceries',
    amount: Math.round($rootScope.shopCartTotal * 100),
    billingAddress: 'false'
  });

  $scope.submit = function(){
    checkout.open();
  };

  // ============== stripe ===========================

});