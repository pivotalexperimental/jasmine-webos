describe('TestListWidget ', function () {
  var options;

  var getMockSpec = function(results) {
    return  { results: function() { return results; } };
  };

  beforeEach(function() {
    options = {assistant: {controller: {setupWidget: Mojo.doNothing}}};

  });

  it('should call pockets.ui.ListWidget in its constructor', function() {
    var testListWidget = new Widgets.TestListWidget(options);

    expect(testListWidget.options.listTemplate).toEqual('test/suite');
    expect(testListWidget.options.itemTemplate).toEqual('test/result');
  });

  it('should take an optional pocketsTemplatePath argument and append it to the item and list templates if defined', function () {
    var testListWidget = new Widgets.TestListWidget(options, '/foo/');

    expect(testListWidget.options.listTemplate).toEqual('/foo/test/suite');
    expect(testListWidget.options.itemTemplate).toEqual('/foo/test/result');
  });

  it('should have an addSpecResult method that calls formatResult and adds result text to listWidget', function () {
    var widget = new Widgets.TestListWidget(options);

    var results = pockets.test.Mom.failedResult();

    this.spyOn(widget, 'addItemToList');

    var mockSpec = getMockSpec(results);
    widget.addSpecResult(mockSpec);

    expect(widget.addItemToList).wasCalledWith({
      spec: mockSpec,
      cssClass:'failed',
      specDescription:'should bar'
    });
  });

  it('should format a passing spec result properly', function () {
    var widget = new Widgets.TestListWidget(options);

    var results = new jasmine.NestedResults();
    results.totalCount = 2;
    results.passedCount = 2;
    results.results = [{"passed": true, "message": "Passed."}, {"passed": true, "message": "Passed."}];
    results.description = "foo";

    var mockSpec = getMockSpec(results);
    var formattedResult = widget.formatResult(mockSpec);

    expect(formattedResult.cssClass).toEqual('passed');
    expect(formattedResult.specDescription).toEqual('foo');
  });

  it('should format a failing spec result properly', function () {
    var widget = new Widgets.TestListWidget(options);

    var results = pockets.test.Mom.failedResult();
    var mockSpec = getMockSpec(results);
    var formattedResult = widget.formatResult(mockSpec);

    expect(formattedResult.cssClass).toEqual('failed');
    expect(formattedResult.specDescription).toEqual('should bar');
  });

});
