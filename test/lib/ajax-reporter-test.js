describe('AjaxReporter', function() {
  var env, ajaxReporter;
  beforeEach(function () {
    env = new jasmine.Env();
    ajaxReporter = new AjaxReporter("example.com");
  });

  it('should send a start message', function() {
    spyOn(ajaxReporter, "reportResults");
    var runner = new jasmine.Runner(env);
    spyOn(runner, 'suites').andReturn({length:42});    
    ajaxReporter.reportRunnerStarting(runner);

    expect(ajaxReporter.reportResults).wasCalledWith('reportRunnerStarting',
    {
      title: Mojo.Controller.appInfo.title,
      suiteCount: 42
    });
  });

  it('should store the results host', function() {
    expect(ajaxReporter.resultsHost).toEqual("example.com");
    expect(ajaxReporter.hostURL).toEqual("http://example.com");
  });

  it('should never send a request if there is no results host', function() {
    var reporterWithNoHost = new AjaxReporter();

    var failingSpec = new jasmine.Spec(env, pockets.test.Mom.suite(env), 'desc');
    failingSpec.results_ = pockets.test.Mom.failedResult();

    reporterWithNoHost.reportSpecResults(failingSpec);

    expect(AjaxRequests.requests.length).toEqual(0);
  });

  it("should send a spec result to the results host", function() {
    var failingSpec = new jasmine.Spec(env, pockets.test.Mom.suite(env), 'desc');
    failingSpec.results_ = pockets.test.Mom.failedResult();

    ajaxReporter.reportSpecResults(failingSpec);

    expect(AjaxRequests.requests.length).toEqual(1);

    var activeRequest = AjaxRequests.activeRequest();

    expect(activeRequest.url).toEqual('http://example.com/reportSpecResults');
    expect(JSON.parse(activeRequest.options.postBody)).toEqual(
    {
      suiteId: 0,
      fullName: 'foo desc.',
      items:
          [
            {
              message: 'Failed.',
              passed: false,
              matcherName: 'fooMatcher',
              expected: undefined,
              actual: undefined
            }
          ],
      passed: false,
      failedCount: 1,
      passedCount: 0,
      totalCount: 1,
      skipped: false
    });
  });

  it('should send a suite result to the results host', function() {
    var suite = pockets.test.Mom.suite(env);

    ajaxReporter.reportSuiteResults(suite);

    expect(AjaxRequests.requests.length).toEqual(1);
    var activeRequest = AjaxRequests.activeRequest();
    expect(activeRequest.url).toEqual('http://example.com/reportSuiteResults');
    expect(JSON.parse(activeRequest.options.postBody)).toEqual(
    {
      id: 0,
      fullName: 'foo',
      passed: true,
      failedCount: 0,
      passedCount: 0,
      totalCount: 0,
      skipped: false
    });
  });

  it('should send runner results to the results host', function() {
    var runner = new jasmine.Runner(env);

    ajaxReporter.reportRunnerResults(runner);

    expect(AjaxRequests.requests.length).toEqual(1);
    var activeRequest = AjaxRequests.activeRequest();
    expect(activeRequest.url).toEqual('http://example.com/reportRunnerResults');

    expect(JSON.parse(activeRequest.options.postBody)).toEqual(
    {
      message: '0 specs, 0 failures',
      passed: true,
      failedCount: 0,
      passedCount: 0,
      totalCount: 0,
      skipped: false
    });
  });

  it('should forward any log messages to the results host', function() {
    var str = "I am a MIGHTY ERROR STRING!";

    ajaxReporter.log(str);

    expect(AjaxRequests.requests.length).toEqual(1);

    var activeRequest = AjaxRequests.activeRequest();

    expect(activeRequest.url).toEqual('http://example.com/logMessage');

    var jsonPrettyPrinter = new JsonPrettyPrinter();
    jsonPrettyPrinter.format({message: str});
    expect(activeRequest.options.postBody).toEqual(jsonPrettyPrinter.string);
  });

  describe('test result post queue', function() {
    it('should be empty and result request not active on load', function() {
      expect(ajaxReporter.resultPostQueue.length).toEqual(0);
      expect(ajaxReporter.resultRequestActive).toEqual(false);
    });

    it('should queue an item and not post it if active', function() {
      ajaxReporter.resultPostQueue = [ "foo" ];
      ajaxReporter.resultRequestActive = true;
      ajaxReporter.reportResults("abc", "xyz");
      expect(ajaxReporter.resultPostQueue.length).toEqual(2);
      expect(AjaxRequests.requests.length).toEqual(0);
    });

    it('should send the request if the queue is empty and current request is not active', function() {
      this.resultsHost = "foo";
      ajaxReporter.resultPostQueue = [];
      ajaxReporter.resultRequestActive = false;
      ajaxReporter.reportResults("abc", "xyz");

      expect(ajaxReporter.resultRequestActive).toEqual(true);
      expect(ajaxReporter.resultPostQueue.length).toEqual(0);
      expect(AjaxRequests.requests.length).toEqual(1);
    });

    it('onPostComplete, when there are items in the queue, should post the next item', function() {
      this.resultsHost = "foo";
      ajaxReporter.resultPostQueue = [{url: "foo", postBody: "bar"}];
      ajaxReporter.resultRequestActive = true;
      ajaxReporter.onPostComplete();

      expect(ajaxReporter.resultPostQueue.length).toEqual(0);
      expect(ajaxReporter.resultRequestActive).toEqual(true);
      expect(AjaxRequests.requests.length).toEqual(1);
    });

    it('onPostComplete, when there are no items in the queue, should not attempt to post and become inactive', function() {
      this.resultsHost = "foo";
      ajaxReporter.resultPostQueue = [];
      ajaxReporter.resultRequestActive = true;
      ajaxReporter.onPostComplete();

      expect(ajaxReporter.resultPostQueue.length).toEqual(0);
      expect(ajaxReporter.resultRequestActive).toEqual(false);
      expect(AjaxRequests.requests.length).toEqual(0);
    });
  });
});
