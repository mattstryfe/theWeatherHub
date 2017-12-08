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
            //svgContainer.selectAll("*").remove()

            simpleChart(data)

          };
          scope.$watch('data', function(){
            scope.render(scope.data);
          });

          function simpleChart(data) {
            // clear elements within holder each time.  Prevents overlap
            d3.select(element[0]).selectAll('*').remove()

            let propOfPrecip = []
            let quanOfprecip = 0;

            data.probabilityOfPrecipitation.forEach((entry) => {
              propOfPrecip.push(entry.value)
            })

            data.quantitativePrecipitation.forEach((entry) => {
              quanOfprecip += entry.value
            })
            console.log(quanOfprecip)

            let gaugeData = propOfPrecip

            //d3.select(".gauge")
            var gauge = d3.select(element[0])
              .selectAll("div")
              .data(gaugeData)
              .enter()
              .append("div")
              .transition().ease("elastic")
              .attr("class", "bar-chart-defaults")
              .style("height", function(d) { return d + "px"; });
            console.log('gauge', gauge)
            var data = [10, 20, 30, 40];
            var circles = d3.select(element[0]).select('circle')
            console.log('circles', circles)
            circles.selectAll('circle').data(data)
            circles.attr('r', function(d, i) { return d; });
            // var quanOfPrecip = d3.select(element[0])
            //   .selectAll("div")
            //   .data(quanOfprecip)
            //   .enter().append("div")
            //   .attr('cx', 25)
            //   .attr('cy', 15)
            //   .attr('r', 5)
            //   .style('fill', 'red');


            //.text(function(d) { return d; });




            // working copy
            // d3.select(element[0])
            //   .selectAll("div")
            //   .data(gaugeData)
            //   .enter()
            //   .append("div")
            //   .transition().ease("elastic")
            //   .attr("class", "bar-chart-defaults")
            //   .style("height", function(d) { return d + "px"; });
          }
        }
      };
    }
  ]);