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
        var svgContainer = d3.select(element[0])
          .append("svg")
          .attr("width", 50)
          .attr("height", 50);
        svgContainer.append("circle")
          .style("stroke", "gray")
          .style("fill", "black")
          .attr("cx", 30)
          .attr("cy", 30)
          .attr("r", 20);

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