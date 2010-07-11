function SpecResult(spec) {
  var self = this;

  var expectations = [];
  for (var i=0; i < spec.results().items_.length; i++) {
    var e = spec.results().items_[i];
    expectations.push({
      didPass: e.passed(),
      count: i+1,
      message: e.message
    });
  }

  var failedExpectations = [];
  for (i=0; i < expectations.length; i++) {
    if (!expectations[i].didPass) {
      failedExpectations.push(expectations[i]);
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
