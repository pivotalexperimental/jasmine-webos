/*
* TestAssistant is a Mojo Scene Assistant used to report spec results. It is included
* in your application in test mode.  It is a Jasmine Reporter, gathering results
* of specs via the reporter callback interface.  It then displays the spec results
* via Mojo interface widgets.
*
* @constructor
* */
function xTextAssistant() {
  this.pocketsTemplatePath = '../../plugins/jasmine-webos/app/views/';
  this.running_ = false;
}
// @ignore
xTextAssistant._createdTestFrame = false;

// @ignore
xTextAssistant.prototype.setup = function() {
  var popupBlocked = !(popup = window.open('','popup','width=1,height=1,left=0,top=0,scrollbars=no'));
  if (popup) popup.close();
  if (popupBlocked) {
    this.controller.get("error-list").innerHTML = '<div class="palm-group"><div class="palm-group-title">Errors</div><div class="palm-list"><div class="row jasmine_spec single"><div class="spec failed">Popup windows are blocked. Please unblock, then run again</div></div></div></div>';
    return;
  };

  if (!xTextAssistant._createdTestFrame) {
    // TODO: this should NOT be a dashboard stage, but should be another card stage that is minimized
    Mojo.Controller.appController.createStageWithCallback({
      name: 'test-frame',
      lightweight: !pockets.inPalmHost()
    }, function(controller) {
      pockets.test.testWindow = controller.window;
      pockets.test.testStageController = controller;
      jasmine.getEnv().execute();
    }, 'dashboard');
    xTextAssistant._createdTestFrame = true;
  }

  //add the jasmine css
  var head = document.getElementsByTagName('head')[0];
  var cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.type = 'text/css';
  cssTag.href = 'plugins/jasmine-webos/stylesheets/mojo_jasmine.css';

  head.appendChild(cssTag);

  jasmine.getEnv().specFilter = this.shouldRun.bind(this);

  if (!this.underTest) {
    jasmine.getEnv().addReporter(this);
    if(Mojo.getLaunchParameters().resultsHost) {
      this.ajaxReporter = new AjaxReporter(Mojo.getLaunchParameters().resultsHost);
      jasmine.getEnv().addReporter(this.ajaxReporter);
    }
  }

  this.currentSuiteIndex = 0;
  this.testListWidgets = [];

  var specCount = 0;
  this.errorList = new Widgets.ErrorListWidget({
    assistant: this,
    widgetId: "error-list",
    title: 'Errors'
  }, this.pocketsTemplatePath);

  this.errorList.hide();

  var resultsDiv = this.controller.get('jasmine_results');

  this.suiteList = new Widgets.SuiteListWidget({
    parentElement: resultsDiv,
    assistant: this,
    widgetId: "suites",
    title: "Suites"
  }, this.pocketsTemplatePath);

  var suites = jasmine.getEnv().currentRunner().suites();

  function populateSuiteWidgets(suites) {
    for (var i = 0; i < suites.length; i++) {
      var suite = suites[i];

      if (!(suite instanceof jasmine.Suite)) continue;

      specCount += suite.specs().length;
      var widget = new Widgets.TestListWidget({
        parentElement: resultsDiv,
        assistant: this,
        widgetId: "suite_results_" + i,
        title: suite.getFullName()
      }, this.pocketsTemplatePath);
      this.testListWidgets.push(widget);

      populateSuiteWidgets.call(this, suite.specs());
    }
  }

  populateSuiteWidgets.call(this, suites);

  this.pillModel = {value: 0.0, title: 'Running Specs...', icon:'cannot be blank'};

  this.pill = Widgets.testProgressWidget({
    widgetId: 'progressPill',
    assistant: this,
    model: this.pillModel,
    increment: specCount > 0 ? (1 / specCount) : 1
  });

  this.controller.setupWidget(Mojo.Menu.commandMenu,
    this.attributes = {spacerHeight: 0, menuClass: 'no-fade'},
    this.model = {
      visible: true,
      items : [{label: "Rerun", command: "rerun"}, {label: "Run All", command: "run-all"}]
    });
};

// @ignore
xTextAssistant.prototype.infoFor = function(suiteOrSpec) {
  if (suiteOrSpec instanceof jasmine.Suite) { // suite
    //noinspection UnnecessaryLocalVariableJS
    var suite = suiteOrSpec;
    var children = [];

    for (var i = 0; i < suite.specs.length; i++) {
      children.push(this.infoFor(suite.specs[i]));
    }

    return {
      type: 'suite',
      name: suite.description,
      children: children
    };

  } else { // spec
    //noinspection UnnecessaryLocalVariableJS
    var spec = suiteOrSpec;
    return {
      id: spec.id,
      type: 'spec',
      name: spec.description
    };

  }
};

// @ignore
xTextAssistant.prototype.handleCommand = function(event) {
  if (event.command == "run-all")
    document.location = xTextAssistant.focusUrl({});
  else
    document.location.reload();
};

// @ignore
xTextAssistant.prototype.activate = function(event) {
  this.controller.modelChanged(this.pillModel, this);

  document.title = 'Jasmine - ' + Mojo.appInfo.title + ' Test Results';
};

// @ignore
xTextAssistant.prototype.deactivate = function(event) {
};

// @ignore
xTextAssistant.prototype.cleanup = function(event) {
};

// @ignore
xTextAssistant.prototype.shouldRun = function(spec) {
  var launchParams = Mojo.getLaunchParameters();
  if (launchParams['suite'] && spec.suite.getFullName().indexOf(launchParams['suite']) != 0) return false;
  if (launchParams['spec'] && spec.description != launchParams['spec']) return false;
  if (launchParams['description']) {
    var specName = spec.getFullName();
    return specName.indexOf(launchParams['description']) > -1;
  } else {
    return true;
  }
};

/*
 * Jasmine Reporter interface & helper functions
 *
 * @ignore
 */

xTextAssistant.prototype.displaySpecResults = function(spec) {
  this.pill.increment();
  this.testListWidgets[this.currentSuiteIndex].addSpecResult(spec);

  if (spec.results().failedCount > 0) {
    this.pill.displayOnFail();
    this.errorList.show();
    this.errorList.addSpecResult(spec);
  }
};

// @ignore
xTextAssistant.prototype.reportSpecResults = function(spec) {
  this.displaySpecResults(spec);
};

// @ignore
xTextAssistant.prototype.reportSuiteResults = function(suite) {
  this.suiteList.addSuite(suite);
  this.currentSuiteIndex++;
};

// @ignore
xTextAssistant.prototype.reportRunnerResults = function(runner) {
  pockets.test.runningTests = false;
  var results = runner.results();
  this.pill.finishedWith(results);
  Mojo.Controller.getAppController().closeStage('test-frame');
};

// @ignore
xTextAssistant.prototype.log = function(str) {
  Mojo.Log.info(str);
};

// @ignore
xTextAssistant.focusUrl = function(criteria) {
  var json = Object.toJSON(Object.extend({runTests: true}, criteria));
  return '?mojoHostLaunchParams=' + escape(json);
};

xTextAssistant.prototype.reportRunnerStarting = function() {
  pockets.test.runningTests = true;
};
