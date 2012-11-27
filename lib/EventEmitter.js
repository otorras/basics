;(function(exports){
	'use strict';

	function indexOf(listeners, listener, thisp) {
		var handlers = listeners.handlers,
			contexts = listeners.contexts,
			idx 	 = handlers.length;

		while (idx--)
			if (handlers[idx] === listener && contexts[idx] === thisp)
				return idx;

		return -1;
	}

	function defined(thing) {
		return typeof thing !== 'undefined';
	}

	function EventEmitter() {}

	EventEmitter.prototype = {
		on: function(event, listener, thisp) {
			var listeners = this.listeners(event);

			if (indexOf(listeners, listener, thisp) < 0) {
				listeners.handlers.push(listener);
				listeners.contexts.push(thisp);
			}
		},

		off: function(event, listener, thisp) {
			var listeners     = this.listeners(event),
				listenerIndex = indexOf(listeners, listener, thisp);

			if (listenerIndex >= 0) {
				listeners.handlers.splice(listenerIndex, 1);
				listeners.contexts.splice(listenerIndex, 1);
			}
		},

		emit: function(event/*, args*/) {
			var listeners = this.listeners(event),
				handlers  = listeners.handlers,
				contexts  = listeners.contexts,
				singleArg = arguments.length === 1,
				slice     = Array.prototype.slice,
				idx       = 0,
				len       = handlers.length;

			for ( ; idx < len; idx++) {
				if (singleArg)
					defined(contexts[idx]) ? handlers[idx].call(contexts[idx]) : handlers[idx]();
				else
					handlers[idx].apply(contexts[idx], slice.call(arguments, 1));
			}
		},

		once: function(event, listener, thisp){
			var self = this,
				listeners = this.listeners(event),
				wrapper;

			if (indexOf(listeners, listener, thisp) < 0) {
				wrapper = function() {
					if (arguments.length)
						listener.apply(thisp, arguments)
					else
						listener.call(thisp);

					self.off(event, wrapper, thisp);
				};

				listeners.handlers.push(wrapper);
				listeners.contexts.push(thisp);
			}
		},

		listeners: function(event) {
			var events = this._events || (this._events = {});

			return events[event] || (events[event] = {handlers: [], contexts: []});
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
