angular.module('fastBasket.products', [])
.controller('productsController', function($scope, $http, $rootScope){
  $rootScope.shopCart = [];

  $scope.addItem = function(item){
    $rootScope.shopCart.push(item);
  };
});