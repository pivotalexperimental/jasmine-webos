// TODO: move this over to Jasmine webOS
xdescribe("pockets.test.testFunctionEquality", function () {
  var env, TestClass, a, b;

  beforeEach(function() {
    env = new jasmine.Env();

    TestClass = function() {
    };
    TestClass.prototype.someMethod = function() {
    };
    TestClass.prototype.anotherMethod = function() {
    };
    a = new TestClass();
    b = new TestClass();
  });

  it("should return undefined if either a or b is not a function bound by pockets.test.bind", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
                                            function() {
                                            },
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
                                            function() {
                                            },
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
    {},
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
    {},
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
            null,
            null,
            env, [], [])).toEqual(undefined);
  });


  it("should return true only for bound functions which are bound to the same object", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, b),
            env, [], [])).toEqual(false);
  });

  it("should return true only for bound functions which are bound to the same method", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.anotherMethod, a),
            env, [], [])).toEqual(false);
  });

  it("should return true only for bound functions which have equivalent initial arguments", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 4, 5, 6),
            env, [], [])).toEqual(false);
  });
});
