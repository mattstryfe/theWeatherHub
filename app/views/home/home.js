'use strict';

angular.module('myApp.home', ['ngRoute', 'routeStyles'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl',
        css: 'views/home/home.css'
      });
    }])

    .controller('HomeCtrl', [function() {

    }]);