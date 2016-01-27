angular.module('fastBasket.finish', [])
.controller('finishController', function($scope, $http, $rootScope, $state, $stateParams){
  console.log($stateParams.order);
  $scope.modeOrderReceived = "indeterminate";
  $scope.showOrderReceived = true;
  $scope.modeInProgress = "indeterminate";
  $scope.showInProgress = false;
  $scope.modeOntheWay = "indeterminate";
  $scope.showOntheWay = false;

  $scope.doneOrderReceived = function(){
    $scope.modeOrderReceived = "determinate";
    $scope.showInProgress = true;
  };

  $scope.doneInProgress = function(){
    $scope.modeInProgress = "determinate";
    $scope.showOntheWay = true;
  };

  $scope.doneOntheWay = function(){
    $scope.modeOntheWay = "determinate";
  };
});