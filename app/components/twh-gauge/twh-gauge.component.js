'use strict';

angular.module('myApp').component('twhGauge', {
  templateUrl: 'components/twh-gauge/twh-gauge.html',
  controller: TwhGaugeController,
  bindings: {
    precip: '<'
  }
});

function TwhGaugeController () {
  var ctrl = this;
  const precip = ctrl.precip

  // calculate qauntitativePrecip
  // this will be used for the water gauge
  ctrl.calcQuantitativePrecip = function(precip) {
    let precipTotal = 0;
    precip.forEach((entry) => {
      precipTotal += entry.value
    })
    ctrl.precipTotal = precipTotal //make available to UI.
  }

  ctrl.calcQuantitativePrecip(precip)
}