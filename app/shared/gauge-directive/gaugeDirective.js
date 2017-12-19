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

          scope.render = function(data) {
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
            d3.select(element[0]).select(".new-graph").selectAll('*').remove()
            console.log(d3.selectAll('.percent').selectAll('.tick'))

            let probfPrecip = []
            let quanOfprecip = 0;
            var margin = {top: 20, right: 20, bottom: 30, left: 50};

            data.probabilityOfPrecipitation.forEach((entry) => {
              probfPrecip.push(entry.value)
            })

            data.quantitativePrecipitation.forEach((entry) => {
              quanOfprecip += entry.value
            })

            let gaugeData = probfPrecip
            scope.precipTotal = quanOfprecip

            //d3.select(".gauge")
            // console.log('ele', d3.select(element[0]))
            // console.log('ele + graph', d3.select(element[0]).select(".graph"))
            //console.log('graph only', d3.select(".graph"))
            // var gauge = d3.select(element[0]).select(".graph")
            // works var gauge = d3.select(element[0])


            var gx = d3.scaleTime()
              .rangeRound([0, width]);
            var gy = d3.scaleLinear()
              .domain([0, 100])
              .range([height, 0]);

            var graph = d3.select(element[0]).select(".graph")
              .selectAll(".graph")
              .data(gaugeData)
              .enter()
              .append("div")
              .transition()
              .ease(d3.easeBounce)
              .attr("class", "bar-chart-defaults")
              .style("height", function(d) { return d + "%"; });





            // NEW GRAPH AREA
            var parser = d3.timeParse('%Y-%m-%dT%H:%M:%S');

            var margin = {top: 5, right: 5, bottom: 20, left: 10},
              height = 70,
              width = 150;

            var newGraph = d3.select(element[0]).select('.new-graph')
              .append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var g = newGraph.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // AXIS Stuff
            var x = d3.scaleTime()
              .rangeRound([0, width]);
            var y = d3.scaleLinear()
              .domain([0, 100])
              .range([height, 0]);
              // .ticks(5);
            //var y = d3.scaleLinear().rangeRound([height, 0]);

            var line = d3.line()
              .x(function(d) { return x(d.time); })
              .y(function(d) { return y(d.value); });

            let newGraphData = data.probabilityOfPrecipitation

            newGraphData.forEach(function(d) {
              d.value = +d.value;
              d.time = parser(d.validTime);
            });

            x.domain(d3.extent(newGraphData, function(d) { return d.time; }));
            //y.domain(d3.extent(newGraphData, function(d) { return d.value; }));

            g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x)
                .tickSizeOuter(0)
                .tickSize(6, 0)
                .tickFormat(d3.timeFormat('%I %p'))
                // .tickFormat("%I %p")
                .ticks(d3.timeHour.every(6)))
                // .tickFormat(d => d3.time.format(d, '%H')))
                // // .tickFormat(d => d.d3.time.format('%H')))
                // .tickFormat(d3.time.format("%H")))
              .select(".domain")
              .remove();

            g.append("g")
              .attr('class', 'percent')
              .call(d3.axisLeft(y)
                .tickSizeOuter(0)
                .ticks(4)
                .tickSize(-width, 0)
                .tickFormat(''));
                // .tickFormat(d => d + '%'));
                // .tickFormat('5', "%"));
              // .append("text")
              //   .attr("fill", "#000")
              //   .attr("transform", "rotate(-90)")
              //   .attr("y", 6)
              //   .attr("dy", "0.71em")
              //   .attr("text-anchor", "end")
              // .text("Precip Chance ($)");

            g.append("path")
              .datum(newGraphData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
              .transition()
              .ease(d3.easeBounce)
              .attr("d", line);






















            // gauge
            // var gauge = d3.select(element[0]).select(".gauge-holder").append("svg");
            // var grad = gauge.append("defs").append("linearGradient")
            //   .attr("id", "grad")
            //   .attr("x1", "0%")
            //   .attr("x2", "0%")
            //   .attr("y1", "100%")
            //   .attr("y2", "0%");
            // grad.append("stop").attr("offset", "50%").style("stop-color", "steelblue");
            // grad.append("stop").attr("offset", "50%").style("stop-color", "white");
            //
            // var r = 20;
            // gauge.append("circle")
            //   .attr("cx", r)
            //   .attr('cy', r)
            //   .attr('r', r)
            //   .attr('fill', 'url(#grad');

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