describe('TestAssistant', function () {
  var testAssistant;
  var env;

  beforeEach(function () {
    env = new jasmine.Env();
    testAssistant = new TestAssistant();
    testAssistant.underTest = true;
    this.realWidgets = Widgets;
    Widgets = jasmine.createSpy();
    testAssistant.controller = jasmine.createSpy();
  });

  afterEach(function () {
    Widgets = this.realWidgets;
  });

  xit('should increment the pill, add a result to the proper list widget and error-list when a spec with a failed expectation is passed to reportSpecResults', function() {
    var failedResult = pockets.test.Mom.failedResult();
    var failingSpec = new jasmine.Spec({}, {}, 'desc');
    failingSpec.results_ = failedResult;
    failingSpec.getFullName = function() {
      return "FAKE SPEC!"
    };

    testAssistant.errorList = {
      addSpecResult: jasmine.createSpy('addSpecResult'),
      show: jasmine.createSpy('show')
    };

    testAssistant.testListWidgets = [{addSpecResult: jasmine.createSpy('addSpecResult')}];

    testAssistant.pill = {
      increment: jasmine.createSpy('increment'),
      displayOnFail: jasmine.createSpy('displayOnFail')
    };

    testAssistant.currentSuiteIndex = 0;

    testAssistant.reportSpecResults(failingSpec);

    expect(testAssistant.pill.increment).wasCalled();
    expect(testAssistant.pill.displayOnFail).wasCalled();
    expect(testAssistant.errorList.addSpecResult).wasCalledWith(failingSpec);
    expect(testAssistant.errorList.show).wasCalled();
    expect(testAssistant.testListWidgets[0].addSpecResult).wasCalledWith(failingSpec);
  });

  it('should increment currentSuiteIndex when reportSuiteResults is called', function() {
    var results = {};

    testAssistant.currentSuiteIndex = 0;
    testAssistant.suiteList = { addSuite: Mojo.doNothing };

    testAssistant.reportSuiteResults({results: results});

    expect(testAssistant.currentSuiteIndex).toEqual(1);

    testAssistant.reportSuiteResults({results: results});
    expect(testAssistant.currentSuiteIndex).toEqual(2);
  });

  it('should call pill#finishedWith(results) when reportRunnerResults is called', function() {
    spyOn(Ajax, 'Request');
    var results = {some_result_arg:'foo'};
    testAssistant.pill = {
      finishedWith: jasmine.createSpy()
    };

    spyOn(Mojo.Controller.getAppController(), 'closeStage');
    testAssistant.reportRunnerResults({results: function () {
      return results;
    }});

    expect(testAssistant.pill.finishedWith).wasCalledWith(results);
  });

  xit('should show failed tests in an error list', function() {
    Widgets = this.realWidgets;
    spyOn(pockets, 'inTestRunner').andReturn(true);
    var anotherTestAssistant = pockets.test.createSceneAssistant('test', [], '../../plugins/jasmine-webos/app/views/');
    anotherTestAssistant.underTest = true;
    pockets.test.setupAndActivate(anotherTestAssistant);

    var failingSpec = new jasmine.Spec(
    {},
      new jasmine.Suite({}, 'TestSuite', null, null),
      'should bar'
      );
    failingSpec.results_ = pockets.test.Mom.failedResult();

    anotherTestAssistant.reportSpecResults(failingSpec);

    var errorListElement = anotherTestAssistant.controller.sceneElement.querySelector('#error-list');
    expect(errorListElement.innerHTML).toMatch(/TestSuite should bar./);
  });

  xit('should have a red progress bar if there is a failed test', function() {
    runs(function () {
      //PENDING
    });
  });

});
