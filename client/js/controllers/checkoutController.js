angular.module('fastBasket.checkout', [])
.controller('checkoutController', function($scope, $http, $rootScope){
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

  $scope.submit = function(item){
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
          request.total +=  parseInt($rootScope.shopCart[i].price, 10);
          request.productIds.push($rootScope.shopCart[i].dbId);
        }

        $http({
          method: "POST",
          url: '/api/product/checkout',
          data: request
        })
        .then(function(result){
          console.log(result.data);
        });
      });
    }
  };
});