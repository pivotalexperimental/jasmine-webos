pockets.FakeSceneController = function(stageController, sceneElement, sceneArguments, remainingArguments) {
  this.stageController = stageController;
  this.sceneElement = sceneElement;
  this.scrollingEnabled = !sceneArguments.disableSceneScroller;
  if (this.scrollingEnabled) {
    this.sceneScroller = this.sceneElement.parentNode;
  }
  this.window = {};
};

pockets.FakeSceneController.prototype.get = function(id) {
  return this.sceneElement.querySelector('#' + id);
};

pockets.FakeSceneController.prototype.select = Mojo.Controller.SceneController.prototype.select;
pockets.FakeSceneController.prototype.listen = Mojo.Controller.SceneController.prototype.listen;
pockets.FakeSceneController.prototype.stopListening = Mojo.Controller.SceneController.prototype.stopListening;
pockets.FakeSceneController.prototype.getSceneScroller = Mojo.Controller.SceneController.prototype.getSceneScroller;

pockets.FakeSceneController.prototype.setupWidget = Mojo.doNothing;
pockets.FakeSceneController.prototype.serviceRequest = Mojo.doNothing;
pockets.FakeSceneController.prototype.modelChanged = Mojo.doNothing;
pockets.FakeSceneController.prototype.showDialog = Mojo.doNothing;
pockets.FakeSceneController.prototype.showBanner = Mojo.doNothing;
