'use strict';

angular.module('myApp.fillGauge', ['ngRoute'])

  // .controller('fillGaugeCtrl', [
  //   '$routeProvider',
  //   function() {
  //     this.message ='it works!'
  //     console.log(this.message)
  // }])
  .controller('Controller', ['$scope', function($scope) {
    $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
    $scope.vojta = { name: 'Vojta', address: '3456 Somewhere Else' };
  }])

  .directive('fillGauge', [function() {
    // this.message ='it works!'
    // console.log(this.message)
    return {
      templateUrl: 'components/fillGauge/fillGauge.html'
    };
  }]);