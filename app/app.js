'use strict'

var Angular = require('angular')

var CockpitController = require('./controllers/Cockpit')
var ConnectionDirective = require('./directives/Connection')
var LandingDirective = require('./directives/Landing')
var FlapsDirective = require('./directives/Flaps')
var GaugeDirective = require('./directives/Gauge')

require('./styles/index.scss')

// App module
var app = Angular.module('App', [])

// Controllers
app.controller('CockpitController', ['$scope', '$timeout', CockpitController])

app.directive('connectionDirective', [ConnectionDirective])
app.directive('landingDirective', ['$timeout', LandingDirective])
app.directive('flapsDirective', ['$timeout', FlapsDirective])
app.directive('gaugeDirective', [GaugeDirective])
