angular.module('fastBasket.finish', [])
.controller('finishController', function($scope, $http, $rootScope, $state, $stateParams, mySocket){
  var orderId = $stateParams.order.id;

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
    });
  };

  var doneInProgress = function(){
    $scope.modeInProgress = "determinate";
    $scope.showOntheWay = true;
  };

  var doneOntheWay = function(){
    $scope.modeOntheWay = "determinate";
  };

  mySocket.emit('create', orderId);

  mySocket.on('doneOrderReceived', function (data) {
    console.log(data);
    doneOrderReceived();
  });

  mySocket.on('doneInProgress', function (data) {
    console.log(data);
    doneInProgress();
  });

  mySocket.on('doneOntheWay', function (data) {
    console.log(data);
    doneOntheWay();
  });
});