describe('TestProgressWidget ', function () {
  var assistant;

  beforeEach(function() {
    assistant = {
      controller: {
        setupWidget: jasmine.createSpy('setupWidget'),
        modelChanged: jasmine.createSpy('modelChanged')
      }
    };

  });

  it('should have a constructor that calls Mojo\'s setupWidget', function() {
    Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value: 0.0,
        title: 'Running Specs...',
        icon: 'cannot be blank'
      },
      widgetId: 'progress'
    });

    expect(assistant.controller.setupWidget).wasCalledWith('progress',
      {
        cancellable: false
      },
      {
        value: 0.0,
        title: 'Running Specs...',
        icon: 'cannot be blank'
      });
  });

  it('should have an increment method that increments progress', function() {
    var widget = Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value: 0.0,
        title: 'Running Specs...',
        icon:'cannot be blank'
      },
      widgetId: 'progress',
      increment: 0.2
    });

    widget.increment();

    expect(assistant.controller.modelChanged).wasCalledWith({value: 0.2, title: 'Running Specs...', icon:'cannot be blank'}, {controller: assistant.controller});
  });

  it('should set the title & icon correctly when all specs pass.', function() {
    var widget = Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value:0.0,
        title: "should change",
        icon:'cannot be blank'
      },
      widgetId: 'progress',
      increment: 0.2
    });

    var passingSpecRun = new jasmine.NestedResults();
    passingSpecRun.totalCount = 4;
    passingSpecRun.passedCount = 4;
    passingSpecRun.failedCount = 0;

    widget.finishedWith(passingSpecRun);

    expect(assistant.controller.modelChanged).wasCalledWith({value:0.0, title: "All 4 Expectations Passed", icon:'cannot be blank'}, {controller: assistant.controller});
  });

  it('should set the title & icon correctly when there is one failing spec.', function() {
    var widget = Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value:0.0,
        title: "should change",
        icon:'cannot be blank'
      },
      widgetId: 'progress',
      increment: 0.2
    });

    var failingSpecRun = new jasmine.NestedResults();
    failingSpecRun.totalCount = 4;
    failingSpecRun.passedCount = 3;
    failingSpecRun.failedCount = 1;

    widget.finishedWith(failingSpecRun);

    expect(assistant.controller.modelChanged).wasCalledWith({value:0.0, title: "1 of 4 Expectations Failed", icon:'cannot be blank'}, {controller: assistant.controller});
  });

  it('should change the proper CSS classes when displayRedProgressPill is called', function() {
    var progressPillElement = Mojo.View.convertToNode('<div id="progress" x-mojo-element="ProgressPill"><div class="download-pill-background"></div></div>', document);
    var widget = Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value:0.0,
        title: "should change",
        icon:'cannot be blank'
      },
      widgetId: 'progress',
      increment: 0.2
    });

    assistant.controller.get = Mojo.doNothing;
    spyOn(assistant.controller,'get').andReturn(progressPillElement);

    widget.displayOnFail();

    expect(assistant.controller.get).wasCalledWith('progress');

    var fileDownloadProgressClass = progressPillElement.querySelector('.download-pill-background').className;
    
    expect(fileDownloadProgressClass).toMatch(/fail/);
  });

  it('should not attempt to add a fail class to the progress bar more than once', function() {
    var progressPillElement = Mojo.View.convertToNode('<div id="progress" x-mojo-element="ProgressPill"><div class="download-pill-background"></div></div>', document);

    var widget = Widgets.testProgressWidget({
      assistant: assistant,
      model: {
        value:0.0,
        title: "should change",
        icon:'cannot be blank'
      },
      widgetId: 'progress',
      increment: 0.2
    });

    assistant.controller.get = Mojo.doNothing;
    spyOn(assistant.controller,'get').andReturn(progressPillElement);

    widget.displayOnFail();
    widget.displayOnFail();

    expect(assistant.controller.get).wasCalled();

    var fileDownloadProgressClass = progressPillElement.querySelector('.download-pill-background').className;
    expect(fileDownloadProgressClass).toMatch('fail');
    expect(fileDownloadProgressClass).toNotMatch('fail fail');
  });

});
