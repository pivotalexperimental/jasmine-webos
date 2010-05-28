var pockets = pockets || {};
pockets.test = pockets.test || {};
pockets.test.Mom = pockets.test.Mom || {};

pockets.test.Mom.failedResult = function() {
  var failedResults = new jasmine.NestedResults();
  var resultData = {
    matcherName: "fooMatcher",
    passed: false,
    message:"Failed." };
  failedResults.addResult(new jasmine.ExpectationResult(resultData));
  failedResults.description = "should bar";
  return failedResults;
};

pockets.test.Mom.suite = function(env) {
  var saveGetEnvFn = jasmine.getEnv;
  jasmine.getEnv = function() {
    return env;
  };
  var suiteFun = new Function("return describe('foo',function() {it('should bar', function() {expect(true).toBeTruthy();});});");
  var suite = suiteFun();
  jasmine.getEnv = saveGetEnvFn;
  return suite;
};
