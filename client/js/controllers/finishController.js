angular.module('fastBasket.finish', [])
.controller('finishController', function($scope, $http, $rootScope, $state, $stateParams, mySocket){
  $scope.message = "We received your order from Whole Foods";

  var orderId = localStorage.getItem("orderid");
  mySocket.emit('create', orderId);

  $http({
    method: "GET",
    url: '/api/order/getOrderStatus/' + orderId,
  })
  .then(function(status){
    if (status.data === 'ready') {
      doneOrderReceived();
    } else if (status.data === 'inProgress') {
      doneOrderReceived();
      doneInProgress();
    } else if (status.data === 'delivered') {
      doneOrderReceived();
      doneInProgress();
      doneOntheWay();
    }
  });

  $scope.modeOrderReceived = "indeterminate";
  $scope.showOrderReceived = true;
  $scope.modeInProgress = "indeterminate";
  $scope.showInProgress = false;
  $scope.modeOntheWay = "indeterminate";
  $scope.showOntheWay = false;

  var doneOrderReceived = function(){
    $scope.modeOrderReceived = "determinate";
    $scope.showInProgress = true;
    $scope.message = "Your order is in the works";
  };

  var doneInProgress = function(){
    $scope.modeInProgress = "determinate";
    $scope.showOntheWay = true;
    $scope.message = "Your Driver Ron is on the way";
  };

  var doneOntheWay = function(){
    $scope.modeOntheWay = "determinate";
    $scope.message = "Order Delivered";
  };

  mySocket.on('doneOrderReceived', function (data) {
    doneOrderReceived();
  });

  mySocket.on('doneInProgress', function (data) {
    doneInProgress();
  });

  mySocket.on('doneOntheWay', function (data) {
    doneOntheWay();
  });

  mySocket.on('updatePositions', function(data){
    var driverPosition;

    for (var i=0; i<data.length; i++){
      driverPosition = JSON.parse(data[i]);
      if (driverPosition.orders){
        for (var j=0; j<driverPosition.orders.length; j++){
          if (driverPosition.orders[j].id === orderId){
            console.log(driverPosition);
            //TODO render driverPosition to the map
            break;
          }
        }
      }
    }

  });
});
