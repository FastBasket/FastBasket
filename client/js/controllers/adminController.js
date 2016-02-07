angular.module('fastBasket.admin', [])
.controller('adminController', function($scope, $http, $rootScope, $state, mySocket){
  $scope.orders = [];

  mySocket.on('update_orders', function (data) {
    $scope.orders.push(data.new_val);
  });

});