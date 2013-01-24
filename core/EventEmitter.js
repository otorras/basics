;(function(exports){
  'use strict';

  function indexOf(listeners, listener) {
    var idx = listeners.length,
        value;

    while (idx--) {
      value = listeners[idx][0];
      if (value === listener || (value.listener && value.listener === listener)) {
        return idx;
      }
    }

    return -1;
  }

  function defined(thing) {
    return typeof thing !== 'undefined';
  }

  function EventEmitter() {}

  EventEmitter.prototype = {
    on: function(event, listener, thisp) {
      var listeners = this.listeners(event);

      if (indexOf(listeners, listener) < 0) {
        listeners.push([listener, thisp]);
      }

      return this;
    },

    off: function(event, listener) {
      var listeners     = this.listeners(event),
        listenerIndex = indexOf(listeners, listener);

      if (listenerIndex >= 0) {
        listeners.splice(listenerIndex, 1);
      }

      return this;
    },

    emit: function(event/*, args*/) {
      var listeners = this.listeners(event),
        singleArg = arguments.length === 1,
        slice     = Array.prototype.slice,
        idx       = 0,
        len       = listeners.length;

      for ( ; idx < len; idx++) {
        if (singleArg) {
          if (defined(listeners[idx][1]))
            listeners[idx][0].call(listeners[idx][1]);
          else
            listeners[idx][0]();
        } else {
          listeners[idx][0].apply(listeners[idx][1], slice.call(arguments, 1));
        }
      }
    },

    once: function(event, listener, thisp){
      var self = this;
      function one() {
        listener.apply(this, arguments);
        self.off(event, one);
      }

      one.listener = listener;
      this.on(event, one, thisp);

      return this;
    },

    when: function(event, listener, thisp) {
      var self = this;
      function check() {
        if (listener.apply(this, arguments)) {
          self.off(event, check);
        }
      }

      check.listener = listener;
      this.on(event, check, thisp);

      return this;
    },

    listeners: function(event) {
      var events = this._events || (this._events = {});

      return events[event] || (events[event] = []);
    }
  };

  EventEmitter.mixin = function(target) {
    var props = ['on', 'off', 'emit', 'once', 'when', 'listeners'];

    for (var i = props.length; i--; )
      target[props[i]] = EventEmitter.prototype[props[i]];
  };

  // Expose the class either via AMD or the global object
  if (typeof define === 'function' && define.amd)
    define(function() {
      return EventEmitter;
    });
  else
    exports.EventEmitter = EventEmitter;
}(this));
