'use strict';

angular.module('myApp.base', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/base', {
      templateUrl: 'views/base/base.html',
      controller: 'BaseCtrl as base'
    });
  }])

  .controller('BaseCtrl', [function() {
    //var self = this;

    this.test = 'this is a test'
    console.log('test: ', this.test)
  }]);