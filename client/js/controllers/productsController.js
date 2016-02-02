angular.module('fastBasket.products', [])
.controller('productsController', function($scope, $http, $rootScope, shopCart){
  if ($rootScope.shopCart === undefined || $rootScope.shopCart === null){
    $rootScope.shopCart = [];
    $rootScope.shopCartTotal = 0;

    shopCart.getCart($rootScope.user.id)
    .then(function(redisRes){
      $rootScope.shopCart = JSON.parse(redisRes);
      calculateTotal();
    });
  }

  function calculateTotal(){
    $rootScope.shopCartTotal = 0;
    for (var i=0; i<$rootScope.shopCart.length; i++){
      $rootScope.shopCartTotal += parseFloat($rootScope.shopCart[i].price);
    }
    $rootScope.shopCartTotal = $rootScope.shopCartTotal.toFixed(2);
  }

  $scope.addItem = function(item){
    $rootScope.shopCart.push(item);
    calculateTotal();
    shopCart.setCart($rootScope.user.id, $rootScope.shopCart)
    .then(function(){
    });
  };
});