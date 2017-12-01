'use strict';

angular.module('myApp').component('twhGauge', {
  templateUrl: 'components/twh-gauge/twh-gauge.html',
  controller: TwhGaugeController,
  css: 'components/twh-gauge/twh-gauge.css',
  bindings: {
    precip: '<'
  }
});

function TwhGaugeController () {
  var ctrl = this;
  const precip = ctrl.precip
  const index = ctrl.index


  ctrl.simpleChart = function() {
    console.log('running simpleChart()...')
    var data = [30, 86, 168, 281, 303, 365];

    //console.log('d3selectAll:', d3.selectAll(".chart"))
    console.log('d3select:', d3.select(element[0]).select('.chart'))

    d3.select(".chart")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function(d) { return d + "px"; })
      // .style("height", function(d) { return d + "px"; })
      .style("background-color", function(d) { return "steelblue"})
      .style("padding", function(d) { return "3px"})
      .style("margin", function(d) { return "1px"})
      .text(function(d) { return d; });
  }

  ctrl.simpleChart()


  // calculate qauntitativePrecip
  // this will be used for the water gauge
  ctrl.calcQuantitativePrecip = function(precip) {
    let precipTotal = 0;
    precip.forEach((entry) => {
      precipTotal += entry.value
    })
    ctrl.precipTotal = precipTotal //make available to UI.
  }

  // Get final precip values for the given day.
  ctrl.calcQuantitativePrecip(precip)



  // WATER GAUGE AREA //
  ctrl.buildWaterGauge = function() {
    //console.log('initiating water gauge...');

    var config = liquidFillGaugeDefaultSettings();
    //config1.circleColor = "#D4AB6A";
    //config1.textColor = "#553300";
    //config1.waveTextColor = "#805615";
    //config1.waveColor = "#AA7D39";
    config.circleThickness = 0.1;
    config.circleFillGap = 0.05;
    config.textVertPosition = 0.8;
    config.waveAnimate = true;
    config.waveAnimateTime = 4000;
    config.waveHeight = 0.2;
    config.waveCount = 1;
    // add size to config
    config.minWidth = 100;
    config.minHeight = 100;

    // const list = ['fillgauge']
    // for(const gauge in list) {
    //   //console.log('creating fillGauge', list[gauge])
    //   loadLiquidFillGauge(list[gauge], 85, config)
    // }
    loadLiquidFillGauge("fillgauge", 85, config);
    // var gauge1 = loadLiquidFillGauge("fillgauge1", 85, config);
    // var gauge2 = loadLiquidFillGauge("fillgauge2", 85, config);
    // var gauge3 = loadLiquidFillGauge("fillgauge3", 85, config);
    // var gauge4 = loadLiquidFillGauge("fillgauge4", 85, config);

    // var gauge2= loadLiquidFillGauge("fillgauge2", 28, config1);
    // var config2 = liquidFillGaugeDefaultSettings();
    // config2.circleColor = "#D4AB6A";
    // config2.textColor = "#553300";
    // config2.waveTextColor = "#805615";
    // config2.waveColor = "#AA7D39";
    // config2.circleThickness = 0.1;
    // config2.circleFillGap = 0.2;
    // config2.textVertPosition = 0.8;
    // config2.waveAnimateTime = 2000;
    // config2.waveHeight = 0.3;
    // config2.waveCount = 1;
    //
    // var gauge3 = loadLiquidFillGauge("fillgauge3", 60.1, config2);
    // var config3 = liquidFillGaugeDefaultSettings();
    // config3.textVertPosition = 0.8;
    // config3.waveAnimateTime = 5000;
    // config3.waveHeight = 0.15;
    // config3.waveAnimate = false;
    // config3.waveOffset = 0.25;
    // config3.valueCountUp = false;
    // config3.displayPercent = false;
    //
    // var gauge4 = loadLiquidFillGauge("fillgauge4", 50, config3);
    // var config4 = liquidFillGaugeDefaultSettings();
    // config4.circleThickness = 0.15;
    // config4.circleColor = "#808015";
    // config4.textColor = "#555500";
    // config4.waveTextColor = "#FFFFAA";
    // config4.waveColor = "#AAAA39";
    // config4.textVertPosition = 0.8;
    // config4.waveAnimateTime = 1000;
    // config4.waveHeight = 0.05;
    // config4.waveAnimate = true;
    // config4.waveRise = false;
    // config4.waveHeightScaling = false;
    // config4.waveOffset = 0.25;
    // config4.textSize = 0.75;
    // config4.waveCount = 3;
  // return '<svg id="fillgauge" width="100%" height="75px" onclick=""></svg>'
  }

  // ctrl.buildGauges = function() {
  //   console.log('d3selectAll', d3.selectAll("#" + elementId))
  //   for
  // }

  //ctrl.buildWaterGauge()
}