angular.module('myApp.gaugeDirective', ['ngRoute'])

  .directive( 'gaugeDirective', [
    function () {
      return {
        restrict: 'E',
        //template: '<div class="pie_chart"></div>',
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
            console.log('data', data)
            //console.log('running simpleChart()...')
            //var data = [30, 86, 168, 281, 303, 365];

            //console.log('d3selectAll:', d3.selectAll(".chart"))
            //console.log('d3select:', d3.select(element[0]).select('.chart'))

            d3.select(".gauge")
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









          function prepGaugeData(data) {}

          function buildWaterGuage (gaugeData) {}

        }
      };
    }
  ]);