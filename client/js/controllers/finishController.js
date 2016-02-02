angular.module('fastBasket.finish', [])
.controller('finishController', function($scope, $http, $rootScope, $state, $stateParams, mySocket){
  $scope.message = "We received your order from Whole Foods";

  var orderId;
  if ($stateParams.order){
    orderId = $stateParams.order.id;
    mySocket.emit('create', orderId);
  }

  $scope.modeOrderReceived = "indeterminate";
  $scope.showOrderReceived = true;
  $scope.modeInProgress = "indeterminate";
  $scope.showInProgress = false;
  $scope.modeOntheWay = "indeterminate";
  $scope.showOntheWay = false;

  var doneOrderReceived = function(){
    $scope.$apply(function() {
      $scope.modeOrderReceived = "determinate";
      $scope.showInProgress = true;
      $scope.message = "Your order is in the works";
    });
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
});