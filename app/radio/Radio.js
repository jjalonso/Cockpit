'use strict'

var Radio = function () {
  // This is a parent class more than a strict interface.
  // Is the base for all radio implementations, and also contain builtin features
  // like states constant and subscriptions methods to callbacks
  //
  // Any implementation of a Radio should inherit from this prototype and override the
  // methods specifically for that type of transport protocol
  //
  // This class is also agnostic to the other side (JS framework) from where you want to use it.
  // Thats why is using a callback systems to return the data when changes
  //
  //    +--------------+      +----------+      +-----------+
  //    | UI Framework | <--> |  MyRadio | <--> |   Server  |
  //    +--------------+      +----------+      +-----------+
  //
  this.STATE_CONNECTED = 'STATE_CONNECTED'
  this.STATE_DISCONNECTED = 'STATE_DISCONNECTED'
  this.STATE_CONNECTING = 'STATE_CONNECTING'
  this.onDataChangesCb = null
  this.onConnChangesCb = null
}

Radio.prototype.connect = function () { throw new Error('connect() method should be implemented') }
Radio.prototype.setFlaps = function (state) { throw new Error('setFlaps() method should be implemented') }
Radio.prototype.setLandingGear = function (state) { throw new Error('setLandingGear() method should be implemented') }

Radio.prototype.setOnDataChangesCb = function (fn) {
  // Built-in subscription method
  this.onDataChangesCb = fn
}

Radio.prototype.setOnConnChangesCb = function (fn) {
  // Built-in subscription method
  this.onConnChangesCb = fn
}

module.exports = Radio
