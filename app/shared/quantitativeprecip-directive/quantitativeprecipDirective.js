angular.module('myApp.quantitativeprecipDirective', ['ngRoute'])

  .directive( 'quantitativeprecipDirective', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/quantitativeprecip-directive/quantitativeprecipDirective.html',
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