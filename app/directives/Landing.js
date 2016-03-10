'use strict'

var template = require('../views/landing.html')

var Landing = function ($timeout) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      state: '=',
      interactionCallback: '='
    },
    controller: function ($scope) {
      // On landing gear switch clicked
      $scope.onClick = function () {
        $scope.state = !$scope.state
        // Order it in the next cycle (scope.state sync issues)
        $timeout(function () {
          $scope.interactionCallback()
        })
      }
    },
    templateUrl: template
  }
}

module.exports = Landing
