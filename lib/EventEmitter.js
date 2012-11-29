;(function(exports){
	'use strict';

	function indexOf(listeners, listener) {
		var idx = listeners.length;

		while (idx--) {
			if (listeners[idx][0] === listener) {
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

			return listener;
		},

		off: function(event, listener) {
			var listeners     = this.listeners(event),
				listenerIndex = indexOf(listeners, listener);

			if (listenerIndex >= 0) {
				listeners.splice(listenerIndex, 1);
			}
		},

		emit: function(event/*, args*/) {
			var listeners = this.listeners(event),
				singleArg = arguments.length === 1,
				slice     = Array.prototype.slice,
				idx       = 0,
				len       = listeners.length;

			for ( ; idx < len; idx++) {
				if (singleArg)
					defined(listeners[idx][1]) ? listeners[idx][0].call(listeners[idx][1]) : listeners[idx][0]();
				else
					listeners[idx][0].apply(listeners[idx][1], slice.call(arguments, 1));
			}
		},

		once: function(event, listener, thisp){
			var self = this,
				listeners = this.listeners(event),
				wrapper;

			if (indexOf(listeners, listener) < 0) {
				wrapper = function() {
					if (arguments.length)
						listener.apply(thisp, arguments)
					else
						listener.call(thisp);

					self.off(event, wrapper);
				};

				listeners.push([wrapper, thisp]);
			}

			return wrapper || listener;
		},

		listeners: function(event) {
			var events = this._events || (this._events = {});

			return events[event] || (events[event] = []);
		}
	};

	EventEmitter.mixin = function(target) {
		var props = ['on', 'off', 'emit', 'once', 'listeners'];

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
