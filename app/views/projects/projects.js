'use strict';

angular.module('myApp.projects', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {
      templateUrl: 'views/projects/projects.html',
      controller: 'ProjectsCtrl as projects'
    });
  }])

  .controller('ProjectsCtrl', [function() {
    this.title = 'Side Hustles'

  }]);