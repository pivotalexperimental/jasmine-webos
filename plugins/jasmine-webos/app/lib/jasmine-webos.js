if (! (jasmine && jasmine.webos) ) {
  /**
   * @namespace
   */
  jasmine.webos = {};
}

jasmine.webos.launchedInTestMode = function() {
  var launchParameters = Mojo.getLaunchParameters();
  return (launchParameters['runTests'] !== undefined);
};

jasmine.webos.readFile = function(filePath) {
  if (!jasmine.webos.getPalmVersionString()) {
    throw new Error("Jasmine webOS cannot read files when running in a browser");
  }

  var contents;
  contents = Mojo.View._renderNamedTemplate('../../' + filePath, {});
  if (contents.match(/template load failed/)) {
    throw new Error("couldn't read file " + Mojo.appPath + filePath);
  }
  return contents;
};

/**
 * @ignore
 * @private
 */
jasmine.webos.getPalmVersionString = function () {
  return window.PalmSystem && window.PalmSystem.version;
};

/**
 * Returns true if your application is currently running in the emulator
 */
jasmine.webos.inEmulator = function() {
  return !!jasmine.webos.getPalmVersionString().match('desktop');
};

/**
 * Returns true if your application is currently running on device
 */
jasmine.webos.inDevice = function() {
  return !!jasmine.webos.getPalmVersionString().match('device');
};

jasmine.webos.runTests = function(stageController) {
  stageController.pushScene({
    name: 'test',
    sceneTemplate: '../../plugins/jasmine-webos/app/views/test/test-scene'
  });
};

jasmine.webos.explode = function() {
  throw "jasmine.webos.explode does not expect to be called";
};

jasmine.webos.versionString = function() {
  return 'Jasmine webOS ' +
      jasmine.webos.version.major + '.' +
      jasmine.webos.version.minor + '.' +
      jasmine.webos.version.build +
      ' v.' +
      jasmine.webos.version.revision;
};
/* Test runner bootstrapping: swap in our own AppAssistant,
 * which will remove itself immediately and run tests if requested.
 * Note, if AppAssistant is not defined first, we define a basic one
 */
if (Mojo && !window['AppAssistant']) {
  AppAssistant = function() {};
}
jasmine.webos.originalAppAssistant_ = window['AppAssistant'];
jasmine.webos.originalStageAssistant = window['StageAssistant'];
jasmine.webos.isTestingPockets_ = window['AppAssistant'] && AppAssistant.isPockets;

AppAssistant = function(appController) {
  console.error("=============> Jasmine webOS: Constructing Proxy App Assistant");
  var launchParameters = Mojo.getLaunchParameters();
  var runTests = launchParameters['runTests'];
  var reloadCSS = launchParameters['reloadCSS'];

  window['AppAssistant'] = jasmine.webos.originalAppAssistant_;
  var realAppAssistant = new jasmine.webos.originalAppAssistant_(appController);

  if (runTests) {
    Mojo.Log.info("====> Jasmine webOS: prepping to run specs");
    spyOn(Mojo, "Depot").andReturn(new jasmine.webos.FakeDepot());

    window['StageAssistant'] = function() {
      window['StageAssistant'] = jasmine.webos.originalStageAssistant;
    };

    StageAssistant.prototype.setup = function() {
      jasmine.webos.runTests(this.controller);
    };

    if (Mojo.appInfo.noWindow) {
      console.error("=============> Jasmine webOS: About to push scene for spec results");
      appController.createStageWithCallback({
        name: 'jasmine-webos-test-runner',
        assistantName: 'DefaultStageAssistant',
        lightweight: true
      }, function(stageController) {
        jasmine.webos.runTests(stageController);
      });
    }
  } else {
    var originalHandleLaunch = realAppAssistant.handleLaunch;
    realAppAssistant.handleLaunch = function(launchParams) {
      if (launchParams["reloadCss"]) {
        Mojo.Log.info("reloading css...");
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
          if (links[i].rel === "stylesheet") {
            if (links[i].href.indexOf("?") === -1) {
              links[i].href += "?";
            }
            links[i].href += "x";
          }
        }
        return;
      }
      if (originalHandleLaunch) {
        return originalHandleLaunch.apply(this, arguments);
      }
    };
  }

  return realAppAssistant;
};
function ErrorAssistant(specResult) {
  this.specResult = specResult;
}

ErrorAssistant.prototype.setup = function() {
  this.setUpExpectationList();
};

