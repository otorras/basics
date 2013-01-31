describe('EventEmitter', function() {
  var ee, evt = 'evt';

  beforeEach(function() {
    ee = new EventEmitter;
  });

  afterEach(function() {
    ee = null;
  });

  it('should has an empty array of listeners for a specific event by default', function(){
    expect(ee.listeners(evt)).to.have.length(0);
  });

  it('should be able to add a listener attached to an event', function() {
    ee.on(evt, function() {});

    expect(ee.listeners(evt)).to.have.length(1);
  });

  it("should have #on chainable", function() {
    expect(ee.on()).to.be(ee);
  });

  it("should have #once chainable", function() {
    expect(ee.once()).to.be(ee);
  });

  it("should have #when chainable", function() {
    expect(ee.when()).to.be(ee);
  });

  it("should have #off chainable", function() {
    expect(ee.off()).to.be(ee);
  });

  describe('when an event is emitted', function () {
    it('should call the listeners once', function () {
      var spy1 = sinon.spy(), spy2 = sinon.spy();


      ee.on(evt, spy1);
      ee.on(evt, spy2);

      ee.emit(evt);

      expect(spy1.calledOnce);
      expect(spy2.calledOnce);
    });

    it("should call the listeners in order", function() {
      var spy1 = sinon.spy(), spy2 = sinon.spy();

      ee.on(evt, spy1);
      ee.on(evt, spy2);
      ee.emit(evt);

      expect(spy1.calledBefore(spy2)).to.be(true);
    });

    it("should call the listeners with the exact arguments", function() {
      var spy = sinon.spy(), arg1 = 15, arg2 = [], arg3 = {};

      ee.on(evt, spy);
      ee.emit(evt, arg1, arg2, arg3);

      expect(spy.calledWithExactly(arg1, arg2, arg3)).to.be(true);
    });

    it("should call the listeners with the object bound", function() {
      var bound = { dummy: false };
      var listener = function(value) { this.dummy = value; };
      var arg = true;

      ee.on(evt, listener, bound);
      ee.emit(evt, arg);

      expect(bound.dummy).to.be(arg);
    });

    it("should not call the listener removed", function(){
      var spy = sinon.spy();

      ee.on(evt, spy);
      ee.off(evt, spy);
      ee.emit(evt);

      expect(spy.called).to.be(false);
    });

    describe("and once is used to attach listener", function() {
      it("should call the listener once allways", function() {
        var spy = sinon.spy();

        ee.once(evt, spy);
        ee.emit(evt);
        ee.emit(evt);

        expect(spy.calledOnce).to.be(true);
      });

      it("should not call the listener removed", function() {
        var spy = sinon.spy();

        ee.once(evt, spy);
        ee.off(evt, spy);
        ee.emit(evt);

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

        ee.when(evt, spy);
        for (var i = 0, len = times * 2; i < len; i++)
          ee.emit(evt);

        expect(spy.callCount).to.equal(times);
      });

      it("should not call the listener removed", function() {
        var spy = sinon.spy();

        ee.when(evt, spy);
        ee.off(evt, spy);
        ee.emit(evt);

        expect(spy.called).to.be(false);
      });
    });
  });
});
