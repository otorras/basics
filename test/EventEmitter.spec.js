(function(EventEmitter, expect, sinon) {
  'use strict';

  if (typeof require === 'function') {
    EventEmitter = require('../core/EventEmitter').EventEmitter;
    expect = require('expect.js');
    sinon = require('sinon');
  }

  describe('An EventEmitter:', function() {
    var emitter, aEvent = 'a event', anotherEvent = 'another event';

    beforeEach(function() {
      emitter = new EventEmitter;
    });

    afterEach(function() {
      emitter = null;
    });

    it('should has an empty array of listeners for a specific event by default', function(){
      expect(emitter.listeners(aEvent)).to.have.length(0);
    });

    it('should be able to add a listener attached to an event', function() {
      emitter.on(aEvent, function() {});

      expect(emitter.listeners(aEvent)).to.have.length(1);
    });

    it("should have #on chainable", function() {
      expect(emitter.on()).to.be(emitter);
    });

    it("should have #once chainable", function() {
      expect(emitter.once()).to.be(emitter);
    });

    it("should have #when chainable", function() {
      expect(emitter.when()).to.be(emitter);
    });

    it("should have #off chainable", function() {
      expect(emitter.off()).to.be(emitter);
    });

    it("should have #trigger as an alias of #emit", function() {
      var spy = sinon.spy();

      emitter.on(aEvent, spy);
      emitter.emit(aEvent);
      emitter.trigger(aEvent);

      expect(spy.calledTwice).to.be(true);
    });

    describe('when events are emitted', function () {
      it('should call all the events handlers attached once', function () {
        var spy1 = sinon.spy(), spy2 = sinon.spy();

        emitter.on(aEvent, spy1);
        emitter.on(aEvent, spy2);

        emitter.emit(aEvent);

        expect(spy1.calledOnce);
        expect(spy2.calledOnce);
      });

      it('should call the listener attached to different events', function() {
        var spy = sinon.spy();

        emitter.on(aEvent, spy);
        emitter.on(anotherEvent, spy);

        emitter.emit(aEvent);
        emitter.emit(anotherEvent);

        expect(spy.calledTwice);
      });

      it("should call the listeners in order", function() {
        var spy1 = sinon.spy(), spy2 = sinon.spy();

        emitter.on(aEvent, spy1);
        emitter.on(aEvent, spy2);
        emitter.emit(aEvent);

        expect(spy1.calledBefore(spy2)).to.be(true);
      });

      it("should call the listeners with the exact arguments", function() {
        var spy = sinon.spy(), arg1 = 15, arg2 = [], arg3 = {};

        emitter.on(aEvent, spy);
        emitter.emit(aEvent, arg1, arg2, arg3);

        expect(spy.calledWithExactly(arg1, arg2, arg3)).to.be(true);
      });

      it("should call the listeners with the object bound", function() {
        var bound = { dummy: false };
        var listener = function(value) { this.dummy = value; };
        var arg = true;

        emitter.on(aEvent, listener, bound);
        emitter.emit(aEvent, arg);

        expect(bound.dummy).to.be(arg);
      });

      describe("and once is used to attach listener", function() {
        it("should call the listener once allways", function() {
          var spy = sinon.spy();

          emitter.once(aEvent, spy);
          emitter.emit(aEvent);
          emitter.emit(aEvent);

          expect(spy.calledOnce).to.be(true);
        });

        it("should not call the listener removed", function() {
          var spy = sinon.spy();

          emitter.once(aEvent, spy);
          emitter.off(aEvent, spy);
          emitter.emit(aEvent);

          expect(spy.called).to.be(false);
        });
      });

      describe('and when is used to attach listener', function () {
        it('should call the listener until it returns true', function () {
          var times = 3, called = 0;
          var spy = sinon.spy(function() {
            if (++called === times)
              return true;
          });

          emitter.when(aEvent, spy);
          for (var i = 0, len = times * 2; i < len; i++)
            emitter.emit(aEvent);

          expect(spy.callCount).to.equal(times);
        });

        it("should not call the listener removed", function() {
          var spy = sinon.spy();

          emitter.when(aEvent, spy);
          emitter.off(aEvent, spy);
          emitter.emit(aEvent);

          expect(spy.called).to.be(false);
        });
      });
    });

    describe('when off() is called', function() {
      describe('without any parameters', function() {
        it('should remove all the listeners of all the events', function() {
          var spy1 = sinon.spy(), spy2 = sinon.spy();

          emitter.on(aEvent, spy1);
          emitter.on(anotherEvent, spy1);
          emitter.on(anotherEvent, spy2);

          emitter.off();

          emitter.emit(aEvent);
          emitter.emit(anotherEvent);

          expect(emitter.listeners(aEvent)).to.have.length(0);
          expect(emitter.listeners(anotherEvent)).to.have.length(0);
          expect(spy1.called).to.be(false);
          expect(spy2.called).to.be(false);
        });
      });

      describe('with the event parameter only', function() {
        it('should remove all the listeners of that event', function() {
          var spy1 = sinon.spy(), spy2 = sinon.spy();

          emitter.on(aEvent, spy1);
          emitter.on(aEvent, spy2);

          emitter.off(aEvent);

          emitter.emit(aEvent);

          expect(emitter.listeners(aEvent)).to.have.length(0);
          expect(spy1.called).to.be(false);
          expect(spy2.called).to.be(false);
        });
      });

      describe('with the event and listener parameter', function() {
        it("should remove that specific listener from the event", function(){
          var spy = sinon.spy();

          emitter.on(aEvent, spy);
          emitter.off(aEvent, spy);
          emitter.emit(aEvent);

          expect(spy.called).to.be(false);
        });
      });
    });
  });
}(
  typeof EventEmitter !== 'undefined' ? EventEmitter : null,
  typeof expect !== 'undefined' ? expect : null,
  typeof sinon !== 'undefined' ? sinon : null
));