ErrorAssistant.prototype.setUpExpectationList = function() {
  var listAttributes = {
    listTemplate: '../../plugins/jasmine-webos/app/views/error/spec-result',
    itemTemplate: '../../plugins/jasmine-webos/app/views/error/expectation',
    itemsProperty: 'expectations'
  };
  this.controller.setupWidget(
    'spec-result',
    listAttributes,
    this.specResult);
};

jasmine.webos.FakeDepot = function(seedObject) {
  var values = {};
  var self = {};

  self.peek = function(key) {
    if (values.hasOwnProperty(key)) {
      return eval("(" + values[key] + ")");
    } else {
      return null;
    }
  };

  self.poke = function(key, value) {
    values[key] = Object.toJSON(value);
  };

  self.add = function() {
    var calls = [];

    var add_ = function(key, value, onSuccess, onFailure) {
      calls.unshift({ key: key, value: value, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(add_, calls, function(call) {
      self.poke(call.key, call.value);
      if (call.onSuccess) {
        call.onSuccess();
      }
    }, defaultFailure);

    return add_;
  }();

  self.get = function() {
    var calls = [];

    var get_ = function(key, onSuccess, onFailure) {
      calls.unshift({ key: key, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(get_, calls, function(call) {
      if (call.onSuccess) {
        call.onSuccess(self.peek(call.key));
      }
    }, defaultFailure);

    return get_;
  }();

  self.discard = function() {
    var calls = [];

    var discard_ = function(key, onSuccess, onFailure) {
      calls.unshift({ key: key, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(discard_, calls, function(call) {
      delete values[call.key];
      if (call.onSuccess) {
        call.onSuccess();
      }
    }, defaultFailure);

    return discard_;
  }();

  seedDepot();
  return self;

  function seedDepot() {
    for (key in seedObject) {
      if (seedObject.hasOwnProperty(key)) {
        self.poke(key, seedObject[key]);
      }
    }
  }

  function addFakeAsynchronicity(func, calls, performSuccess, performFailure) {
    func.succeed = function() {
      performSuccess(calls.shift());
    };

    func.succeedAll = function() {
      calls.each(function(call) {
        performSuccess(call);
      });
      calls.clear();
    };

    func.fail = function() {
      performFailure(calls.shift());
    };

    func.failAll = function() {
      calls.each(function(call) {
        performFailure(call);
      });
      calls.clear();
    }
  }

  function defaultFailure(call) {
    if (call.onFailure) {
      call.onFailure();
    }
  }
};
/* Make jasmine consider bound functions */

jasmine.webos.bind = function() {
  if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
  var boundFn = function() {
    return boundFn.method.apply(boundFn.object, boundFn.args.concat($A(arguments)));
  };
  boundFn.method = this;
  boundFn.args = $A(arguments);
  boundFn.object = boundFn.args.shift();
  boundFn["__isJasmineWebOsBoundFn__"] = true;
  return boundFn;
};

jasmine.webos.testFunctionEquality = function(a, b, env, mismatchKeys, mismatchValues) {
  if (typeof a === "function" && typeof b === "function" && a["__isJasmineWebOsBoundFn__"] && b["__isJasmineWebOsBoundFn__"]) {
    if (a.object !== b.object) {
      mismatchValues.push("'this' object of bound functions didn't match");
      return false;
    }
    if (a.method !== b.method) {
      mismatchValues.push("method of bound functions didn't match");
      return false;
    }
    return env.equals_(a.args, b.args, mismatchKeys, mismatchValues);
  }
  return undefined;
};

Function.prototype.bind = jasmine.webos.bind;
jasmine.getEnv().addEqualityTester(jasmine.webos.testFunctionEquality);

function JasmineReporter(view, jasmineEnv) {
  var self = this;

  jasmineEnv.addReporter(self);

  var specCount;
  var specIncrement;
  var startTime, endTime;

  var failedSpecResultsModel = {
    listClass: 'fail',
    listTitle: 'Failing Specs',
    items: []
  };

  var allSpecsResultsListModel = {
    listTitle: 'All Specs',
    items: []
  };

  var progressPillModel = {};

  initialize();

  self.__defineGetter__("specCount", function() {
    return specCount;
  });

  self.getFailedSpecsListModel = function() {
    return failedSpecResultsModel;
  };

  self.getAllSpecsListModel = function() {
    return allSpecsResultsListModel;
  };

  self.getPillModel = function() {
    return progressPillModel;
  };

  // Jasmine Reporter interface
  self.log = function(message) {
    view.writeToLog(message);
  };

  self.reportRunnerStarting = function(runner) {
    startTime = startTime || Date.now();
    specCount = runner.specs().length;

    specIncrement = specCount ? 1 / specCount : 1;

    view.runnerStarted(specCount);
  };

  self.reportSpecResults = function(spec) {
    progressPillModel.value += specIncrement;
    if (!spec.results().passed()) {
      failedSpecResultsModel.items.push(new SpecResult(spec));
      view.specFailed(spec);
    }
    allSpecsResultsListModel.items.push(new SpecResult(spec));
    view.specCompleted(spec);
  };

  self.reportSuiteResults = function(suite) {
    view.suiteCompleted();
  };

  self.reportRunnerResults = function(runner) {
    endTime = endTime || Date.now();
    progressPillModel.value = 1.0;
    progressPillModel.title = specCount + ' specs, ' + failedSpecResultsModel.items.length + ' failures in ' + (endTime - startTime)/1000 + 's';
    view.runnerCompleted();
  };

  return self;

  function initialize() {
    failedSpecResultsModel.items.clear();
    allSpecsResultsListModel.items.clear();
    progressPillModel.value = 0.0;
    progressPillModel.title = "Running Specs...";
    specCount = 0.0;
    specIncrement = 0.0;
    startTime = 0;
    endTime = 0;
  }
}

//
//// TODO: this is insulating Pockets' matchers from Jasmine matchers machinations. Fix when jasmine stabilizes.
//jasmine.Matchers.prototype.report_ = function(matcherName, result, message, expected, details) {
//  var expectationResult = new jasmine.ExpectationResult({
//    matcherName: matcherName,
//    passed: result,
//    message: message,
//    actual: this.actual,
//    expected: expected,
//    details: details
//  });
//  this.spec.addMatcherResult(expectationResult);
//  return result;
//};
//
//jasmine.Matchers.prototype.toBeAWidgetOfType = function(expectedType) {
//  if (!this.actual || !pockets.getWidgetController(this.actual)) {
//    return this.report_("toBeAWidgetOfType",
//        false,
//        'Expected ' + this.actual + ' to be a Mojo ' + expectedType + ' widget, but it wasn\'t',
//        expectedType);
//  }
//  var actualType = this.actual.getAttribute('x-mojo-element');
//  return this.report_("toBeAWidgetOfType",
//      (actualType == expectedType),
//      'Expected ' + this.actual + ' to be a Mojo ' + expectedType + ' widget but was Mojo ' + actualType,
//      expectedType);
//};
///** @deprecated */
//jasmine.Matchers.prototype.shouldBeAWidgetOfType = jasmine.Matchers.prototype.toBeAWidgetOfType;
//
//jasmine.Matchers.prototype.toBeVisible = function() {
//  if (!Object.isElement(this.actual)) {
//    return this.report_("toBeVisible",
//        false,
//        "Expected DOM element but got " + this.actual
//    );
//  }
//
//  var actualIsVisible = Element.visible(this.actual) &&
//                Element.ancestors(this.actual).all(function(element) {return Element.visible(element);});
//
//  return this.report_("toBeVisible",
//      actualIsVisible,
//      "Expected element " +
//      pockets.dom.htmlEscape(pockets.ui.htmlForElement(this.actual)) +
//      " to have been visible, but it was not."
//  );
//};
//
//jasmine.Matchers.prototype.toNotBeVisible = function() {
//  if (!Object.isElement(this.actual)) {
//    return this.report_("toNotBeVisible",
//        false,
//        "Expected DOM element but got " + this.actual
//    );
//  }
//  var actualIsVisible = Element.visible(this.actual) &&
//                Element.ancestors(this.actual).all(function(element) {return Element.visible(element);});
//
//  return this.report_("toNotBeVisible",
//      !actualIsVisible,
//      "Expected element id " +
//      pockets.dom.htmlEscape(pockets.ui.htmlForElement(this.actual)) +
//      " to have been invisible, but it was in fact visible."
//  );
//};
//
//jasmine.Matchers.prototype.toHaveButtonLabel = function(expectedButtonText) {
//  if (!Object.isElement(this.actual)) {
//    return this.report_("toHaveButtonLabel",
//        false,
//        "Expected DOM element but got " + this.actual
//    );
//  }
//  if (this.actual.getAttribute("x-mojo-element") != "Button") {
//    return this.report_("toHaveButtonLabel",
//        false,
//        "Expected a button, but it wasn't"
//    );
//  }
//  if (!this.actual.querySelector(".palm-button-wrapper")) {
//    return this.report_("toHaveButtonLabel",
//        false,
//        "Expected a fully activated button, but it wasn't set up"
//    );
//  }
//  var actualButtonText = this.actual.querySelector(".palm-button-wrapper .truncating-text").innerHTML;
//  return this.report_("toHaveButtonLabel",
//      actualButtonText.strip() == expectedButtonText.strip(),
//      "Expected button text to match, but it does not",
//      expectedButtonText
//  );
//};
Ajax.Request.prototype.response = function(responseOptions) {
  this.transport.readyState = 4;
  if (typeof(responseOptions) == "string") {
    responseOptions = {responseText: responseOptions};
  }

  this.transport.responseHeaders = responseOptions.responseHeaders ||
                                   {"Content-type": responseOptions.contentType || Ajax.Response.defaultContentType};
  this.transport.status = typeof(responseOptions.status) == "undefined" ? 200 : responseOptions.status;
  this.transport.responseText = responseOptions.responseText;
  this.transport.onreadystatechange();
};

Ajax.Response.defaultContentType = "application/json";

Ajax.Request.prototype.oldRequest = Ajax.Request.prototype.request;

Ajax.Request.prototype.request = function(url) {
  this.oldRequest(url);
  AjaxRequests.requests.push(this);
};

Ajax.RealRequest = Class.create(Ajax.Request, {
  request: function(url) {
    this.transport = Try.these(
            function() {
              return new XMLHttpRequest();
            },
            function() {
              return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function() {
              return new ActiveXObject('Microsoft.XMLHTTP');
            }
            ) || false;
    this.oldRequest(url);
  }
});

var AjaxRequests = {
  requests: [],
  clear: function() {
    this.requests.clear();
  },
  activeRequest: function() {
    if (this.requests.length > 0) {
      return this.requests[this.requests.length - 1];
    } else {
      return null;
    }
  }
};

var FakeAjaxTransport = Class.create({
  initialize: function() {
    this.overrideMimeType = false;
    this.readyState = 0;
  },
  open: Prototype.emptyFunction,
  send: Prototype.emptyFunction,
  setRequestHeader: jasmine.createSpy(),
  getResponseHeader: function(name) {
    return this.responseHeaders[name];
  }
});

beforeEach(function() {
  AjaxRequests.requests.clear();
  spyOn(Ajax, "getTransport").andCallFake(function() {
    return new FakeAjaxTransport();
  });
});
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
if (jasmine.webos.getPalmVersionString()) {
  jasmine.webos.StubSceneController = function(stageController, sceneElement, sceneArguments, remainingArguments) {
    this.stageController = stageController;
    this.sceneElement = sceneElement;
    this.scrollingEnabled = !sceneArguments.disableSceneScroller;
    if (this.scrollingEnabled) {
      this.sceneScroller = this.sceneElement.parentNode;
    }
    this.window = {};
  };

  jasmine.webos.StubSceneController.prototype.get = function(id) {
    return this.sceneElement.querySelector('#' + id);
  };

  jasmine.webos.StubSceneController.prototype.select = Mojo.Controller.SceneController.prototype.select;
  jasmine.webos.StubSceneController.prototype.listen = Mojo.Controller.SceneController.prototype.listen;
  jasmine.webos.StubSceneController.prototype.stopListening = Mojo.Controller.SceneController.prototype.stopListening;
  jasmine.webos.StubSceneController.prototype.getSceneScroller = Mojo.Controller.SceneController.prototype.getSceneScroller;

  jasmine.webos.StubSceneController.prototype.setupWidget = Mojo.doNothing;
  jasmine.webos.StubSceneController.prototype.serviceRequest = Mojo.doNothing;
  jasmine.webos.StubSceneController.prototype.modelChanged = Mojo.doNothing;
  jasmine.webos.StubSceneController.prototype.showDialog = Mojo.doNothing;
  jasmine.webos.StubSceneController.prototype.showBanner = Mojo.doNothing;
}

jasmine.webos.createStubSceneAssistant = function(sceneArguments) {
  var remainingArguments = $A(arguments).slice(1);
  var stageController = new jasmine.webos.StubStageController();
  if (Object.isString(sceneArguments)) {
    sceneArguments = {name: sceneArguments };
  }
  var sceneName = sceneArguments.name;
  var sceneTemplateName = sceneArguments.sceneTemplate || sceneName + "/" + sceneName + "-scene";
  var sceneId = sceneArguments.id || "mojo-scene-" + sceneArguments.name;
  var content = Mojo.View.render({template: sceneTemplateName, object: stageController});
  content = content.strip();
  var nodeList = Mojo.View.convertToNodeList(content, document);
  var contentDiv = Mojo.View.wrapMultipleNodes(nodeList, document, true);
  contentDiv.id = sceneId;

  if (!sceneArguments.disableSceneScroller) {
    var scrollerId = sceneId + "-scene-scroller";
    var scrollerContent = "<div id='" + scrollerId + "' x-mojo-element='Scroller'></div>";
    var scroller = Mojo.View.convertToNode(scrollerContent, document);
    scroller.appendChild(contentDiv);
  }

  var sceneElement = $(contentDiv);

  sceneElement.addClassName('palm-scene');
  sceneElement.addClassName(sceneName + '-scene');

  var assistantName = sceneArguments.assistantName || Mojo.identifierToCreatorFunctionName(sceneName, "Assistant");

  var constructorFunction = sceneArguments.assistantConstructor || window[assistantName];

  Mojo.require(sceneArguments.allowUndefinedAssistant || constructorFunction,
    "The scene assistant '" + assistantName + "' is not defined. Did you remember to include it in index.html?");

  if (constructorFunction) {
    var assistant = Mojo.createWithArgs(constructorFunction, remainingArguments);
    assistant.controller = new jasmine.webos.StubSceneController(stageController, sceneElement, sceneArguments);
    assistant.controller.assistant = this;
  }

  return assistant;
};
jasmine.webos.StubStageController = function() {

};

jasmine.webos.StubStageController.prototype.pushScene = Mojo.doNothing;
jasmine.webos.StubStageController.prototype.popScene = Mojo.doNothing;
jasmine.webos.StubStageController.prototype.swapScene = Mojo.doNothing;
jasmine.webos.StubStageController.prototype.swapToRoot = Mojo.doNothing;
function TestAssistant() {
  this.reporter = new JasmineReporter(this, jasmine.getEnv());

  this.listAttributes = {
    listTemplate: '../../plugins/jasmine-webos/app/views/test/spec-list',
    itemTemplate: '../../plugins/jasmine-webos/app/views/test/spec',
    renderLimit: 500,
    onItemRendered: function(widget, item, node) {
      if (!item.passed) {
        node.writeAttribute({'x-mojo-tap-highlight': 'momentary'});
      }
    }
  };
}

TestAssistant.prototype.setup = function() {
  this.addJasmineCSS();
  this.setUpJasmineHeader();
  this.setUpFailedSpecsList();
  this.setUpCommandMenu();

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
  this.controller.sceneElement.querySelector('.jasmine-info').innerHTML = "Jasmine " + jasmine.getEnv().versionString();
  this.controller.sceneElement.querySelector('.jasmine-webos-info').innerHTML = jasmine.webos.versionString();
};

TestAssistant.prototype.setUpFailedSpecsList = function() {

  this.controller.setupWidget(
      'failed-specs',
      this.listAttributes,
      this.reporter.getFailedSpecsListModel());

  var failedSpecList = this.controller.sceneElement.querySelector('#failed-specs');

  Mojo.Event.listen(failedSpecList, Mojo.Event.listTap, this.listTapHandler.bind(this));
};

TestAssistant.prototype.setUpCommandMenu = function() {
  this.controller.setupWidget(Mojo.Menu.commandMenu, {}, {
    visible: true,
    items: [
      {},
      { label: 'All Results', command: 'all'}
    ]
  });
};

TestAssistant.prototype.setUpAllSpecsList = function() {
  this.controller.setupWidget(
      'all-specs',
      this.listAttributes,
      this.reporter.getAllSpecsListModel());
  var allSpecList = this.controller.sceneElement.querySelector('#all-specs');
  Mojo.Event.listen(allSpecList, Mojo.Event.listTap, this.listTapHandler.bind(this));
};

TestAssistant.prototype.activate = function() {
  jasmine.getEnv().execute();
};

TestAssistant.prototype.listTapHandler = function(event) {
  if (event.item.passed) {
    return;
  }

  this.controller.stageController.pushScene({
    name: 'error',
    sceneTemplate: '../../plugins/jasmine-webos/app/views/error/error-scene'
  }, event.item);

};


TestAssistant.prototype.handleCommand = function(event) {
  switch (event.command) {

    case 'all':
      this.setUpAllSpecsList();
      this.controller.instantiateChildWidgets(this.controller.sceneElement);
      break;

    default:
      event.stop();
  }
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

jasmine.webos.version = {
  "major": 0,
  "minor": 9,
  "build": 0,
  "revision": 1280379860
};
