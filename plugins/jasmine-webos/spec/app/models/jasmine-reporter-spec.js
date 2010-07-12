describe("JasmineReporter", function () {
  var reporter, view, jasmineEnv, jasmineSuite;
  var spec1, spec2, spec3, spec4;

  beforeEach(function() {
    view = new FakeView([
      'writeToLog',
      'specFailed',
      'runnerStarted',
      'specCompleted',
      'suiteCompleted',
      'runnerCompleted'
    ]);
    jasmineEnv = new jasmine.Env();
    spyOn(jasmineEnv, 'addReporter').andCallThrough();

    jasmineEnv.describe('sample suite', function() {
      jasmineEnv.it('spec 1', function() {
        this.expect(true).toEqual(true);
      });

      jasmineEnv.it('spec 2', function() {
        this.expect(true).toEqual(true);
      });
    });

    reporter = new JasmineReporter(view, jasmineEnv);
  });

  describe("on construction", function () {
    it("should register itself as a Reporter with Jasmine ", function() {
      expect(jasmineEnv.addReporter).wasCalledWith(reporter);
    });

    describe("has a list model for failed specs that", function () {
      var listModel;

      beforeEach(function() {
        listModel = reporter.getFailedSpecsListModel();
      });

      it("should exist", function() {
        expect(listModel).toBeDefined();
      });

      it("should have an empty list", function() {
        expect(listModel.items).toEqual([]);
      });

      it("should have a list class for CSS", function() {
        expect(listModel.listClass).toEqual('fail');
      });

      it("should have a list name", function() {
        expect(listModel.listTitle).toEqual('Failing Specs');
      });
    });

    it("should provide a collection of all suites for use as widget models", function() {
      expect(reporter.getSuitesListModel()).toEqual({listTitle: "All Specs", items: []});
    });

    it("should provide a widget model for the progress pill", function() {
      var pillModel = reporter.getPillModel();

      expect(pillModel.value).toEqual(0.0);
      expect(pillModel.title).toEqual('Running Specs...');
    });
  });

  describe("#log", function () {
    beforeEach(function() {
      reporter.log('Jasmine log message')
    });

    it("should pass the log content through to the view", function() {
      expect(view.writeToLog).wasCalledWith('Jasmine log message')
    });
  });

  describe("#reportRunnerStarted", function () {
    beforeEach(function() {
      reporter.reportRunnerStarting(jasmineEnv.currentRunner());
    });

    it("should tell the view that the runner has started", function() {
      expect(view.runnerStarted).wasCalledWith(2);
    });

    it("should provide the count of specs", function() {
      expect(reporter.specCount).toEqual(2);
    });
  });

  describe("#reportSpecResults", function () {
    var anotherSuite;
    var passingSpec, failingSpec;

    beforeEach(function() {
      anotherSuite = new jasmine.Suite(jasmineEnv);

      passingSpec = new jasmine.Spec(jasmineEnv, anotherSuite, 'passing spec');
      anotherSuite.add(passingSpec);

      failingSpec = new jasmine.Spec(jasmineEnv, anotherSuite, 'failing spec');
      anotherSuite.add(failingSpec);

      jasmineEnv.currentRunner().addSuite(anotherSuite);
      reporter.reportRunnerStarting(jasmineEnv.currentRunner());
    });

    describe("for a passing spec", function () {

      beforeEach(function() {
        passingSpec.runs(function () {
          this.expect(true).toEqual(true);
        });
        passingSpec.execute();

        reporter.reportSpecResults(passingSpec);
      });

      it("should increment the progress pill model", function() {
        expect(reporter.getPillModel().value).toEqual(0.25);
      });

      it("should tell the view that a spec has completed", function() {
        expect(view.specCompleted).wasCalledWith(passingSpec);
      });

      it("should have no failing specs", function() {
        expect(reporter.getFailedSpecsListModel().items.length).toEqual(0);
      });
    });

    describe("for a failing spec", function () {

      beforeEach(function() {
        failingSpec.runs(function () {
          this.expect(true).toEqual(false);
        });
        failingSpec.execute();

        reporter.reportSpecResults(failingSpec);
      });

      it("should increment the progress pill model", function() {
        expect(reporter.getPillModel().value).toEqual(0.25);
      });

      it("should tell the view that a spec has completed", function() {
        expect(view.specCompleted).wasCalledWith(failingSpec);
      });

      it("should have saved off the failing spec", function() {
        expect(reporter.getFailedSpecsListModel().items.length).toEqual(1);
      });
    });

  });

  describe("#reportSuiteResults", function () {
    var fakeSuite, fakeResults;

    beforeEach(function() {
      fakeResults = ['pass', 'fail', 'pass'];
      fakeSuite = {
        results: function() {
          return fakeResults
        }
      };

      reporter.reportSuiteResults(fakeSuite);
    });

    it("should save the suite's results", function() {
      expect(reporter.getSuitesListModel().items.length).toEqual(1);
    });

    it("should tell the view the suite is complete", function() {
      expect(view.suiteCompleted).wasCalled();
    });

  });

  describe("#reportRunnerResults", function () {
    var fakeRunner, fakeResults;
    beforeEach(function() {
      fakeResults = ['pass', 'fail', 'pass'];
      fakeRunner = {
        results: function() {
          return fakeResults
        }
      };

      reporter.reportRunnerResults(fakeRunner);
    });

    it("should update the pill to 'done'", function() {
      expect(reporter.getPillModel().value).toEqual(1.0);
    });

    it("should tell the view the runner completed", function() {
      expect(view.runnerCompleted).wasCalled();
    });
  });

  describe("when running a full Jasmine Environment", function () {

    describe("with all passing specs", function () {
      beforeEach(function() {
        jasmineEnv = new jasmine.Env();
        spyOn(jasmineEnv, 'addReporter').andCallThrough();

        jasmineEnv.describe('sample suite', function() {
          jasmineEnv.it('spec 1', function() {
            this.expect(true).toEqual(true);
          });

          jasmineEnv.it('spec 2', function() {
            this.expect(true).toEqual(true);
          });

          jasmineEnv.it('spec 3', function() {
            this.expect(true).toEqual(true);
          });
        });

        jasmineEnv.describe('another sample suite', function() {
          jasmineEnv.describe('with a nested suite', function() {
            jasmineEnv.it('spec 1', function() {
              this.expect(true).toEqual(true);
            });

            jasmineEnv.it('spec 2', function() {
              this.expect(true).toEqual(true);
            });

            jasmineEnv.it('spec 3', function() {
              this.expect(true).toEqual(true);
            });
          });
        });

        reporter = new JasmineReporter(view, jasmineEnv);
      });

      it("should receive & process all callbacks", function() {
        runs(function() {
          spyOn(reporter, 'reportRunnerResults').andCallThrough();
          jasmineEnv.execute();
        });

        waitsFor(500, function() {
          return reporter.reportRunnerResults.callCount;
        }, "waiting for passing runner to finish...");

        runs(function() {
          expect(reporter.specCount).toEqual(6);
          expect(reporter.getPillModel().value).toEqual(1.0);
          expect(reporter.getPillModel().title).toMatch(/6 specs, 0 failures in \d+.\d+s/);
          expect(reporter.getFailedSpecsListModel().items.length).toEqual(0);
          expect(reporter.getSuitesListModel().items.length).toEqual(2);
        });
      });
    });

    describe("with some passing & some failing specs", function () {
      beforeEach(function() {
        jasmineEnv = new jasmine.Env();
        spyOn(jasmineEnv, 'addReporter').andCallThrough();

        jasmineEnv.describe('sample suite', function() {
          jasmineEnv.it('spec 1', function() {
            this.expect(true).toEqual(true);
          });

          jasmineEnv.it('spec 2', function() {
            this.expect(true).toEqual(false);
          });

          jasmineEnv.it('spec 3', function() {
            this.expect(true).toEqual(true);
          });
        });

        jasmineEnv.describe('another sample suite', function() {
          jasmineEnv.describe('with a nested suite', function() {
            jasmineEnv.it('spec 1', function() {
              this.expect(true).toEqual(true);
            });

            jasmineEnv.it('spec 2', function() {
              this.expect(true).toEqual(false);
            });

            jasmineEnv.it('spec 3', function() {
              this.expect(true).toEqual(true);
            });
          });
        });

        reporter = new JasmineReporter(view, jasmineEnv);
      });

      it("should receive & process all callbacks", function() {
        runs(function() {
          spyOn(reporter, 'reportRunnerResults').andCallThrough();
          jasmineEnv.execute();
        });

        waitsFor(500, function() {
          return reporter.reportRunnerResults.callCount;
        }, "waiting for passing runner to finish...");

        runs(function() {
          expect(reporter.specCount).toEqual(6);

          expect(reporter.getPillModel().value).toEqual(1.0);
          expect(reporter.getPillModel().title).toMatch(/6 specs, 2 failures in \d+.\d+s/)


          var failedSpecs = reporter.getFailedSpecsListModel();
          expect(failedSpecs.items.length).toEqual(2);
          expect(failedSpecs.items[0].name).toEqual('sample suite spec 2.');
          expect(failedSpecs.items[1].name).toEqual('another sample suite with a nested suite spec 2.');

          expect(reporter.getSuitesListModel().items.length).toEqual(2);
        });
      });
    });
  });
});
