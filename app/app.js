'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'routeStyles',
  'myApp.home',
  'myApp.base',
  'myApp.version',
  'myApp.footer',
  'myApp.swf',
  'myApp.projects',
  'myApp.blog',
  'myApp.probofprecipgraphDirective',
  'myApp.precipsDirective',

])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/home'});
  }])

  // .controller('MainCtrl', function MainCtrl() {
  //   this.hero = {
  //     name: 'Spawn'
  //   };
  // });
