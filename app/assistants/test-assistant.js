function TestAssistant() {
  this.reporter = new JasmineReporter(this, jasmine.getEnv());
}

TestAssistant.prototype.setup = function() {
  this.addJasmineCSS();
  this.setUpJasmineHeader();

  this.controller.setupWidget('pill', {cancellable: false}, this.reporter.getPillModel());
};

TestAssistant.prototype.addJasmineCSS = function() {
  //add the jasmine css
  var head = document.getElementsByTagName('head')[0];
  var cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.type = 'text/css';
  cssTag.href = 'plugins/jasmine-webos/stylesheets/mojo_jasmine.css';

  head.appendChild(cssTag);

};

TestAssistant.prototype.setUpJasmineHeader = function() {
  this.controller.sceneElement.querySelector('.version-info').innerHTML = "Jasmine " + jasmine.getEnv().versionString();
};

TestAssistant.prototype.activate = function() {
  jasmine.getEnv().execute();
};

// View interface
TestAssistant.prototype.writeToLog = function(message) {
  Mojo.Log.info("Jamine.log: " + message);
};

TestAssistant.prototype.runnerStarted = function(specCount) {
  this.startTime = Date.now();
};

TestAssistant.prototype.specCompleted = function(spec) {
  this.controller.modelChanged(this.reporter.getPillModel(), this);
};

TestAssistant.prototype.specFailed = function() {
  this.controller.sceneElement.querySelector('#pill').addClassName('fail');
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


/* TODO:
- Widget that shows the error data, including matcher output
- Ability to show all passing specs as full sentences (likely just one list widget)
 */


