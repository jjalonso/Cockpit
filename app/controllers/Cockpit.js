'use strict'

var WebsocketRadio = require('../radio/WebsocketRadio')
require('../views/cockpit.html')

var Main = function ($scope, $timeout) {
  $scope.landingState = false
  $scope.flapsState = 0
  $scope.airspeed = {
    current: 0,
    min: 99999, // I would like to use Infinity, but comparison is failing in Angular templates
    max: 0
  }
  $scope.altitude = {
    current: 0,
    min: 99999, // I would like to use Infinity, but comparison is failing in Angular templates
    max: 0
  }

  var radio = new WebsocketRadio()

  $scope.onLandingChanged = function () {
    // User interaction callback (LandineDirective): Send data to Aircraft
    radio.setLandingGear($scope.landingState)
  }

  $scope.onFlapsChanged = function () {
    // User interaction callback (FlapsDirective): Send data to Aircraft
    radio.setFlaps($scope.flapsState)
  }

  radio.setOnDataChangesCb(function (data) {
    // Radio callback for new sensors data: Update scope vars
    $timeout(function () {
      var t = data.telemetry
      var c = data.control
      $scope.flapsState = c.flaps
      $scope.landingState = c.landing_gear
      $scope.airspeed.current = t.airspeed
      $scope.altitude.current = t.altitude
      // Get records for min/max if possible
      if (t.altitude > $scope.altitude.max) $scope.altitude.max = t.altitude
      if (t.altitude < $scope.altitude.min) $scope.altitude.min = t.altitude
      if (t.airspeed > $scope.airspeed.max) $scope.airspeed.max = t.airspeed
      if (t.airspeed < $scope.airspeed.min) $scope.airspeed.min = t.airspeed
    })
  })

  radio.setOnConnChangesCb(function (data) {
    // Radio callback for new connection changes: Update scope vars
    $timeout(function () {
      $scope.connectionState = data
    })
  })

  // Init !!!
  radio.connect()
}

module.exports = Main
