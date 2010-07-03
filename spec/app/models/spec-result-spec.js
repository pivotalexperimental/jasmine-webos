describe("SpecResult", function () {
  var specResult;
  var fakePassingSpec, fakeFailingSpec;

  beforeEach(function() {
    fakePassingSpec = {
      getFullName: function() {
        return 'A Passing spec.'
      },
      results: function() {
        return {
          passed: function() {
            return true;
          }
        }
      }
    };

    fakeFailingSpec = {
      getFullName: function() {
        return 'A Failing spec.'
      },
      results: function() {
        return {
          passed: function() {
            return false;
          }
        }
      }
    };
  });

  describe("that passed", function () {
    beforeEach(function() {
      specResult = new SpecResult(fakePassingSpec);
    });

    it("should report it's full name", function() {
      expect(specResult.name).toEqual('A Passing spec.');
    });

    it("should report that it passed", function() {
      expect(specResult.passed).toBe(true);
    });
  });

  describe("that failed", function () {
    beforeEach(function() {
      specResult = new SpecResult(fakeFailingSpec);
    });

    it("should report it's full name", function() {
      expect(specResult.name).toEqual('A Failing spec.');
    });

    it("should report that it failed", function() {
      expect(specResult.passed).toBe(false);
    });

  });
});

// do just enough to get the name & passed/failed
// just the errors for now
// then add results (do just like Trivial Reporter first, then do table/pretty-printer
