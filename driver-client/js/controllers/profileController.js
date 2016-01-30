angular.module('driverSide.profile', ['ngCookies'])
.controller('profileController', function($scope, $http, $rootScope, $cookies){
  $scope.socket;

  $rootScope.socketConnect = function(){
	$scope.socket = io();
  $scope.userId = JSON.parse($cookies.get('user')).id;
 
  $scope.hasJob;
  $scope.myJob;
  
  $scope.socket.on('dequeue', function(job){
        console.log('Got Job:', job);    
    });
  };

  $scope.checkJobs = function(){
    $http({
      method: "GET",
      url: '/api/myJob'
    }).then(function(result){

      var job = result.data;

      if (job === null){
        $scope.hasJob = false;
      }else{
        $scope.hasJob = true;
        $scope.myJob = result.data;
        console.log($scope.myJob);
      }
    });
  };

  $scope.getJob = function(){

    $scope.socket.emit('request', $scope.userId);
     console.log($scope.userId);
  };
});