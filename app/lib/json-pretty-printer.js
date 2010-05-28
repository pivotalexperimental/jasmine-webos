JsonPrettyPrinter = function() {
  jasmine.PrettyPrinter.call(this);
  this.string = '';
};

jasmine.util.inherit(JsonPrettyPrinter, jasmine.PrettyPrinter);

JsonPrettyPrinter.prototype.emitScalar = function(value) {
  var asJson = Object.toJSON([value]);
  this.append(asJson.substring(1,asJson.length-1));
};

JsonPrettyPrinter.prototype.emitString = function(value) {
  this.emitScalar(value);
};

JsonPrettyPrinter.prototype.emitArray = function(array) {
  this.append('[');
  for (var i = 0; i < array.length; i++) {
    if (i > 0) {
      this.append(', ');
    }
    this.format(array[i]);
  }
  this.append(']');
};

JsonPrettyPrinter.prototype.emitObject = function(obj) {
  var self = this;
  this.append('{');
  var first = true;

  this.iterateObject(obj, function(property, isGetter) {
    if (first) {
      first = false;
    } else {
      self.append(', ');
    }

    self.append('"' + property + '"');
    self.append(': ');
    self.format(obj[property]);
  });

  this.append('}');
};

JsonPrettyPrinter.prototype.append = function(value) {
  this.string += value;
};

JsonPrettyPrinter.prototype.reset = function() {
  this.string = '';
};
