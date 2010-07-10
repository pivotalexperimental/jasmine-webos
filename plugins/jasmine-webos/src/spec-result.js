function SpecResult(spec) {
  var self = this;

  var expectations = spec.results().items_;
  var failedExpectations = [];

  for (var i=0; i < expectations.length; i++) {
    var expectation = expectations[i];
    if (!expectation.passed()) {
      failedExpectations.push({
        number: i+1,
        message: expectation.message
      });
    }
  }

  self.__defineGetter__("name", function() {
    return spec.getFullName();
  });

  self.__defineGetter__("passed", function() {
    return spec.results().passed();
  });

  self.__defineGetter__("failed", function() {
    return !self.passed;
  });

  self.__defineGetter__("countMessage", function() {
    var results = spec.results();
    return results.passedCount + ' of ' + results.totalCount + ' passed';
  });

  self.__defineGetter__("expectations", function() {
    return expectations;
  });

  self.__defineGetter__("failedExpectations", function() {
    return failedExpectations;
  });

  return self;
}
