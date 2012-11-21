(function(exports){
	'use strict';

	function EventEmitter() {}

	EventEmitter.prototype = {
		on: function(event, listener) {
			var listeners = this.listeners(event);

			if (listeners.indexOf(listener) < 0)
				listeners.push(listener);

			return listener;
		},

		off: function(event, listener) {
			var listeners = this.listeners(event);
			var listenerIndex = listeners.indexOf(listener);

			if (listenerIndex >= 0)
				listeners.splice(listenerIndex, 1);
		},

		emit: function(event/*, args*/) {
			var listeners = this.listeners(event),
				singleArg = arguments.length === 1,
				slice = Array.prototype.slice;


			for (var i = 0, len = listeners.length; i < len; i++) {
				singleArg ? listeners[i]() : listeners[i].apply(null, slice.call(arguments, 1));
			}
		},

		once: function(event, listener){
			var self = this,
				listeners = this.listeners(event),
				wrapper;

			if (listeners.indexOf(listener) < 0) {
				wrapper = function() {
					if (arguments.length)
						listener.apply(null, arguments)
					else
						listener();

					self.off(event, wrapper);
				};
				listeners.push(wrapper);

				return wrapper;
			} else {
				return listener;
			}

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
	if(typeof define === 'function' && define.amd)
		define(function() {
			return EventEmitter;
		});
	else
		exports.EventEmitter = EventEmitter;
}(this));