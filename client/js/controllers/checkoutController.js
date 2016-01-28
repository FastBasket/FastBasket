angular.module('fastBasket.checkout', [])
.controller('checkoutController', function($scope, $http, $rootScope, $state){
  $scope.order = null;
  $scope.total = 0;
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

  $scope.submit = function(){
    if ($scope.address){
      geocodeAddress(function(coords){
        if (!coords){
          console.log('incorrect address');
          return;
        }
        var request = {
          total: 0,
          productIds: [],
          shippingAddress: $scope.address,
          userId: "4",
          storeId: "1",
          x: coords[0],
          y: coords[1]
        };

        for (var i=0; i<$rootScope.shopCart.length; i++){
          request.total += parseFloat($rootScope.shopCart[i].price);
          request.productIds.push($rootScope.shopCart[i].dbId);
        }

        $http({
          method: "POST",
          url: '/api/checkout/createOrder',
          data: request
        })
        .then(function(result){
          $scope.order = result.data;
          $scope.total = request.total;
        });
      });
    }
  };

  // ============== stripe ===========================

  function onReceiveToken(token, args) {
    $http({
      url: '/api/checkout/charge',
      method: 'POST',
      data: {
        stripeToken: token.id,
        amount: Math.round($scope.total * 100)
      }
    })
    .then(function(result){
      $state.go('finish', { order: $scope.order });
    });
   }

  var checkout = StripeCheckout.configure({
    key: 'pk_test_QuMujd8pj8I5GBZLxpUu5t7v',
    token: onReceiveToken,
    image: 'https://pbs.twimg.com/media/CTuJIpkU8AAOUu5.jpg',
    name: 'Fast Basket',
    description: 'groceries',
    amount: Math.round($scope.total * 100),
    billingAddress: 'false'
  });

  $scope.pay = function(){
    checkout.open();
    return false;
  };

  // ============== stripe ===========================

});