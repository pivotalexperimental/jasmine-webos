function SpecResult(spec) {
  var self = this;

  self.__defineGetter__("name", function() {
    return spec.getFullName();
  });

  self.__defineGetter__("passed", function() {
    return spec.results().passed();
  });

  return self;
}
