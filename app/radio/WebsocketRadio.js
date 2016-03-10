'use strict'

var Radio = require('./Radio')

var WebsocketRadio = function () {
  // This is a Web Socket implementation of Radio class
  // We are implementing a lot of things here like the connection, a websocket implementations of the
  // methods setFlaps() and setLandingGear(), and is responsible to call the callbacks provided by it
  // parent Radio like onDataChangesCb() and onConnChangesCb() with the new values.
  //
  // One of the best features of this class and the one which was really struggling me is the normalyzeSpike().

  this.uri = 'ws://ec2-54-228-248-101.eu-west-1.compute.amazonaws.com:8888/telemetry'
  this.airspeedBuffer = []
  this.altitudeBuffer = []

  this.normalyzeSpike = function (v, array) {
    // I didnt want to implement a simple normalizer for the signal just looking for differences bigger than X,
    // with a simple difference check we can fall in the mistake to believe is a spike and maybe is a huge acceleration.
    //
    // I dont know what aircrafts would use this software and I tried to dont set any static value,
    // I though that if I set a static difference checker of for example -+500, this software would be
    // useless in a future when fasters aircraft able to make that acceleration use it.
    //
    // Thats why I though on this system, basically we fill a buffer with the three latest values and we analyze the middle position.
    // We also normalized the values and fix it to a precision of 1 float decimal, and if is no differences, that mean the speed is stable.
    // If we notice that is a change in the speed, this can be an acceleration or a lonely spike, then we compair the read after that one to check it.

    // Add new value to array
    array.push(v)
    if (array.length > 3) {
      // Keep only latest three
      array.shift(1)
      // Normalize the values in a new array and reduce precision
      var div = Math.sqrt(Math.pow(array[0], 2) + Math.pow(array[1], 2) + Math.pow(array[2], 2))
      var normalized = [
        (array[0] / div).toFixed(1),
        (array[1] / div).toFixed(1),
        (array[2] / div).toFixed(1)
      ]
      // We can have a spike or a huge acceleration, lets analyze [2]
      // ex: acceleration [0.1, 0.3, 0.5] or [0.1, 0.3, 0.3]
      // ex: spike [0.1, 0.3, 0.1]
      if ((normalized[0] !== normalized[1]) && (normalized[0] === normalized[2])) {
        // Spike detected in [1] !
        // Fix it returning the next value next to the spike
        // Note: We never can trust on [0] due this can be the firsts 3 buffered values that never was analyzed
        return array[2]
      }
      // Return the just analyzed value
      return array[1]
    }
  }
}

WebsocketRadio.prototype = new Radio()

WebsocketRadio.prototype.connect = function () {
  // Start connection
  var _this = this
  this.onConnChangesCb(this.STATE_CONNECTING)
  this.socket = new WebSocket(this.uri)
  this.socket.onopen = function () {
    _this.onConnChangesCb(_this.STATE_CONNECTED)

    this.onmessage = function (evt) {
      try {
        var dataObj = JSON.parse(evt.data)
      } catch (err) {
        return
      }
      // Normalize data and update values
      dataObj.telemetry.airspeed = _this.normalyzeSpike(dataObj.telemetry.airspeed, _this.airspeedBuffer)
      dataObj.telemetry.altitude = _this.normalyzeSpike(dataObj.telemetry.altitude, _this.altitudeBuffer)
      // fire callback
      _this.onDataChangesCb(dataObj)
    }

    this.onclose = function () {
      _this.onConnChangesCb(_this.STATE_DISCONNECTED)
      // Should we implement Exponential Backoff algorithm ?
      // Fire callback
      _this.connect()
    }
  }
}

WebsocketRadio.prototype.setFlaps = function (state) {
  // Send flaps command
  // NOTE: This is sending data but look like ALWAYS ignored :-/
  var msg = JSON.stringify({type: 'flaps', value: state})
  this.socket.send(msg)
  console.log(msg)
}

WebsocketRadio.prototype.setLandingGear = function (state) {
  // Set landing gear command
  // NOTE: This is sending data but look like ALWAYS ignored :-/
  var msg = JSON.stringify({type: 'landing_gear', value: state ? 1 : 0})
  this.socket.send(msg)
}

module.exports = WebsocketRadio
