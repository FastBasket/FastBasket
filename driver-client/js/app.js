var driverSide = angular.module("driverSide", ['ui.router',
    'driverSide.profile']);

driverSide.config(function($stateProvider, $urlRouterProvider) {
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
});