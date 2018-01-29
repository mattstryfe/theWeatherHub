angular.module('myApp.precipsDirective', ['ngRoute'])

  .directive( 'precipsDirective', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/precips-directive/precipsDirective.html',
        scope: {
          data: '<'
        },
        bindings: {},
        link: function (scope, element) {

          scope.render = function(data) {
            if (data === undefined) {
              return;
            }

            quantitativePrecip(data.quantitativePrecipitation);
            calcSnowfallAmount(data.snowfallAmount);

          };
          scope.$watch('data', function(){
            scope.render(scope.data);
          });

          // calculate snowfall, if there is any
          function calcSnowfallAmount(snowfallAmount) {
            console.log('snowfall amount', snowfallAmount);

            let snowfallTotal = 0;
            snowfallAmount.forEach((entry) => {
              snowfallTotal += entry.value;
            });
            scope.snowfallTotal = snowfallTotal;
          }

          function quantitativePrecip(quantitativePrecipitation) {
            // console.log('data', data);

            let quanOfPrecip = 0;

            quantitativePrecipitation.forEach((entry) => {
              quanOfPrecip += entry.value;
            });

            scope.precipTotal = quanOfPrecip;

            //console.log('precipTotal', scope.precipTotal);

          }
        }
      };
    }
  ]);

// TODO rename this directive to precips.
// it can then hold all variations.