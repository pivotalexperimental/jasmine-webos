function FirstAssistant() {
}

FirstAssistant.prototype.setup = function() {
  this.controller.sceneElement.querySelector('.jasmine-webos-info').innerHTML = jasmine.webos.versionString();
};

FirstAssistant.prototype.activate = function(event) {
};

FirstAssistant.prototype.deactivate = function(event) {
};

FirstAssistant.prototype.cleanup = function(event) {
};
