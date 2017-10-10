'use strict';

angular.module('myApp.projects', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {
      templateUrl: 'views/projects/projects.html',
      controller: 'ProjectsCtrl as projects'
    });
  }])

  .controller('ProjectsCtrl', [function() {
    this.title = 'Projects';
    this.details = 'Small group of side projects including, peltiers, DHT Sensors, and ESP8266 modules.'
  }]);