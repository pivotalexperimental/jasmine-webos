if (Widgets === undefined) {
  var Widgets = {};
};

Widgets.testProgressWidget = function (options) {
  var passed = true;

  var that = {
    increment: function() {
      options.model.value += options.increment;
      options.assistant.controller.modelChanged(options.model, options.assistant);
    },

    finishedWith: function(results) {
      if (results.passed()) {
        options.model.title = 'All ' + results.passedCount + ' Expectations Passed';
      } else {
        options.model.title = results.failedCount + ' of ' + results.totalCount + ' Expectations Failed';
      }
      options.assistant.controller.modelChanged(options.model, options.assistant);
    },

    displayOnFail: function () {
      if (passed) {
        passed = false;
        options.assistant.controller.get(options.widgetId).querySelector('.download-pill-background').className += ' fail';
      }
    }
  };

  options.assistant.controller.setupWidget(options.widgetId, {cancellable: false}, options.model);
  return that;
};

