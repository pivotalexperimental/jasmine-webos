describe('jasmine.webos.FakeDepot', function() {
  var depot;

  describe('new', function() {
    describe('with no parameters', function() {
      it('should not fail', function() {
        depot = new jasmine.webos.FakeDepot();
        expect("got here").toBeDefined();
      });
    });

    describe('with an object parameter', function() {
      var seedObject;

      beforeEach(function() {
        seedObject = { foo: 1, bar: { an: "object" } };
        depot = new jasmine.webos.FakeDepot(seedObject);
      });

      it('should pre-populate the depot with copies of all specified key/value pairs', function() {
        for (key in seedObject) {
          expect(depot.peek(key)).toEqual(seedObject[key]);
        }
      });

      it('should clone the seed values', function() {
        expect(depot.peek('bar')).toEqual(seedObject['bar']);
        expect(depot.peek('bar')).toNotBe(seedObject['bar']);
      });
    });
  });

  describe('#peek', function() {
    var seedObject;

    beforeEach(function() {
      seedObject = { foo: 1, shouldBeFalse: false };
      depot = new jasmine.webos.FakeDepot(seedObject);
    });

    it('should view the value for a specified key directly from depot', function() {
      expect(depot.peek("foo")).toEqual(seedObject.foo);
    });

    it('should return null if the specified key in not in the depot', function() {
      expect(depot.peek("not-in-there")).toBeNull();
    });

    it('should return false for a false value', function() {
      expect(depot.peek("shouldBeFalse")).toEqual(false);
    });
  });

  describe('#poke', function() {
    var key, value;

    beforeEach(function() {
      key = 'foo', value = { something: "or other" };

      depot = new jasmine.webos.FakeDepot();
      depot.poke(key, value);
    });

    it('should add a key/value directly into the depot', function() {
      expect(depot.peek(key)).toBeDefined();
    });

    it('should add a copy of the value, rather than a reference', function() {
      expect(depot.peek(key)).toEqual(value);
      expect(depot.peek(key)).toNotBe(value);
    });
  });

  describe('#add', function() {
    var key, value, onSuccess, onFailure;
    var key2, value2, onSuccess2, onFailure2;

    beforeEach(function() {
      key = 'foo', value = 'wibble';
      key2 = 'bar', value2 = 'wobble';
      onSuccess = jasmine.createSpy('onSuccess');
      onSuccess2 = jasmine.createSpy('onSuccess2');
      onFailure = jasmine.createSpy('onFailure');
      onFailure2 = jasmine.createSpy('onFailure2');

      depot = new jasmine.webos.FakeDepot();
      depot.add(key, value, onSuccess, onFailure);
      depot.add(key2, value2, onSuccess2, onFailure2);
    });

    it('should not add the value to the depot before success', function() {
      expect(depot.peek(key)).toBeNull();
    });

    describe('#succeed', function() {
      beforeEach(function() {
        depot.add.succeed();
      });

      it('should call the onSuccess function for the most recent add call', function() {
        expect(onSuccess2).wasCalled();
      });

      it('should not call the onSuccess function for previous add calls', function() {
        expect(onSuccess).wasNotCalled();
      });

      it('should add the key/value to the depot for the most recent add call', function() {
        expect(depot.peek(key2)).toEqual(value2);
      });

      it('should not add the key/value to the depot for previous add calls', function() {
        expect(depot.peek(key)).toBeNull();
      });

      it('should not call the onSuccess function more than once', function() {
        onSuccess2.reset();

        depot.add.succeed();

        expect(onSuccess2).wasNotCalled();
      });

      describe('with no onSucceed function', function() {
        beforeEach(function() {
          depot.add(key, value);
          depot.add.succeed();
        });

        it('should add the key/value to the depot for the most recent add call', function() {
          expect(depot.peek(key)).toEqual(value);
        });
      });
    });

    describe('#succeedAll', function() {
      beforeEach(function() {
        depot.add.succeedAll();
      });

      it('should call the onSuccess function for all add calls', function() {
        expect(onSuccess).wasCalled();
        expect(onSuccess2).wasCalled();
      });

      it('should add the key/value to the depot for all add calls', function() {
        expect(depot.peek(key)).toEqual(value);
        expect(depot.peek(key2)).toEqual(value2);
      });

      it('should not call any onSuccess function more than once', function() {
        onSuccess.reset();
        onSuccess2.reset();

        depot.add.succeedAll();

        expect(onSuccess).wasNotCalled();
        expect(onSuccess2).wasNotCalled();
      });
    });

    describe('#fail', function() {
      beforeEach(function() {
        depot.add.fail();
      });

      it('should call the onFailure function for the most recent add call', function() {
        expect(onFailure2).wasCalled();
      });

      it('should not call the onFailure function for previous add calls', function() {
        expect(onFailure).wasNotCalled();
      });

      it('should not add the key/value to the depot for any add call', function() {
        expect(depot.peek(key)).toBeNull();
        expect(depot.peek(key2)).toBeNull();
      });

      it('should not call the onFailure function more than once', function() {
        onFailure2.reset();

        depot.add.fail();

        expect(onFailure2).wasNotCalled();
      });

      describe('with no onFailure function', function() {
        beforeEach(function() {
          depot.add(key, value);
        });

        it('should not explode', function() {
          depot.add.fail();
          expect("got here!").toBeDefined();
        });
      });
    });

    describe('#failAll', function() {
      beforeEach(function() {
        depot.add.failAll();
      });

      it('should call the onFailure function for all add calls', function() {
        expect(onFailure).wasCalled();
        expect(onFailure2).wasCalled();
      });

      it('should not add the key/value to the depot for any add calls', function() {
        expect(depot.peek(key)).toBeNull();
        expect(depot.peek(key2)).toBeNull();
      });

      it('should not call any onFailure function more than once', function() {
        onFailure.reset();
        onFailure2.reset();

        depot.add.failAll();

        expect(onFailure).wasNotCalled();
        expect(onFailure2).wasNotCalled();
      });
    });

    describe('for scalars', function() {
      it('should save the value', function() {
        var scalar = 1;
        depot.add(key, scalar, onSuccess);
        depot.add.succeed();

        expect(depot.peek(key)).toEqual(scalar);
      });
    });

    describe('for null', function() {
      it('should save null', function() {
        depot.add(key, null, onSuccess);
        depot.add.succeed();

        expect(depot.peek(key)).toBeNull();
      });
    });

    describe('for objects', function() {
      it('should save a copy of the object, not a reference', function() {
        var object = {};
        depot.add(key, object, onSuccess);
        depot.add.succeed();

        expect(depot.peek(key)).toEqual(object);
        expect(depot.peek(key)).toNotBe(object);
      });
    });

    describe('for arrays', function() {
      it('should save a copy of the array, not a reference', function() {
        var array = [];
        depot.add(key, array, onSuccess);
        depot.add.succeed();

        expect(depot.peek(key)).toEqual(array);
        expect(depot.peek(key)).toNotBe(array);
      });
    });

    describe('for nested objects', function() {
      it('should save a deep copy', function() {
        var nestedObject = { foo: { wibble: 1, wobble: 2 }, bar: { jump: "up and down" } };
        depot.add(key, nestedObject, onSuccess);
        depot.add.succeed();

        expect(depot.peek(key)).toEqual(nestedObject);
        expect(depot.peek(key)).toNotBe(nestedObject);

        for (nestedKey in nestedObject) {
          if (nestedObject.hasOwnProperty(nestedKey)) {
            expect(depot.peek(key)[nestedKey]).toEqual(nestedObject[nestedKey]);
            expect(depot.peek(key)[nestedKey]).toNotBe(nestedObject[nestedKey]);
          }
        }
      });
    });
  });

  describe('#get', function() {
    var seed;
    var key, value, onSuccess, onFailure;
    var key2, value2, onSuccess2, onFailure2;

    beforeEach(function() {
      seed = {};
      key = 'foo', value = { wibble: "wobble" }, seed[key] = value;
      key2 = 'bar', value2 = { fibble: "fobble" }, seed[key2] = value2;
      onSuccess = jasmine.createSpy('onSuccess');
      onSuccess2 = jasmine.createSpy('onSuccess2');
      onFailure = jasmine.createSpy('onFailure');
      onFailure2 = jasmine.createSpy('onFailure');

      depot = new jasmine.webos.FakeDepot(seed);
    });

    describe('#succeed', function() {
      describe('with a key that exists in the depot', function() {
        beforeEach(function() {
          depot.get(key, onSuccess, onFailure);
          depot.get(key2, onSuccess2, onFailure2);
          depot.get.succeed();
        });

        it('should call the onSuccess function for the most recent call with the corresponding value', function() {
          expect(onSuccess2).wasCalledWith(value2);
        });

        it('should not call the onSuccess function for previous calls', function() {
          expect(onSuccess).wasNotCalled();
        });
      });

      describe('with a key that does not exist in the depot', function() {
        beforeEach(function() {
          depot.get("not-in-there", onSuccess, onFailure);
          depot.get("also-not-in-there", onSuccess2, onFailure2);
          depot.get.succeed();
        });

        it('should call the onSuccess function for the most recent call with null', function() {
          expect(onSuccess2).wasCalledWith(null);
        });

        it('should not call the onSuccess function for previous calls', function() {
          expect(onSuccess).wasNotCalled();
        });

        it('should not call the onSuccess function more than once', function() {
          onSuccess2.reset();

          depot.get.succeed();

          expect(onSuccess2).wasNotCalled();
        });
      });

      describe('with no onSuccess function', function() {
        beforeEach(function() {
          depot.get(key);
        });

        it('should not explode', function() {
          depot.get.succeed();
          expect("got here!").toBeDefined();
        });
      });
    });

    describe('#succeedAll', function() {
      describe('with keys that exist in the depot', function() {
        beforeEach(function() {
          depot.get(key, onSuccess, onFailure);
          depot.get(key2, onSuccess2, onFailure2);
          depot.get.succeedAll();
        });

        it('should call the onSuccess function for all calls with the corresponding value for each', function() {
          expect(onSuccess).wasCalledWith(value);
          expect(onSuccess2).wasCalledWith(value2);
        });

        it('should not call any onSuccess function more than once', function() {
          onSuccess.reset();
          onSuccess2.reset();

          depot.get.succeedAll();

          expect(onSuccess).wasNotCalled();
          expect(onSuccess2).wasNotCalled();
        });
      });

      describe('with keys that do not exist in the depot', function() {
        beforeEach(function() {
          depot.get("not-in-there", onSuccess, onFailure);
          depot.get("also-not-in-there", onSuccess2, onFailure2);
          depot.get.succeedAll();
        });

        it('should call the onSuccess function for all calls with null', function() {
          expect(onSuccess).wasCalledWith(null);
          expect(onSuccess2).wasCalledWith(null);
        });

        it('should not call any onSuccess function more than once', function() {
          onSuccess.reset();
          onSuccess2.reset();

          depot.get.succeedAll();

          expect(onSuccess).wasNotCalled();
          expect(onSuccess2).wasNotCalled();
        });
      });
    });

    describe('#fail', function() {
      beforeEach(function() {
        depot.get("not-in-there", onSuccess, onFailure);
        depot.get("also-not-in-there", onSuccess2, onFailure2);
        depot.get.fail();
      });

      it('should call the onFailure function for the most recent call', function() {
        expect(onFailure2).wasCalled();
      });

      it('should not call the onFailure function for previous calls', function() {
        expect(onFailure).wasNotCalled();
      });

      it('should not call the onFailure function more than once', function() {
        onFailure2.reset();

        depot.get.fail();

        expect(onFailure2).wasNotCalled();
      });

      describe('with no onFailure function', function() {
        beforeEach(function() {
          depot.get(key, onSuccess);
        });

        it('should not explode', function() {
          depot.get.fail();
          expect("got here!").toBeDefined();
        });
      });
    });

    describe('#failAll', function() {
      beforeEach(function() {
        depot.get("not-in-there", onSuccess, onFailure);
        depot.get("also-not-in-there", onSuccess2, onFailure2);
        depot.get.failAll();
      });

      it('should call the onFailure function for all calls', function() {
        expect(onFailure).wasCalled();
        expect(onFailure2).wasCalled();
      });

      it('should not call any onFailure function more than once', function() {
        onFailure.reset();
        onFailure2.reset();

        depot.get.failAll();

        expect(onFailure).wasNotCalled();
        expect(onFailure2).wasNotCalled();
      });
    });
  });

  describe('#discard', function() {
    var seed;
    var key, value, onSuccess, onFailure;
    var key2, value2, onSuccess2, onFailure2;

    beforeEach(function() {
      seed = {};
      key = 'foo', value = { wibble: "wobble" }, seed[key] = value;
      key2 = 'bar', value2 = { fibble: "fobble" }, seed[key2] = value2;
      onSuccess = jasmine.createSpy('onSuccess');
      onSuccess2 = jasmine.createSpy('onSuccess2');
      onFailure = jasmine.createSpy('onFailure');
      onFailure2 = jasmine.createSpy('onFailure');

      depot = new jasmine.webos.FakeDepot(seed);
    });

    describe('#succeed', function() {
      describe('with a key that exists in the depot', function() {
        beforeEach(function() {
          depot.discard(key, onSuccess, onFailure);
          depot.discard(key2, onSuccess2, onFailure2);
          depot.discard.succeed();
        });

        it('should call the onSuccess function for the most recent call', function() {
          expect(onSuccess2).wasCalled();
        });

        it('should not call the onSuccess function for previous calls', function() {
          expect(onSuccess).wasNotCalled();
        });

        it('should remove the key/value from the depot for the most recent discard call', function() {
          expect(depot.peek(key2)).toBeNull();
        });

        it('should not remove the key/value from the depot for previous discard calls', function() {
          expect(depot.peek(key)).toEqual(value);
        });
      });

      describe('with a key that does not exist in the depot', function() {
        beforeEach(function() {
          depot.discard("not-in-there", onSuccess, onFailure);
          depot.discard("also-not-in-there", onSuccess2, onFailure2);
          depot.discard.succeed();
        });

        it('should call the onSuccess function for the most recent call', function() {
          expect(onSuccess2).wasCalled();
        });

        it('should not call the onSuccess function for previous calls', function() {
          expect(onSuccess).wasNotCalled();
        });

        it('should not call the onSuccess function more than once', function() {
          onSuccess2.reset();

          depot.discard.succeed();

          expect(onSuccess2).wasNotCalled();
        });
      });

      describe('with no onSuccess function', function() {
        beforeEach(function() {
          depot.discard(key);
        });

        it('should not explode', function() {
          depot.discard.succeed();
          expect("got here!").toBeDefined();
        });
      });
    });

    describe('#succeedAll', function() {
      describe('with keys that exist in the depot', function() {
        beforeEach(function() {
          depot.discard(key, onSuccess, onFailure);
          depot.discard(key2, onSuccess2, onFailure2);
          depot.discard.succeedAll();
        });

        it('should call the onSuccess function for all calls', function() {
          expect(onSuccess).wasCalled();
          expect(onSuccess2).wasCalled();
        });

        it('should not call any onSuccess function more than once', function() {
          onSuccess.reset();
          onSuccess2.reset();

          depot.discard.succeedAll();

          expect(onSuccess).wasNotCalled();
          expect(onSuccess2).wasNotCalled();
        });

        it('should remove the key/value from the depot for all discard calls', function() {
          expect(depot.peek(key)).toBeNull();
          expect(depot.peek(key2)).toBeNull();
        });
      });

      describe('with keys that do not exist in the depot', function() {
        beforeEach(function() {
          depot.discard("not-in-there", onSuccess, onFailure);
          depot.discard("also-not-in-there", onSuccess2, onFailure2);
          depot.discard.succeedAll();
        });

        it('should call the onSuccess function for all calls', function() {
          expect(onSuccess).wasCalled();
          expect(onSuccess2).wasCalled();
        });

        it('should not call any onSuccess function more than once', function() {
          onSuccess.reset();
          onSuccess2.reset();

          depot.discard.succeedAll();

          expect(onSuccess).wasNotCalled();
          expect(onSuccess2).wasNotCalled();
        });
      });
    });

    describe('#fail', function() {
      beforeEach(function() {
        depot.discard("not-in-there", onSuccess, onFailure);
        depot.discard("also-not-in-there", onSuccess2, onFailure2);
        depot.discard.fail();
      });

      it('should call the onFailure function for the most recent call', function() {
        expect(onFailure2).wasCalled();
      });

      it('should not call the onFailure function for previous calls', function() {
        expect(onFailure).wasNotCalled();
      });

      it('should not call the onFailure function more than once', function() {
        onFailure2.reset();

        depot.discard.fail();

        expect(onFailure2).wasNotCalled();
      });

      describe('with no onFailure function', function() {
        beforeEach(function() {
          depot.discard(key, onSuccess);
        });

        it('should not explode', function() {
          depot.discard.fail();
          expect("got here!").toBeDefined();
        });
      });

      it('should not remove the key/value from the depot for any discard call', function() {
        expect(depot.peek(key)).toEqual(value);
        expect(depot.peek(key2)).toEqual(value2);
      });
    });

    describe('#failAll', function() {
      beforeEach(function() {
        depot.discard("not-in-there", onSuccess, onFailure);
        depot.discard("also-not-in-there", onSuccess2, onFailure2);
        depot.discard.failAll();
      });

      it('should call the onFailure function for all calls', function() {
        expect(onFailure).wasCalled();
        expect(onFailure2).wasCalled();
      });

      it('should not call any onFailure function more than once', function() {
        onFailure.reset();
        onFailure2.reset();

        depot.discard.failAll();

        expect(onFailure).wasNotCalled();
        expect(onFailure2).wasNotCalled();
      });

      it('should not remove the key/value from the depot for any discard calls', function() {
        expect(depot.peek(key)).toEqual(value);
        expect(depot.peek(key2)).toEqual(value2);
      });
    });
  });
});
