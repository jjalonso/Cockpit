'use strict'

var template = require('../views/gauge.html')

var Gauge = function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      data: '=',
      showNeedle: '='
    },
    link: function (scope, element, attributes) {
      var needleElem = element[0].getElementsByClassName('bigNeedle')[0]
      // on data.current changes, update the needle css
      // Another aproach was using one CSS class per number, set transitions and only change classes,
      // but for a coding-test this is time-cheaper
      scope.$watch('data.current', function (newVal) {
        var currentDeg = (scope.data.current * 359 / 500)
        needleElem.style.transform = 'rotate(' + currentDeg + 'deg)'
        // Update averages (We calculate it here to be able to use Math)
        scope.avg = scope.data.min < 99999 ? Math.floor((scope.data.max + scope.data.min) / 2) : '-'
      })
    },
    templateUrl: template
  }
}

module.exports = Gauge
