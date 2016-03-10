'use strict'

var template = require('../views/connection.html')

var Conn = function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      state: '='
    },
    templateUrl: template
  }
}

module.exports = Conn
