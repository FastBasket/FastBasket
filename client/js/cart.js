angular.module('fastBasket.cart', [])
  .controller('cartcontroller', function($scope, Cart){
    $scope.cart = Cart.storage
  })
