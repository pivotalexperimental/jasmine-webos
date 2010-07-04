function SpecResult(spec) {
  var self = this;

  self.__defineGetter__("name", function() {
    return spec.getFullName();
  });

  self.__defineGetter__("passed", function() {
    return spec.results().passed();
  });

  self.__defineGetter__("failed", function() {
    return !self.passed;
  });

  self.__defineGetter__("failedCount", function() {
    var results = spec.results();
    return results.totalCount - results.passedCount;
  });

  self.__defineGetter__("countMessage", function() {
    var results = spec.results();
    return results.passedCount + ' of ' + results.totalCount + ' passed';
  });

  self.__defineGetter__("expectations", function() {
    return spec.results().items_;
  });

  return self;
}
