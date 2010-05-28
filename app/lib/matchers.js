
// TODO: this is insulating Pockets' matchers from Jasmine matchers machinations. Fix when jasmine stabilizes.
jasmine.Matchers.prototype.report_ = function(matcherName, result, message, expected, details) {
  var expectationResult = new jasmine.ExpectationResult({
    matcherName: matcherName,
    passed: result,
    message: message,
    actual: this.actual,
    expected: expected,
    details: details
  });
  this.spec.addMatcherResult(expectationResult);
  return result;
};

jasmine.Matchers.prototype.toBeAWidgetOfType = function(expectedType) {
  if (!this.actual || !pockets.getWidgetController(this.actual)) {
    return this.report_("toBeAWidgetOfType",
        false,
        'Expected ' + this.actual + ' to be a Mojo ' + expectedType + ' widget, but it wasn\'t',
        expectedType);
  }
  var actualType = this.actual.getAttribute('x-mojo-element');
  return this.report_("toBeAWidgetOfType",
      (actualType == expectedType),
      'Expected ' + this.actual + ' to be a Mojo ' + expectedType + ' widget but was Mojo ' + actualType,
      expectedType);
};
/** @deprecated */
jasmine.Matchers.prototype.shouldBeAWidgetOfType = jasmine.Matchers.prototype.toBeAWidgetOfType;

jasmine.Matchers.prototype.toBeVisible = function() {
  if (!Object.isElement(this.actual)) {
    return this.report_("toBeVisible",
        false,
        "Expected DOM element but got " + this.actual
    );
  }

  var actualIsVisible = Element.visible(this.actual) &&
                Element.ancestors(this.actual).all(function(element) {return Element.visible(element);});

  return this.report_("toBeVisible",
      actualIsVisible,
      "Expected element " +
      pockets.dom.htmlEscape(pockets.ui.htmlForElement(this.actual)) +
      " to have been visible, but it was not."
  );
};

jasmine.Matchers.prototype.toNotBeVisible = function() {
  if (!Object.isElement(this.actual)) {
    return this.report_("toNotBeVisible",
        false,
        "Expected DOM element but got " + this.actual
    );
  }
  var actualIsVisible = Element.visible(this.actual) &&
                Element.ancestors(this.actual).all(function(element) {return Element.visible(element);});

  return this.report_("toNotBeVisible",
      !actualIsVisible,
      "Expected element id " +
      pockets.dom.htmlEscape(pockets.ui.htmlForElement(this.actual)) +
      " to have been invisible, but it was in fact visible."
  );
};

jasmine.Matchers.prototype.toHaveButtonLabel = function(expectedButtonText) {
  if (!Object.isElement(this.actual)) {
    return this.report_("toHaveButtonLabel",
        false,
        "Expected DOM element but got " + this.actual
    );
  }
  if (this.actual.getAttribute("x-mojo-element") != "Button") {
    return this.report_("toHaveButtonLabel",
        false,
        "Expected a button, but it wasn't"
    );
  }
  if (!this.actual.querySelector(".palm-button-wrapper")) {
    return this.report_("toHaveButtonLabel",
        false,
        "Expected a fully activated button, but it wasn't set up"
    );
  }
  var actualButtonText = this.actual.querySelector(".palm-button-wrapper .truncating-text").innerHTML;
  return this.report_("toHaveButtonLabel",
      actualButtonText.strip() == expectedButtonText.strip(),
      "Expected button text to match, but it does not",
      expectedButtonText
  );
};
