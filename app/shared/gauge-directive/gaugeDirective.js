angular.module('myApp.gaugeDirective', ['ngRoute'])

  .directive( 'gaugeDirective', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/gauge-directive/gaugeDirective.html',
        scope: {
          data: '<'
        },
        bindings: {},
        link: function (scope, element) {

          scope.render = function(data, gaugeIndex) {
            if (data === undefined) {
              return;
            }

            simpleChart(data)

          };
          scope.$watch('data', function(){
            scope.render(scope.data);
          });

          function simpleChart(data) {
            // clear elements within holder each time.  Prevents overlap
            // d3.select(element[0]).selectAll('*').remove()
            d3.select(element[0]).select(".graph").selectAll('*').remove()

            let propOfPrecip = []
            let quanOfprecip = 0;

            data.probabilityOfPrecipitation.forEach((entry) => {
              propOfPrecip.push(entry.value)
            })

            data.quantitativePrecipitation.forEach((entry) => {
              quanOfprecip += entry.value
            })

            let gaugeData = propOfPrecip
            scope.precipTotal = quanOfprecip

            //d3.select(".gauge")
            // console.log('ele', d3.select(element[0]))
            // console.log('ele + graph', d3.select(element[0]).select(".graph"))
            //console.log('graph only', d3.select(".graph"))
            // var gauge = d3.select(element[0]).select(".graph")
            // works var gauge = d3.select(element[0])
            var graph = d3.select(element[0]).select(".graph")
              .selectAll(".graph")
              .data(gaugeData)
              .enter()
              .append("div")
              .transition().ease("elastic")
              .attr("class", "bar-chart-defaults")
              .style("height", function(d) { return d + "px"; })
              .append("text")
              .attr("transform", "rotate(-90)")
              .text(function(d) {return d;});
              //.text(function(d) { return d; })
              //.attr("transform", "rotate(-90)");


            // gauge
            var gauge = d3.select(element[0]).select(".gauge-holder").append("svg");
            var grad = gauge.append("defs").append("linearGradient")
              .attr("id", "grad")
              .attr("x1", "0%")
              .attr("x2", "0%")
              .attr("y1", "100%")
              .attr("y2", "0%");
            grad.append("stop").attr("offset", "50%").style("stop-color", "steelblue");
            grad.append("stop").attr("offset", "50%").style("stop-color", "white");

            var r = 20;
            gauge.append("circle")
              .attr("cx", r)
              .attr('cy', r)
              .attr('r', r)
              //.attr('stroke', 'blue')
              .attr('fill', 'url(#grad');
            // var data = [10, 20, 30, 40];
            // var circles = d3.select(element[0]).select('circle')
            // console.log('circles', circles)
            // circles.selectAll('circle').data(data)
            // circles.attr('r', function(d, i) { return d; });
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