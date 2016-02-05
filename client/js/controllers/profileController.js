angular.module('fastBasket.profile', [])
.controller('profileController', function($scope, $http, $rootScope, $mdToast, $cookies, shopCart){
  
  $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

  $scope.profileOrders = [];

  var getProfileOrders = function(userId){
   $http({
      method: "GET",
      url: '/api/profile/getOrders/' + userId,
    })
   .then(function(orders){
      $scope.profileOrders = orders.data;
   });
  };

  getProfileOrders($rootScope.user.id);

  $scope.addItems = function(order){
    for (var i=0; i< order.orderdetails.length; i++){
      $rootScope.shopCart.push(order.orderdetails[i]);
    }
    calculateTotal();
    shopCart.setCart($rootScope.user.id, $rootScope.shopCart)
    .then(function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Items added')
          .position('top right')
          .hideDelay(2000)
      );
    });
  };

  function calculateTotal(){
    $rootScope.shopCartTotal = 0;
    for (var i=0; i<$rootScope.shopCart.length; i++){
      $rootScope.shopCartTotal += parseFloat($rootScope.shopCart[i].price);
    }
    $rootScope.shopCartTotal = $rootScope.shopCartTotal.toFixed(2);
  }


  $scope.submitProfile = function(){
    $http({
      method: "POST",
      url: '/api/profile/update',
      data: $rootScope.user
    })
    .then(function(result){
      $cookies.put('user', JSON.stringify($rootScope.user));

      $mdToast.show(
        $mdToast.simple()
          .textContent('Profile Saved')
          .position('top right')
          .hideDelay(2000)
      );
    }, function errorCallback(response) {
      
    });
  };

});