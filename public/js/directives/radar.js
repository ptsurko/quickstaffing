angular.module('QuickStaffing')
  .directive('radar', [function() {
    return {
      restrict: 'EA',
      scope: {
        personParameters: '=',
        averageParameters: '='
      },
      link: function(scope, element, attrs) {
        var w = 300,
            h = 300;

        //Options for the Radar chart, other than default
        var mycfg = {
          w: w,
          h: h,
          maxValue: 0.6,
          levels: 6,
          ExtraWidthX: 200
        };

        scope.$watchCollection('[personParameters, averageParameters]', function() {
          var parameters = [
            scope.personParameters,
            scope.averageParameters
          ];

          RadarChart.draw(element[0], parameters, mycfg);
        });
      }
    }
  }]);
