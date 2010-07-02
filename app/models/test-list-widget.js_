if (Widgets === undefined) {
  var Widgets = {};
}

Widgets.ResultListWidget = function (options) {
  pockets.ui.ListWidget.call(this, options);

};
Widgets.ResultListWidget.inheritsFrom(pockets.ui.ListWidget);

Widgets.ResultListWidget.prototype.addSpecResult = function(spec) {
  this.addItemToList(this.formatResult(spec));
};

Widgets.ResultListWidget.prototype.formatResult = function (spec) {
  var result = spec.results();
  return {
    spec: spec,
    cssClass: result.skipped ? 'pending' : result.passed() ? 'passed' : 'failed',
    specDescription: result.description
  };
};

pockets.dompp = function(parentNode, o) {
  var domPrettyPrinter = new pockets.DomPrettyPrinter();
  domPrettyPrinter.format(o);
  parentNode.appendChild(domPrettyPrinter.dom);
};

Widgets.ResultListWidget.prototype.renderExpectationResult = function(parentNode, expectationResult, number) {
  var matcherName = expectationResult.matcherName;
  parentNode.innerText = 'Expectation ' + number + ': ' + matcherName + '() failed:';

  var expected, actual;
  switch(matcherName) {

  case 'toEqual':
    expected = expectationResult.expected;
    actual   = expectationResult.actual;
    this.renderExpectedAndActual(parentNode, expected, actual);
    break;

  case 'wasCalledWith':
    expected = expectationResult.expected;
    var spyArguments   = expectationResult.actual && expectationResult.actual.isSpy ? expectationResult.actual.argsForCall : "Actual is <b>not</b> a spy";
    this.renderExpectedAndActual(parentNode, expected, spyArguments);
    break;

  default:
    parentNode.innerHTML = expectationResult.message;
    break;
  }
};

Widgets.ResultListWidget.prototype.renderExpectedAndActual = function(parentNode, expected, actual) {
  var expectedDiv;
  var actualDiv;
  parentNode.appendChild(
    pockets.dom.create('table', {className: 'failed-expectation-summary', width: '100%'},
      pockets.dom.create('tr', {},
        pockets.dom.create('td', {}, 'Expected:')),
      pockets.dom.create('tr', {},
        expectedDiv = pockets.dom.create('td', {className: 'expected', width: '100%'})),
      pockets.dom.create('tr', {},
        pockets.dom.create('td', {}, 'Actual:')),
      pockets.dom.create('tr', {},
        actualDiv = pockets.dom.create('td', {className: 'actual', width: '50%'}))));

  pockets.dompp(expectedDiv, expected);
  pockets.dompp(actualDiv, actual);
};


Widgets.ResultListWidget.prototype.onItemRendered = function(listWidget, itemModel, itemNode) {
  var results = itemModel.spec.results();

  if (results.failedCount > 0) {
    var messagesDiv = itemNode.querySelector('.messages');

    messagesDiv.appendChild(pockets.dom.create('span', {}, results.passedCount + ' passed, ' + results.failedCount + ' failed.'));
    messagesDiv.appendChild(pockets.dom.create('br'));
    messagesDiv.appendChild(pockets.dom.create('br'));

    var failureMessagesDiv = pockets.dom.create('ul', {className: 'failureMessages'});
    var expectationNumber = 1;
    var resultItems = results.getItems();
    for (var i = 0; i < resultItems.length; i++) {
      var expectationResult = resultItems[i];

      if (expectationResult.type == 'ExpectationResult') {
        if (!expectationResult.passed()) {
          var failureMessageDiv = pockets.dom.create('li');
          this.renderExpectationResult(failureMessageDiv, expectationResult, expectationNumber);
          failureMessagesDiv.appendChild(failureMessageDiv);
        }
        expectationNumber++;
      } else {
        var messageDiv = pockets.dom.create('li', {}, expectationResult.text);
        messagesDiv.appendChild(messageDiv);
      }
    }
    messagesDiv.appendChild(failureMessagesDiv);
  }

  Mojo.Event.listen(itemNode, Mojo.Event.tap, function() {
    document.location = TestAssistant.focusUrl({description: itemModel.spec.description});
  }.bind(this));
};



Widgets.TestListWidget = function (options, templatePath) {
  options.listTemplate = templatePath !== undefined ? templatePath + 'test/suite' : 'test/suite';
  options.itemTemplate = templatePath !== undefined ? templatePath + 'test/result' : 'test/result';

  Widgets.ResultListWidget.call(this, options);

};
Widgets.TestListWidget.inheritsFrom(Widgets.ResultListWidget);

Widgets.TestListWidget.prototype.addSpecResult = function(spec) {
  this.addItemToList(this.formatResult(spec));
};



Widgets.SuiteListWidget = function(options, templatePath) {
  options.listTemplate = templatePath !== undefined ? templatePath + 'test/suites' : 'test/suites';
  options.itemTemplate = templatePath !== undefined ? templatePath + 'test/suiteItem' : 'test/suiteItem';

  Widgets.ResultListWidget.call(this, options, templatePath);
};
Widgets.SuiteListWidget.inheritsFrom(Widgets.ResultListWidget);

Widgets.SuiteListWidget.prototype.addSuite = function(suite) {
  var results = suite.results();
  this.addItemToList({
    suite: results,
    cssClass: results.passed() ? "passed" : "failed",
    suiteName: suite.getFullName(),
    passedCount: results.passedCount,
    totalCount: results.totalCount
  });
};

Widgets.SuiteListWidget.prototype.onItemRendered = function(listWidget, itemModel, itemNode) {
  Mojo.Event.listen(itemNode, Mojo.Event.tap, function() {
    document.location = TestAssistant.focusUrl({suite: itemModel.suite.description});
  }.bind(this));
};
