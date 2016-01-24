var fastBasket = angular.module('fastBasket',
  ['ui.router',
  'ngMaterial',
  'fastBasket.shop',
  'fastBasket.cart',
  'fastBasket.products',
  'fastBasket.searchBar',
  'ngRoute']).
  config(function($stateProvider, $mdThemingProvider, $urlRouterProvider, $httpProvider){

    $stateProvider
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
      });

    $urlRouterProvider
      .otherwise('/search');

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('lime');
  });
