if (window && window.PalmSystem && window.PalmSystem.version) {
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
