describe('ErrorListWidget', function () {
  var options;

  beforeEach(function() {
    options = {assistant: {controller: {get: Mojo.doNothing, setupWidget: Mojo.doNothing}}};
  });

  it('should call pockets.ui.listWidget constructor', function () {
    var testListWidget = new Widgets.ErrorListWidget(options);

    expect(testListWidget.options.listTemplate).toEqual('test/suite');
    expect(testListWidget.options.itemTemplate).toEqual('test/result');
  });

  it('should take an optional pocketsTemplatePath argument and append it to the item and list templates if defined', function () {
    var testListWidget = new Widgets.ErrorListWidget(options, '/foo/');

    expect(testListWidget.options.listTemplate).toEqual('/foo/test/suite');
    expect(testListWidget.options.itemTemplate).toEqual('/foo/test/result');
  });


  it('should have an addSpecResult method that calls formatResult and adds result text to listWidget', function () {
    var widget = new Widgets.ErrorListWidget(options);

    var result = new jasmine.NestedResults();
    var resultData = {
      matcherName: "fooMatcher",
      passed: false,
      message:"Failed."
    };
    result.addResult(new jasmine.ExpectationResult(resultData));
    result.description = "should bar";

    var spec = new jasmine.Spec({}, new jasmine.Suite({}, 'FooSuite', null, null), 'should bar');
    spec.results_ = result;

    this.spyOn(widget, 'addItemToList');

    widget.addSpecResult(spec);

    expect(widget.addItemToList).wasCalledWith({
      spec: spec,
      cssClass:'failed',
      specDescription:'FooSuite should bar.'
    });
  });


  it('should show ErrorList when show is called', function () {
    options.widgetId = 'error-list';
    var widget = new Widgets.ErrorListWidget(options);

    var stubErrorList = Mojo.View.convertToNode('<div id="error-list" x-mojo-element="List" style="display:none"></div>', document);
    options.assistant.controller.sceneElement = {querySelector: Mojo.doNothing};
    spyOn(options.assistant.controller.sceneElement, 'querySelector').andReturn(stubErrorList);

    widget.show();

    expect(options.assistant.controller.sceneElement.querySelector).wasCalled();
    expect(stubErrorList).toBeVisible();
  });

  it('should hide ErrorList when hide is called', function () {
    options.widgetId = 'error-list';
    var widget = new Widgets.ErrorListWidget(options);

    var stubErrorList = Mojo.View.convertToNode('<div id="error-list" x-mojo-element="List"></div>', document);
    options.assistant.controller.sceneElement = {querySelector: Mojo.doNothing};
    spyOn(options.assistant.controller.sceneElement, 'querySelector').andReturn(stubErrorList);

    widget.hide();

    expect(options.assistant.controller.sceneElement.querySelector).wasCalled();
    expect(stubErrorList).toNotBeVisible();
  });

  it('should format a passing spec result properly', function () {
    var widget = new Widgets.ErrorListWidget(options);

    var result = new jasmine.NestedResults();
    result.totalCount = 2;
    result.passedCount = 2;
    result.failedCount = 0;
    result.results_ = [{"passed": true, "message": "Passed."}, {"passed": true, "message": "Passed."}];
    result.description = "should totally foo";

    var spec = new jasmine.Spec({}, new jasmine.Suite({}, 'FooSuite', null, null), 'should totally foo');
    spec.results_ = result;

    var formattedResult = widget.formatResult(spec);

    expect(formattedResult.cssClass).toEqual('passed');
    expect(formattedResult.specDescription).toEqual('FooSuite should totally foo.');
  });

  it('should format a failing spec result properly', function () {
    var widget = new Widgets.ErrorListWidget(options);

    var result = new jasmine.NestedResults();
    var resultData = {
      matcherName: "fooMatcher",
      passed: false,
      message:"I have already been appropriately escaped in Jasmine"
    };
    result.addResult(new jasmine.ExpectationResult(resultData));
    result.description = "foo";

    var spec = new jasmine.Spec({}, new jasmine.Suite({}, 'FooSuite', null, null), 'foo');
    spec.results_ = result;

    var formattedResult = widget.formatResult(spec);

    expect(formattedResult.cssClass).toEqual('failed');
    expect(formattedResult.specDescription).toEqual('FooSuite foo.');
  });

});
