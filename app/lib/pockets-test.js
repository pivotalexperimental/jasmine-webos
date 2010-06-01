pockets.test = {};

pockets.test.domPrettyPrint = true;

pockets.test.runningTests = false;


/* Make jasmine consider bound functions */

pockets.test.bind = function() {
  if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
  var boundFn = function() {
    return boundFn.method.apply(boundFn.object, boundFn.args.concat($A(arguments)));
  };
  boundFn.method = this;
  boundFn.args = $A(arguments);
  boundFn.object = boundFn.args.shift();
  boundFn["__isPocketsBoundFn__"] = true;
  return boundFn;
};

pockets.test.testFunctionEquality = function(a, b, env, mismatchKeys, mismatchValues) {
  if (typeof a === "function" && typeof b === "function" && a["__isPocketsBoundFn__"] && b["__isPocketsBoundFn__"]) {
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

Function.prototype.bind = pockets.test.bind;
jasmine.getEnv().addEqualityTester(pockets.test.testFunctionEquality);


/* Test runner bootstrapping: swap in our own AppAssistant,
 * which will remove itself immediately and run tests if requested
 */

pockets.originalAppAssistant_ = window['AppAssistant'];
pockets.originalStageAssistant = window['StageAssistant'];
pockets.isTestingPockets_ = window['AppAssistant'] && AppAssistant.isPockets;

AppAssistant = function(appController) {
  var launchParameters = Mojo.getLaunchParameters();
  var runTests = launchParameters['runTests'];
  var reloadCSS = launchParameters['reloadCSS'];

  window['AppAssistant'] = pockets.originalAppAssistant_;
  var realAppAssistant = new pockets.originalAppAssistant_(appController);

  if (runTests) {
    spyOn(Mojo, "Depot").andReturn(new pockets.FakeDepot());

    window['StageAssistant'] = function() {
      window['StageAssistant'] = pockets.originalStageAssistant;
    };

    StageAssistant.prototype.setup = function() {
      pockets.runTests(this.controller);
    };

    if (Mojo.appInfo.noWindow) {
      if (pockets.inPalmHost()) {
        // from Mojo.Controller.setup inside if (!Mojo.Controller.appInfo.noWindow)...
        Mojo.Controller.setupStageController(window);
        Mojo.Power.setup(Mojo.Controller.appController.assistant, Mojo.Controller.appInfo.id);
      } else {
        appController.createStageWithCallback({
          name: 'pockets-test-runner',
          assistantName: 'DefaultStageAssistant',
          lightweight: true
        }, function(stageController) {
          pockets.runTests(stageController);

        });
      }
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

pockets.inTestRunner = function() {
  return jasmine && pockets.test.runningTests;
};

/** Override these methods if you would like to change your stage/app controller defaults. */
pockets.stubStageController = function() {
  return new pockets.test.FakeStageController(null);
};

pockets.stubAppController = function() {
  return new pockets.test.FakeAppController(null);
};

pockets.test.setInjectionContextFn = function(obj, getContextFn) {
  //todo: throw if obj is an instance

  // sets the get context function on the INSTANCE in test mode, NOT the prototype
  obj.__pockets__getInjectionContext__ = getContextFn;
};

pockets.test.FakeStageController = function(stageAssistant) {
  this.window = pockets.test.ui.getTestWindow(); //stageController must contain a reference to a window.

  this.iAmAPocketsStubStageController = true;
  this.pushScene = Mojo.doNothing;
  this.swapScene = Mojo.doNothing;
  this.swapToRoot = Mojo.doNothing;
  this.sendEventToCommanders = Mojo.doNothing;
  this.popScene = Mojo.doNothing;
  this.activeScene = Mojo.doNothing;
  this.assistant = stageAssistant;
  this.setup = Mojo.doNothing;
  this._appController = pockets.stubAppController();
};

pockets.test.FakeStageController.prototype = Mojo.Controller.StageController.prototype;

pockets.test.FakeAppController = function(appAssistant) {
  this.assistant = appAssistant;
};

pockets.test.createFakeSceneAssistant = function(sceneArguments) {
  var remainingArguments = $A(arguments).slice(1);
  var stageController = new pockets.FakeStageController();
  if (Object.isString(sceneArguments)) {
    sceneArguments = {name: sceneArguments };
  }
  var sceneName = sceneArguments.name;
  var sceneTemplateName = sceneArguments.sceneTemplate || sceneName + "/" + sceneName + "-scene";
  var sceneId = sceneArguments.id || "mojo-scene-" + sceneArguments.name;
  var content = Mojo.View.render({template: sceneTemplateName, object: stageController});
  content = content.strip();
  nodeList = Mojo.View.convertToNodeList(content, document);
  contentDiv = Mojo.View.wrapMultipleNodes(nodeList, document, true);
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
    assistant.controller = new pockets.FakeSceneController(stageController, sceneElement, sceneArguments);
    assistant.controller.assistant = this;
  }

  return assistant;
};


pockets.test._createSceneDom = function (sceneId, sceneHTML) {
  // be careful refactoring this! scroller-based tests (some lists, etc) will fail if this is not done correctly.
  var fakeSceneElement = Mojo.View.convertToNode('<div id="mojo-scene-' + sceneId + '" >' + sceneHTML + '</div>', document);
  var scrollerId = sceneId + "-scene-scroller";
  var scrollerContent = "<div id='" + scrollerId + "' x-mojo-element='Scroller'></div>";
  pockets.test.ui.getTestWindow().document.body.insert(scrollerContent);
  var scroller = pockets.test.ui.getTestWindow().document.getElementById(scrollerId);
  scroller.appendChild(fakeSceneElement);
  return fakeSceneElement;
};

/**
 * Creates a scene Assistant with a controller and rendered scene, but doesn't set it up or activate it.
 * @return {Object} The scene assistant that was created by Mojo.
 */
pockets.test.createGenericAssistant = function() {
  var assistantHTML = "";
  var genericAssistant = Class.create({});
  var sceneArguments = {
    name: "generic",
    disableSceneScroller: false,
    assistantConstructor: genericAssistant
  };
  var stageController = pockets.stubStageController();
  var fakeSceneElement = pockets.test._createSceneDom("generic", assistantHTML);

  jasmine.getEnv().currentSpec.after(function() {
    pockets.test.ui.getTestWindow().document.body.innerHTML = '';
  });

  return new Mojo.Controller.SceneController(stageController, fakeSceneElement, sceneArguments, []).assistant;
};

/**
 * Creates a scene Assistant with a controller and rendered scene, but doesn't set it up or activate it.
 * @param {String} sceneId
 * @param {Array} assistantArguments Arguments to pass to the assistant
 * @return {Object} The scene assistant that was created by Mojo.
 */
pockets.test.createSceneAssistant = function(sceneId, assistantArguments, templatePath) {
  if (! Object.isArray(assistantArguments || [])) {
    throw new Error("expect array for assistant arguments");
  }

  var template = templatePath ? templatePath : '';
  var assistantHTML = Mojo.View.render({
    template : template + sceneId + '/' + sceneId + '-scene'
  });
  var sceneArguments = {
    name: sceneId,
    disableSceneScroller: false
  };
  var stageController = pockets.stubStageController();
  var fakeSceneElement = pockets.test._createSceneDom(sceneId, assistantHTML);

  jasmine.getEnv().currentSpec.after(function() {
    pockets.test.ui.getTestWindow().document.body.innerHTML = '';
  });
  var sceneController = new Mojo.Controller.SceneController(stageController, fakeSceneElement, sceneArguments, assistantArguments);

  var testInjectionContext = {};
  pockets.test.setInjectionContextFn(sceneController.assistant, function() {
    return testInjectionContext;
  });

  return sceneController.assistant;
};

/**
 * Creates a scene Assistant with a controller and rendered scene, but doesn't set it up or activate it.
 * @param {String} sceneId
 * @param {Array} assistantArguments Arguments to pass to the assistant
 * @return {Object} The scene assistant that was created by Mojo.
 */
pockets.test.createSceneAssistantNoTemplate = function(sceneId, assistantArguments) {
  if (! Object.isArray(assistantArguments || [])) {
    throw new Error("expect array for assistant arguments");
  }

  var assistantHTML = "";
  var sceneArguments = {
    name: sceneId,
    disableSceneScroller: false
  };
  var stageController = pockets.stubStageController();
  var fakeSceneElement = pockets.test._createSceneDom(sceneId, assistantHTML);

  jasmine.getEnv().currentSpec.after(function() {
    pockets.test.ui.getTestWindow().document.body.innerHTML = '';
  });


  return new Mojo.Controller.SceneController(stageController, fakeSceneElement, sceneArguments, assistantArguments).assistant;
};

pockets.test.setSceneVisibility = function(sceneController, visible) {
  var targetElement;

  if (sceneController.sceneScroller) {
    targetElement = sceneController.sceneScroller;
  } else {
    targetElement = sceneController.sceneElement;
  }

  if (visible) {
    if (!targetElement.visible()) {
      targetElement.show();
    }
    sceneController.showWidgetContainer(targetElement);
  }

  if (!visible && targetElement.visible()) {
    sceneController.hideWidgetContainer(targetElement);
    targetElement.hide();
  }
};

pockets.ReportingBridge = function() {
  this.suiteInfo = [];
  this.specResults = {};
  this.suiteInfoReady = false;
  this.freshlyLaunched = true;
  this.finished = false;
};

pockets.ReportingBridge.prototype.transferSpecResults = function(specId) {
  var results = this.specResults[specId];
  if (results) delete this.specResults[specId];
  return results;
};

pockets.runTests = function(stageController) {
  stageController.pocketsDocumentPath = 'plugins/pockets/app/views';
  stageController.pushScene({
    name: 'test',
    sceneTemplate: '../../plugins/jasmine-webos/app/views/test/test-scene'
  });
};

pockets.test.getReportingBridge = function() {
  try {
    var scene = Mojo.Controller.getAppController().getActiveStageController().getScenes()[0];
    return scene.assistant.reportingBridge;
  } catch(e) {
    return null;
  }
};

pockets.explode = function() {
  throw "pockets.explode does not expect to be called";
};

pockets.getWidgetController = function(widgetDomElement) {
  return widgetDomElement._mojoController;
};

pockets.getWidget = function(widgetDomElement) {
  return pockets.getWidgetController(widgetDomElement).assistant;
};
