'use strict';

angular.module('myApp.swf', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/swf', {
      templateUrl: 'views/swf/swf.html',
      controller: 'SwfCtrl as swf'
    });
  }])

  .controller('SwfCtrl', [function() {
    this.title = 'Simple Weather Forecast (SWF)'

  }]);