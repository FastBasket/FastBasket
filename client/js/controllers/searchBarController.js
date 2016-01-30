angular.module('fastBasket.searchBar', [])
.controller('searchBarController', function($scope, $http, $rootScope, $state, $mdSidenav){
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