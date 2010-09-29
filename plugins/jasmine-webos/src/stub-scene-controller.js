if (jasmine.webos.inDevice() || jasmine.webos.inEmulator()) {
  jasmine.webos.StubSceneController = function(stageController, sceneElement, sceneArguments, remainingArguments) {
    this.stageController = stageController;
    this.sceneElement = sceneElement;
    this.scrollingEnabled = !sceneArguments.disableSceneScroller;
    if (this.scrollingEnabled) {
      this.sceneScroller = this.sceneElement.parentNode;
    }
    this.window = {};
    this.document = document;
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
  jasmine.webos.StubSceneController.prototype.popupSubmenu = Mojo.doNothing;
  jasmine.webos.StubSceneController.prototype.setInitialFocusedElement = Mojo.doNothing;

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
}  