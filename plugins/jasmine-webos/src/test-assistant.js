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
    itemTemplate: '../../plugins/jasmine-webos/app/views/test/failed-spec'
  };
  this.controller.setupWidget(
    'failed-specs',
    listAttributes,
    this.reporter.getFailedSpecsListModel());
  var self = this;
  var failedSpecList = this.controller.sceneElement.querySelector('#failed-specs');
  Mojo.Event.listen(failedSpecList, Mojo.Event.listTap, function(event) {
    self.controller.stageController.pushScene({
      name: 'error',
      sceneTemplate: '../../plugins/jasmine-webos/app/views/error/error-scene'
    }, event.item);
  });
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
  inPalmHost: function() {
    return false;
  }
};
