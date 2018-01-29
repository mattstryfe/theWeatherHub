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

            quantitativePrecip(data)

          };
          scope.$watch('data', function(){
            scope.render(scope.data);
          });

          function quantitativePrecip(data) {
            // console.log('data', data);

            let quanOfPrecip = 0;

            data.quantitativePrecipitation.forEach((entry) => {
              quanOfPrecip += entry.value;
            });

            scope.precipTotal = quanOfPrecip;

            console.log('precipTotal', scope.precipTotal);

          }
        }
      };
    }
  ]);

// TODO rename this directive to precips.
// it can then hold all variations.