angular.module('fastBasket.admin', [])
.controller('adminController', function($scope, $http, $rootScope, $state, mySocket){
  $scope.new_orders = [];
  $scope.ready_orders = [];
  $scope.inprogress_orders = [];
  $scope.delivered_orders = [];

  var initializeOrder = function(){
    $http({
      method: "GET",
      url: '/api/store/getDashboardOrders'
    })
    .then(function(orders){
      orders.data.forEach(function(order){
        if (order.status === 'pending'){
          $scope.new_orders.push(order);
        } else if (order.status === 'ready'){
          $scope.ready_orders.push(order);
        } else if (order.status === 'inProgress'){
          $scope.inprogress_orders.push(order);
        } else if (order.status === 'delivered'){
          $scope.delivered_orders.push(order);
        }
      });
    });
  };

  initializeOrder();

  mySocket.on('new_order', function (data) {
    $scope.new_orders.push(data);
  });

  mySocket.on('ready_order', function (data) {
    for (var i=0; i<$scope.new_orders.length; i++){
      if (data.id === $scope.new_orders[i].id){
        $scope.new_orders.splice(i, 1);
        break;
      }
    }

    $scope.ready_orders.push(data);
  });

  mySocket.on('onmyway_order', function (data) {
    for (var i=0; i<$scope.ready_orders.length; i++){
      if (data.id === $scope.ready_orders[i].id){
        $scope.ready_orders.splice(i, 1);
        break;
      }
    }
    
    $scope.inprogress_orders.push(data);
  });

  mySocket.on('delivered_order', function (data) {
    for (var i=0; i<$scope.inprogress_orders.length; i++){
      if (data.id === $scope.inprogress_orders[i].id){
        $scope.inprogress_orders.splice(i, 1);
        break;
      }
    }
    
    $scope.delivered_orders.push(data);
  });

});