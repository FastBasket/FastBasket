var fastBasket = angular.module('fastBasket',
  ['ui.router',
  'ngMaterial',
  'fastBasket.shop',
  'fastBasket.cart',
  'fastBasket.products',
  'fastBasket.searchBar',
  'fastBasket.checkout',
  'fastBasket.finish',
  'btford.socket-io',
  'ngRoute']).
  config(function($stateProvider, $mdThemingProvider, $urlRouterProvider, $httpProvider){

    $stateProvider
      .state('login', {
        url: "/login",
        views: {
          "login": {
            templateUrl : 'partial/login.html'
          }
        }
      })
      .state('search', {
        url: "/search",
        views: {
          "searchBar": {
            templateUrl : 'partial/searchBar.html',
            controller: 'searchBarController as ctrl'
          },
          "content": {
            templateUrl : 'partial/products.html',
            controller: 'productsController'
          }
        }
      })
      .state('checkout', {
        url: "/checkout",
        views: {
          "searchBar": {
            templateUrl : 'partial/searchBar.html',
            controller: 'searchBarController as ctrl'
          },
          "content": {
            templateUrl : 'partial/checkout.html',
            controller: 'checkoutController'
          }
        }
      })
      .state('finish', {
        url: "/finish",
        params: { order: null },
        views: {
          "searchBar": {
            templateUrl : 'partial/searchBar.html',
            controller: 'searchBarController as ctrl'
          },
          "content": {
            templateUrl : 'partial/finish.html',
            controller: 'finishController as finCtrl'
          }
        }
      });

    $urlRouterProvider
      .otherwise('/login');

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('lime');
  })
.factory('mySocket', function (socketFactory) {
  return socketFactory();
})
.factory('shopCart', function ($http) {
  var getCart = function(userId) {
    return $http({
      method: 'POST',
      url: '/api/cart/getCart',
      data: {userId: userId}
    })
    .then(function (cart) {
      return cart.data;
    });
  };

  var setCart = function(userId, cart) {
    return $http({
      method: 'POST',
      url: '/api/cart/setCart',
      data: { userId: userId, cart: cart }
    })
    .then(function () {
      
    });
  };

  return {
    getCart: getCart,
    setCart: setCart
  };
});
