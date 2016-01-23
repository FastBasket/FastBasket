var fastBasket = angular.module('fastBasket', ['ui.router', 'ngMaterial',
  'fastBasket.shop',
  'fastBasket.cart',
  'ngRoute']).
  config(function($stateProvider, $mdThemingProvider, $urlRouterProvider, $httpProvider){

    $stateProvider
      .state('store', {
        url: '/store',
        templateUrl : 'partial/shop.html',
        controller: 'shopcontroller'
      })
      .state('cart', {
        url: '/cart',
        templateUrl : 'partial/cart.html',
        controller: 'cartcontroller'
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl : 'partial/checkout.html'
      });

    $urlRouterProvider
      .otherwise('/store');

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('lime');
  })
  .controller('appcontroller', function($scope, Cart, $http){
    $scope.cart = Cart.storage;

    function elasticSearch(text){
      return $http({
        method: 'GET',
        url: '/api/product/search/' + text
      })
      .then(function(products){
        return products.data;
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
  });

fastBasket.factory("Cart", function(){
  userBasket = new basket();

  return {
    storage: userBasket
  };

});
