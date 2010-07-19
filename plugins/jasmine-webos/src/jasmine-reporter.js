function JasmineReporter(view, jasmineEnv) {
  var self = this;

  jasmineEnv.addReporter(self);

  var specCount;
  var specIncrement;
  var startTime, endTime;

  var failedSpecResultsModel = {
    listClass: 'fail',
    listTitle: 'Failing Specs',
    items: []
  };

  var allSpecsResultsListModel = {
    listTitle: 'All Specs',
    items: []
  };

  var progressPillModel = {};

  initialize();

  self.__defineGetter__("specCount", function() {
    return specCount;
  });

  self.getFailedSpecsListModel = function() {
    return failedSpecResultsModel;
  };

  self.getAllSpecsListModel = function() {
    return allSpecsResultsListModel;
  };

  self.getPillModel = function() {
    return progressPillModel;
  };

  // Jasmine Reporter interface
  self.log = function(message) {
    view.writeToLog(message);
  };

  self.reportRunnerStarting = function(runner) {
    startTime = startTime || Date.now();
    specCount = runner.specs().length;

    specIncrement = specCount ? 1 / specCount : 1;

    view.runnerStarted(specCount);
  };

  self.reportSpecResults = function(spec) {
    progressPillModel.value += specIncrement;
    if (!spec.results().passed()) {
      failedSpecResultsModel.items.push(new SpecResult(spec));
      view.specFailed(spec);
    }
    view.specCompleted(spec);
  };

  self.reportSuiteResults = function(suite) {
    if (!suite.parentSuite) {
      allSpecsResultsListModel.items.push(suite.results());
    }
    view.suiteCompleted();
  };

  self.reportRunnerResults = function(runner) {
    endTime = endTime || Date.now();
    progressPillModel.value = 1.0;
    progressPillModel.title = specCount + ' specs, ' + failedSpecResultsModel.items.length + ' failures in ' + (endTime - startTime)/1000 + 's';
    view.runnerCompleted();
  };

  return self;

  function initialize() {
    failedSpecResultsModel.items.clear();
    allSpecsResultsListModel.items.clear();
    progressPillModel.value = 0.0;
    progressPillModel.title = "Running Specs...";
    specCount = 0.0;
    specIncrement = 0.0;
    startTime = 0;
    endTime = 0;
  }
}

