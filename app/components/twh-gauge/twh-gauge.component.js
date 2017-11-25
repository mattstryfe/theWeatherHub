'use strict';

angular.module('myApp').component('twhGauge', {
  templateUrl: 'components/twh-gauge/twh-gauge.html',
  controller: TwhGaugeController,
  bindings: {
    precip: '='
  }
});

function TwhGaugeController () {
  var ctrl = this;

  console.log('it works!')
}