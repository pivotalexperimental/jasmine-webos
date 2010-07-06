function TestAssistant() {
  this.reporter = new JasmineReporter(this, jasmine.getEnv());
}

TestAssistant.prototype.setup = function() {
  this.addJasmineCSS();
  this.setUpJasmineHeader();
  this.setUpFailedSpecsList();

  this.controller.setupWidget('pill', {cancellable: false}, this.reporter.getPillModel());
};

TestAssistant.prototype.addJasmineCSS = function() {
  var cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.type = 'text/css';
  cssTag.href = 'plugins/jasmine-webos/stylesheets/jasmine-webos.css';

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(cssTag);
};

TestAssistant.prototype.setUpJasmineHeader = function() {
  this.controller.sceneElement.querySelector('.version-info').innerHTML = "Jasmine " + jasmine.getEnv().versionString();
};

TestAssistant.prototype.setUpFailedSpecsList = function() {
  var listAttributes = {
    listTemplate: '../../plugins/jasmine-webos/app/views/test/spec-list',
    itemTemplate: '../../plugins/jasmine-webos/app/views/test/failed-spec',
    onItemRendered: this.addFailureMessages.bind(this)
  };
  this.controller.setupWidget(
    'failed-specs',
    listAttributes,
    this.reporter.getFailedSpecsListModel());
};

TestAssistant.prototype.addFailureMessages = function(widget, specResult, itemElement) {
  var failuresElement = itemElement.querySelector('.failures');

  var failMessages = [];
  for (var i=0; i < specResult.expectations.length; i++) {
    var expectation = specResult.expectations[i];
    if (!expectation.passed()) {
      failMessages.push( '<span class="num-bullet">' + (i + 1) + '.</span> ' + expectation.message);
    }
  }

  var messages = '';
  var className =  (failMessages.length == 1) ? 'single' : 'first';

  for( i=0; i < failMessages.length; i++ ) {
    messages += '<div class="palm-row ' + className +'">' + failMessages[i] + '</div>';
    className = (i == (failMessages.length - 2 )) ? 'last' : '';
  }

  failuresElement.innerHTML = messages;
};

TestAssistant.prototype.activate = function() {
  jasmine.getEnv().execute();
};

// View interface
TestAssistant.prototype.writeToLog = function(message) {
  Mojo.Log.info("Jamine.log: " + message);
};

TestAssistant.prototype.runnerStarted = function(specCount) {
};

TestAssistant.prototype.specCompleted = function(spec) {
  this.controller.modelChanged(this.reporter.getPillModel(), this);
};

TestAssistant.prototype.specFailed = function(spec) {
  this.controller.sceneElement.querySelector('#pill').addClassName('fail');
  this.controller.modelChanged(this.reporter.getFailedSpecsListModel(), this);
};

TestAssistant.prototype.suiteCompleted = function(suite) {
  this.controller.modelChanged(this.reporter.getPillModel(), this);
};

TestAssistant.prototype.runnerCompleted = function(runner) {
  this.controller.modelChanged(this.reporter.getPillModel(), this);
  var timeElement = this.controller.sceneElement.querySelector('.time');
  timeElement.innerHTML = 'Finished at ' +
                          Mojo.Format.formatDate(new Date(), {time: 'full'}) +
                          ' on ' +
                          Mojo.Format.formatDate(new Date(), {date: 'short'});
};

// TODO: Handle this better
var pockets = {
  inPalmHost: function() {return false;}
};
