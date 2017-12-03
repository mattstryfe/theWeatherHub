angular.module('myApp.cust-gauge', ['ngRoute'])

.directive( 'custGauge', [
  function () {
    return {
      restrict: 'E',
      // template: "<svg width='75' height='75'></svg>",
      scope: {
        data: '='
      },

      link: function (scope, element) {
        console.log('element', element[0])
        // var svgContainer = d3.select(element[0])
        //   .append("svg")
        //   .attr("width", 50)
        //   .attr("height", 50);
        // svgContainer.append("circle")
        //   .style("stroke", "gray")
        //   .style("fill", "black")
        //   .attr("cx", 30)
        //   .attr("cy", 30)
        //   .attr("r", 20);

        buildWaterGuage()

        function buildWaterGuage () {
          //console.log('initiating water gauge...');

          var config = liquidFillGaugeDefaultSettings();
          config.circleThickness = 0.1;
          config.circleFillGap = 0.05;
          config.textVertPosition = 0.8;
          config.waveAnimate = true;
          config.waveAnimateTime = 4000;
          config.waveHeight = 0.2;
          config.waveCount = 1;
          // add size to config
          config.width = 50;
          config.height = 50;
          loadLiquidFillGauge("fillgauge", 85, config);

        }
        function liquidFillGaugeDefaultSettings() {
          return {
            minValue: 0, // The gauge minimum value.
            maxValue: 100, // The gauge maximum value.
            circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
            circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
            circleColor: "#178BCA", // The color of the outer circle.
            waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
            waveCount: 1, // The number of full waves per width of the wave circle.
            waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
            waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
            waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
            waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
            waveAnimate: true, // Controls if the wave scrolls or is static.
            waveColor: "#178BCA", // The color of the fill wave.
            waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
            textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
            textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
            valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
            displayPercent: true, // If true, a % symbol is displayed after the value.
            textColor: "#045681", // The color of the value text when the wave does not overlap it.
            waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
          };
        }

        function loadLiquidFillGauge(elementId, value, config) {
          if(config == null) config = liquidFillGaugeDefaultSettings();

          //var gauge = d3.selectAll("#" + elementId);
          //var gauge = d3.select(element[0])

          var gauge = d3.select(element[0])
            .append("svg")
            .attr("width", config.width)
            .attr("height", config.height);
          console.log('var gauge', gauge)
          //var gauge = d3.select(document.getElementsByTagName('svg')[0])

          //var gauge = d3.select(angular.element).select("#" + elementId)
          var radius = Math.min(config.width, config.height)/2;
          var locationX = config.width/2 - radius;
          var locationY = config.height/2 - radius;

          // var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
          // var locationX = parseInt(gauge.style("width"))/2 - radius;
          // var locationY = parseInt(gauge.style("height"))/2 - radius;
          var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;


          var waveHeightScale;
          if(config.waveHeightScaling){
            waveHeightScale = d3.scale.linear()
              .range([0,config.waveHeight,0])
              .domain([0,50,100]);
          } else {
            waveHeightScale = d3.scale.linear()
              .range([config.waveHeight,config.waveHeight])
              .domain([0,100]);
          }

          var textPixels = (config.textSize*radius/2);
          var textFinalValue = parseFloat(value).toFixed(2);
          var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
          var percentText = config.displayPercent?"%":"";
          var circleThickness = config.circleThickness * radius;
          var circleFillGap = config.circleFillGap * radius;
          var fillCircleMargin = circleThickness + circleFillGap;
          var fillCircleRadius = radius - fillCircleMargin;
          var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

          var waveLength = fillCircleRadius*2/config.waveCount;
          var waveClipCount = 1+config.waveCount;
          var waveClipWidth = waveLength*waveClipCount;

          // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
          var textRounder = function(value){ return Math.round(value); };
          if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(1); };
          }
          if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(2); };
          }

          // Data for building the clip wave area.
          var data = [];
          for(var i = 0; i <= 40*waveClipCount; i++){
            data.push({x: i/(40*waveClipCount), y: (i/(40))});
          }

          // Scales for drawing the outer circle.
          var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
          var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

          // Scales for controlling the size of the clipping path.
          var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
          var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

          // Scales for controlling the position of the clipping path.
          var waveRiseScale = d3.scale.linear()
          // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
          // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
          // circle at 100%.
            .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
            .domain([0,1]);
          var waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
            .domain([0,1]);

          // Scale for controlling the position of the text within the gauge.
          var textRiseScaleY = d3.scale.linear()
            .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
            .domain([0,1]);

          // Center the gauge within the parent SVG.
          var gaugeGroup = gauge.append("g")
            .attr('transform','translate('+locationX+','+locationY+')');

          // Draw the outer circle.
          var gaugeCircleArc = d3.svg.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius-circleThickness));
          gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform','translate('+radius+','+radius+')');

          // Text where the wave does not overlap.
          var text1 = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.textColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

          // The clipping wave area.
          var clipArea = d3.svg.area()
            .x(function(d) { return waveScaleX(d.x); } )
            .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
            .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
          var waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId);
          var wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea)
            .attr("T", 0);

          // The inner circle with the clipping wave attached.
          var fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");
          fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

          // Text where the wave does overlap.
          var text2 = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.waveTextColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

          // Make the value count up.
          if(config.valueCountUp){
            var textTween = function(){
              var i = d3.interpolate(this.textContent, textFinalValue);
              return function(t) { this.textContent = textRounder(i(t)) + percentText; }
            };
            text1.transition()
              .duration(config.waveRiseTime)
              .tween("text", textTween);
            text2.transition()
              .duration(config.waveRiseTime)
              .tween("text", textTween);
          }

          // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
          var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
          if(config.waveRise){
            waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
              .transition()
              .duration(config.waveRiseTime)
              .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
              .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
          } else {
            waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
          }

          if(config.waveAnimate) animateWave();

          function animateWave() {
            wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
            wave.transition()
              .duration(config.waveAnimateTime * (1-wave.attr('T')))
              .ease('linear')
              .attr('transform','translate('+waveAnimateScale(1)+',0)')
              .attr('T', 1)
              .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
              });
          }

          function GaugeUpdater(){
            this.update = function(value){
              var newFinalValue = parseFloat(value).toFixed(2);
              var textRounderUpdater = function(value){ return Math.round(value); };
              if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
              }
              if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
              }

              var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
              };

              text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
              text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

              var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
              var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
              var waveRiseScale = d3.scale.linear()
              // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
              // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
              // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
              var newHeight = waveRiseScale(fillPercent);
              var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
              var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
              var newClipArea;
              if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                  .x(function(d) { return waveScaleX(d.x); } )
                  .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                  .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
              } else {
                newClipArea = clipArea;
              }

              var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
              wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                  if(config.waveAnimate){
                    wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                    animateWave(config.waveAnimateTime);
                  }
                });
              waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
            }
          }

          return new GaugeUpdater();
        }


        // var margin = {top: 15, right: 60, bottom: 150, left: 100},
        //   width = 400 - margin.left - margin.right,
        //   height = 360 - margin.top - margin.bottom;
        // var svg = d3.select(element[0])
        //   .append("svg")
        //   .attr('width', width + margin.left + margin.right)
        //   .attr('height', height + margin.top + margin.bottom)
        //   .attr('id', 'svg_id')
        //   .append("g")
        //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //
        // var x = d3.scale.ordinal().rangeRoundBands([0, width], .2);
        // var y = d3.scale.linear().rangeRound([height, 0]);
        //
        // var xAxis = d3.svg.axis()
        //   .scale(x)
        //   .orient("bottom");
        //
        // var yAxis = d3.svg.axis()
        //   .scale(y)
        //   .orient("left")
        //   .tickFormat(d3.format(".0%"));

        // scope.render = function (data) {
        //
        //   if (data === undefined) {
        //     return;
        //   }
        //
        //   svgContainer.selectAll("*").remove();
        //
        //   data.forEach(function (d) {
        //     d.value = +d.value;
        //   });
        //
        //   x.domain(data.map(function (d) { return d.cohortName; }));
        //   y.domain([0, d3.max(data, function (d) { return d.value; })]);
        //
        //   svg.selectAll('g.axis').remove();
        //   svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr("fill", "white")
        //     .call(xAxis)
        //     .selectAll("text")
        //     .style("text-anchor", "end")
        //     .style("font-size","12px")
        //     .attr("dx", "2em")
        //     .attr("dy", ".7em")
        //     .attr("transform", function(d) {
        //       return "rotate(-15)";
        //     });
        //
        //   svg.append("g")
        //     .attr("class", "y axis")
        //     .attr("fill", "white")
        //     .call(yAxis)
        //     .append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", -70)
        //     .attr("x", -30)
        //     .attr("dy", ".6em")
        //     .style("text-anchor", "end")
        //     .attr("fill", "white")
        //     .text("% of standards met");
        //
        //   var bars = svg.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .style("fill", "#45ADA8")
        //     .attr("x", function(d) { return x(d.cohortName); })
        //     .attr("width", x.rangeBand())
        //     .attr("y", function(d) { return y(d.value); })
        //     .attr("height", function(d) { return height - y(d.value); });
        //
        //   svg.selectAll("rect")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .attr("x", x.rangeBand() / 2)
        //     .attr("y", function(d) { return (d.value * 100); })
        //     .style("text-anchor", "middle")
        //     .style("font-size", "10px")
        //     .text(function(d) {return (d.value * 100); });
        //
        //   svg.selectAll(".label")
        //     .data(data)
        //     .enter().append("svg:text")
        //     .attr("class", "label")
        //     .attr("x", function(d) {
        //       return x(d.cohortName) + (x.rangeBand() / 3) - 5;
        //     })
        //     .attr("y", function(d) {
        //       return y(d.value) + 40;
        //     })
        //     .text(function(d) {
        //       return (d.value * 100).toFixed() + "%";
        //     });
        // };

        // scope.$watch('data', function () {
        //   scope.render(scope.data);
        // });
        // };
      }
    };
  }
]);