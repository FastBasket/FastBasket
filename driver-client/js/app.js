var driverSide = angular.module("driverSide",
    ['ui.router',
    'ngMaterial',
    'driverSide.profile']);

driverSide.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl:'templates/login.html'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'profileController'
    })
    .state('profile.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html'
    });
    
    $urlRouterProvider
    .otherwise('/login');

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');
});