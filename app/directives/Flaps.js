'use strict'

var template = require('../views/flaps.html')

var Flaps = function ($timeout) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      state: '=',
      interactionCallback: '='
    },
    controller: function ($scope) {
      // Flaps position clicked
      $scope.onClick = function (index) {
        $scope.state = index
        // Order it in the next cycle (scope.state sync issues)
        $timeout(function () {
          $scope.interactionCallback()
        })
      }
    },
    templateUrl: template
  }
}

module.exports = Flaps
