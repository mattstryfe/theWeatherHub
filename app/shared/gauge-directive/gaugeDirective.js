angular.module('myApp.gaugeDirective', ['ngRoute'])

  .directive( 'gaugeDirective', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/gauge-directive/gaugeDirective.html',
        bindings: {
          data: '<',
        },
        link: function (scope, element) {

          scope.render = function(data, gaugeIndex) {
            if (data === undefined) {
              return;
            }
            // svgContainer.selectAll("*").remove()
            //d3.select(element[0].svg).remove()

            //console.log('index', gaugeIndex)
            //let gaugeData = prepGaugeData(data)
            //buildWaterGuage(gaugeData)
            simpleChart(data)

          };
          scope.$watch('data', function(){
            scope.render(scope.data);
          });

          function simpleChart(data) {
            // console.log('data', data)
            //console.log('running simpleChart()...')
            // var data = [30, 86, 168, 281, 303, 365];
            let propOfPrecip = []
            data.probabilityOfPrecipitation.forEach((entry) => {
              propOfPrecip.push(entry.value)
            })

            let gaugeData = propOfPrecip
            //console.log('d3selectAll:', d3.selectAll(".gauge"))
            // console.log('d3select:', d3.select(element[0]).select('.gauge'))

            //d3.select(".gauge")
            d3.select(element[0]).select('.gauge')
              .selectAll("div")
              .data(gaugeData)
              .enter()
              .append("div")
              .attr("class", "bar-chart-defaults")
              .style("height",              function(d) { return d + "px"; })
              .text(function(d) { return d; });
          }
        }
      };
    }
  ]);