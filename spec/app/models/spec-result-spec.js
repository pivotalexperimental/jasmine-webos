describe("SpecResult", function () {
  var specResult;
  var passingSpec, failingSpec;
  beforeEach(function() {
    var env = new jasmine.Env();
    env.updateInterval = 0;
    var suite = new jasmine.Suite(env, 'A Suite with');
    passingSpec = new jasmine.Spec(env, suite, 'a passing spec');
    passingSpec.runs(function () {
      this.expect(true).toEqual(true);
    });

    failingSpec = new jasmine.Spec(env, suite, 'a failing spec');
    failingSpec.runs(function() {
      this.expect(true).toEqual(true);
      this.expect(true).toEqual(false);
      this.expect(1).toEqual(2);
    });
    suite.add(passingSpec);
    suite.add(failingSpec);
  });

  describe("that passed", function () {
    beforeEach(function() {
      passingSpec.execute();
      specResult = new SpecResult(passingSpec);
    });

    it("should report it's full name", function() {
      expect(specResult.name).toEqual('A Suite with a passing spec.');
    });

    it("should report that it passed", function() {
      expect(specResult.passed).toBe(true);
      expect(specResult.failed).toBe(false);
    });
  });

  describe("that failed", function () {
    beforeEach(function() {
      failingSpec.execute();
      specResult = new SpecResult(failingSpec);
    });

    it("should report its full name", function() {
      expect(specResult.name).toEqual('A Suite with a failing spec.');
    });

    it("should report that it failed", function() {
      expect(specResult.passed).toBe(false);
      expect(specResult.failed).toBe(true);
    });

    describe("has messages", function () {
      it("#countMessage should report the counts", function() {
        expect(specResult.countMessage).toEqual('1 of 3 passed');
      });

      it("#expectations should return the array of the spec's expectations", function() {
        expect(specResult.expectations.length).toEqual(3);
      });


    });


  });
});

// do just enough to get the name & passed/failed
// just the errors for now
// then add results (do just like Trivial Reporter first, then do table/pretty-printer
