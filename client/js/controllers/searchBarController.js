angular.module('fastBasket.searchBar', ['ngCookies'])
.controller('searchBarController', function($scope, $http, $rootScope, $state, $mdSidenav, $cookies, shopCart){
  $rootScope.user = JSON.parse($cookies.get('user'));

  if ($rootScope.user.phone && $rootScope.user.phone.trim().length > 0 && $rootScope.user.phone.trim().length === 10){
    $rootScope.user.phone = parseInt($rootScope.user.phone, 10);
  }
  if ($rootScope.user.zipcode && $rootScope.user.zipcode.trim().length > 0 && $rootScope.user.zipcode.trim().length === 5){
    $rootScope.user.zipcode = parseInt($rootScope.user.zipcode, 10);
  }

  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };

  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
        });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
        });
    };
  }

  //===========================================================

  $scope.checkout = function(){
    $state.go('checkout');
  };

  $scope.removeItem = function(item, index){
    $rootScope.shopCart.splice(index, 1);
    calculateTotal();
    shopCart.setCart($rootScope.user.id, $rootScope.shopCart)
    .then(function(){
    });
  };

  function calculateTotal(){
    $rootScope.shopCartTotal = 0;
    for (var i=0; i<$rootScope.shopCart.length; i++){
      $rootScope.shopCartTotal += parseFloat($rootScope.shopCart[i].price);
    }
    $rootScope.shopCartTotal = $rootScope.shopCartTotal.toFixed(2);
  }

  function elasticSearch(text){
    return $http({
      method: 'GET',
      url: '/api/product/search/' + text
    })
    .then(function(result){
      return result.data;
    });
  }

  this.querySearch = function(text){
    if (text && text.trim() !== ''){
      return elasticSearch(text);
    } else {
      return [];
    }
  };
  
  this.searchTextChange = function(text){
    if (text && text.trim() !== ''){
      return elasticSearch(text);
    } else {
      return [];
    }
  };

  this.selectedItemChange = function(item){
    if (item && item.name.trim() !== ''){
      $http({
        method: 'GET',
        url: '/api/product/showResults/' + item.name
      })
      .then(function(products){
        $rootScope.products = products.data;
      });
    }
  };

  this.checkEnter = function($event){
    var keycode = $event.which || $event.KeyCode;
    if (keycode === 13){
      this.selectedItemChange({name: this.searchText});
    }
  };
})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav) {
  $scope.close = function () {
    $mdSidenav('right').close()
      .then(function () {
      });
  };
});