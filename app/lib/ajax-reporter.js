function AjaxReporter(resultsHost) {
  this.resultsHost = resultsHost;
  this.hostURL = 'http://' + resultsHost;
  this.Request = Ajax.Request;

  this.resultPostQueue = [];
  this.resultRequestActive = false;

  this.jsonPrettyPrinter = new JsonPrettyPrinter();
}

AjaxReporter.prototype.reportRunnerStarting = function(runner) {
  this.reportResults('reportRunnerStarting',
  {
    title: Mojo.appInfo.title,
    suiteCount: runner.suites().length
  });
};

AjaxReporter.prototype.reportSpecResults = function(spec) {
  var results = {};

  results.suiteId = spec.suite.id;
  results.fullName = spec.getFullName();

  var specResults = spec.results();
  results.passed = specResults.passed();
  results.failedCount = specResults.failedCount;
  results.passedCount = specResults.passedCount;
  results.totalCount = specResults.totalCount;
  results.skipped = specResults.skipped;

  results.items = specResults.getItems().inject([], function(acc, item) {
    try {
      var expected, actual, details;

      if (item.expected) {
        expected = pockets.structify(item.expected);
      }
      if (item.actual) {
        if (item.matcherName.match(/was(.*)Called/)) {
          actual = pockets.structify(item.actual.argsForCall);
        } else {
          actual = pockets.structify(item.actual);
        }
      }
      if (item.details) {
        details = pockets.structify(item.details);
      }

      acc.push({
        matcherName: item.matcherName,
        message: item.message,
        expected: expected,
        actual: actual,
        details: details,
        passed: item.passed()
      });
    } catch(e) {
      Mojo.Log.logException(e);
    }
    return acc;
  }.bind(this));

  this.reportResults('reportSpecResults', results);
};

AjaxReporter.prototype.reportSuiteResults = function(suite) {
  var results = {};
  results.id = suite.id;
  results.fullName = suite.getFullName();
  var suiteResults = suite.results();
  results.passed = suiteResults.passed();
  results.failedCount = suiteResults.failedCount;
  results.passedCount = suiteResults.passedCount;
  results.totalCount = suiteResults.totalCount;
  results.skipped = suiteResults.skipped;
  this.reportResults('reportSuiteResults', results);
};

AjaxReporter.prototype.reportRunnerResults = function(runner) {
  var results = {};
  var runnerResults = runner.results();
  results.passed = runnerResults.passed();
  results.failedCount = runnerResults.failedCount;
  results.passedCount = runnerResults.passedCount;
  results.totalCount = runnerResults.totalCount;
  results.skipped = runnerResults.skipped;
  var specs = runner.specs();
  var specCount = specs.length;
  results.message = "" + specCount + " spec" + (specCount == 1 ? "" : "s" ) + ", " + results.failedCount + " failure" + ((results.failedCount == 1) ? "" : "s");
  this.reportResults('reportRunnerResults', results);
};

AjaxReporter.prototype.log = function(str) {
  this.reportResults('logMessage', {message: str});
};

AjaxReporter.prototype.reportResults = function(method, results) {
  if (!this.resultsHost) {
    return;
  }
  this.resultPostQueue.push({url:this.hostURL + '/' + method, postBody: Object.toJSON(results)});

  if (!this.resultRequestActive) {
    this.postResult();
  }
};

AjaxReporter.prototype.postResult = function() {
  this.resultRequestActive = true;
  var queuedRequest = this.resultPostQueue.shift();
  if (!queuedRequest) {
    this.resultRequestActive = false;
    return;
  }
  var resultsRequest = new this.Request(queuedRequest.url, {
    method: 'post',
    postBody: queuedRequest.postBody,
    onComplete: this.onPostComplete.bind(this)
  });
};

AjaxReporter.prototype.onPostComplete = function() {
  this.postResult();
};
