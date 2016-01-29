angular.module('fastBasket.products', [])
.controller('productsController', function($scope, $http, $rootScope){
  if ($rootScope.shopCart === undefined || $rootScope.shopCart === null){
    $rootScope.shopCart = [];
    $rootScope.shopCartTotal = 0;
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
  };
});