var driverSide = angular.module("driverSide",
    ['ui.router',
    'ngMaterial',
    'driverSide.profile',
    'fastBasket.login']);

driverSide.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl:'templates/login.html',
        controller: 'loginController'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'profileController'
    });

    $urlRouterProvider
    .otherwise('/login');

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');
});
