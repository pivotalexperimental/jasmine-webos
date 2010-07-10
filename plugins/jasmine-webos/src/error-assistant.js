function ErrorAssistant(specResult) {
  this.specResult = specResult;
}

ErrorAssistant.prototype.setup = function() {
  this.setUpExpectationList();
};

ErrorAssistant.prototype.setUpExpectationList = function() {
  var listAttributes = {
    listTemplate: '../../plugins/jasmine-webos/app/views/error/spec-result',
    itemTemplate: '../../plugins/jasmine-webos/app/views/error/failed-expectation',
    itemsProperty: 'expectations'
  };
  this.controller.setupWidget(
    'spec-result',
    listAttributes,
    this.specResult);
};
