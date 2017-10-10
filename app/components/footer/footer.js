'use strict';

angular.module('myApp.footer', ['ngRoute'])

    // .config(['$routeProvider', function($routeProvider) {
    //   $routeProvider.when('/base', {
    //     templateUrl: 'views/base/base.html',
    //     controller: 'BaseCtrl as base'
    //   });
    // }])

    .directive('footer', [function() {
      return {
        templateUrl: 'components/footer/footer.html',
      }
    }]);