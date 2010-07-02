if (Widgets === undefined) {
  var Widgets = {};
}

Widgets.ErrorListWidget = function (options, templatePath) {
  options.listTemplate = templatePath !== undefined ? templatePath + 'test/suite' : 'test/suite';
  options.itemTemplate = templatePath !== undefined ? templatePath + 'test/result' : 'test/result';

  Widgets.ResultListWidget.call(this, options);
};
Widgets.ErrorListWidget.inheritsFrom(Widgets.ResultListWidget);

Widgets.ErrorListWidget.prototype.addSpecResult = function(spec) {
  this.addItemToList(this.formatResult(spec));
};

Widgets.ErrorListWidget.prototype.show = function() {
  this.options.assistant.controller.sceneElement.querySelector("#"+this.options.widgetId).show();
};

Widgets.ErrorListWidget.prototype.hide = function() {
  this.options.assistant.controller.sceneElement.querySelector("#"+this.options.widgetId).hide();
};

Widgets.ErrorListWidget.prototype.formatResult = function(spec) {
  var results = spec.results();
  return {
    spec: spec,
    cssClass: results.passed() ? 'passed' : 'failed',
    specDescription: spec.getFullName()
  };
};
