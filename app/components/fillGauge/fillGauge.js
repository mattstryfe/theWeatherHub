'use strict';

angular.module('myApp.fillGauge', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/base', {
//     templateUrl: 'views/base/base.html',
//     controller: 'BaseCtrl as base'
//   });
// }])

  .directive('fillGauge', [function() {
    return {
      templateUrl: 'components/fillGauge/fillGauge.html',
    }
  }]);