describe('pockets.ui.ListWidget', function () {

  it('should call setupWidget with the appropriate arguments to setup a widget whose Element should already exist in the DOM', function() {
    var assistant = {controller: {} };
    assistant.controller.setupWidget = jasmine.createSpy('setupWidget');

    new pockets.ui.ListWidget({assistant: assistant, listTemplate: 'bar', itemTemplate: 'baz', widgetId: 'foo', title:'corge'});

    expect(assistant.controller.setupWidget).wasCalledWith('foo', {
      listTemplate: 'bar', itemTemplate: 'baz', onItemRendered: jasmine.any(Function)
    }, {items: [], listTitle:'corge'});
  });

  it('should, given a parent element, insert an element into that DOM, then call widgetSetup & instantiateChildWidgets with the appropriate parameters', function() {
    var assistant = {controller: {} };
    assistant.controller.setupWidget = jasmine.createSpy('setupWidget');
    assistant.controller.instantiateChildWidgets = jasmine.createSpy('instantiateChildWidgets');

    var sceneDOM = Mojo.View.convertToNode('<div id="main"><div id="parentElement"></div></div>', document);
    var parentElement = sceneDOM.querySelector('#parentElement');

    new pockets.ui.ListWidget({assistant: assistant,
      parentElement: parentElement,
      listTemplate: 'bar',
      itemTemplate: 'baz',
      widgetId: 'foo',
      title: 'corge'}
            );

    expect(assistant.controller.setupWidget).wasCalledWith('foo', {
      listTemplate: 'bar', itemTemplate: 'baz', onItemRendered: jasmine.any(Function)
    }, {
      items: [], listTitle:'corge'
    });
    expect(assistant.controller.instantiateChildWidgets).wasCalledWith(parentElement);

    var widgetHTML = sceneDOM.querySelector('#foo');
    expect(widgetHTML).toNotEqual(null);
  });


  it('should have a method updateModelWithFunction that takes a function, applies it to the model, and then calls modelChanged', function() {
    var assistant = {
      controller: {
        setupWidget: jasmine.createSpy('setupWidget'),
        instantiateChildWidgets: jasmine.createSpy('instantiateChildWidgets'),
        modelChanged: jasmine.createSpy('modelChanged')
      }
    };

    var widget = new pockets.ui.ListWidget({
      assistant: assistant,
      listTemplate: 'bar',
      itemTemplate: 'baz',
      widgetId: 'foo',
      title:'corge'
    });

    var updateFunc = function(model) {
      model.items[0] = 'foo';
    };

    widget.updateModelWithFunction(updateFunc);

    expect(assistant.controller.modelChanged).wasCalledWith({listTitle:'corge', items: ['foo']}, {controller: assistant.controller});

    assistant.controller.modelChanged.reset();

    var updateFunc2 = function(model) {
      model.items[0] = 'bar';
    };

    widget.updateModelWithFunction(updateFunc2);

    expect(assistant.controller.modelChanged).wasCalledWith({listTitle:'corge', items: ['bar']}, {controller: assistant.controller});
  });

  it('should have a method addItemToList that adds an item to the end of the list of the model items array', function() {
    runs(function () {
      var assistant = {
        controller: {
          setupWidget: jasmine.createSpy('setupWidget'),
          instantiateChildWidgets: jasmine.createSpy('instantiateChildWidgets'),
          modelChanged: jasmine.createSpy('modelChanged')
        }
      };

      var widget = new pockets.ui.ListWidget({
        assistant: assistant,
        listTemplate: 'bar',
        itemTemplate: 'baz',
        widgetId: 'foo',
        title:'corge'
      });

      widget.addItemToList('foo');
      expect(assistant.controller.modelChanged).wasCalled();

      widget.addItemToList('bar');
      expect(assistant.controller.modelChanged).wasCalled();
    });
  });


});

describe('pockets.runTests', function () {
  it('should run tests', function () {
    var stageController = {};
    stageController.pushScene = jasmine.createSpy();
    pockets.runTests(stageController);
    expect(stageController.pushScene).wasCalledWith({name:'test', sceneTemplate: '../../plugins/jasmine-webos/app/views/test/test-scene'});
  });
});

// TODO: likely aftercallbacks that's not correct, but we're changing/not using this function anyway
xdescribe('pockets.createSceneAssistant', function () {
  it('should clear out the test window DOM in between tests', function () {
    pockets.test.createSceneAssistant('pockets-test');
    var testWindow = pockets.test.ui.getTestWindow();
    expect(testWindow.document.body.innerHTML).toMatch('<div id="mojo-scene-pockets-test">');
    var cleanup = jasmine.getEnv().currentSpec.afterCallbacks[0];
    cleanup();

    expect(testWindow.document.body.innerHTML).toEqual('');
  });
});

// TODO: likely aftercallbacks that's not correct, but we're changing/not using this function anyway
xdescribe('pockets.createGenericAssistant', function () {
  it('should clear out the test window DOM in between tests', function () {
    pockets.test.createGenericAssistant();
    var testWindow = pockets.test.ui.getTestWindow();

    expect(testWindow.document.body.innerHTML).toMatch('<div id="mojo-scene-generic">');
    var cleanup = jasmine.getEnv().currentSpec.afterCallbacks[0];
    cleanup();

    expect(testWindow.document.body.innerHTML).toEqual('');
  });
});

describe("pockets.test.testFunctionEquality", function () {
  var env, TestClass, a, b;

  beforeEach(function() {
    env = new jasmine.Env();

    TestClass = function() {
    };
    TestClass.prototype.someMethod = function() {
    };
    TestClass.prototype.anotherMethod = function() {
    };
    a = new TestClass();
    b = new TestClass();
  });

  it("should return undefined if either a or b is not a function bound by pockets.test.bind", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            function() {
            },
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
            function() {
            },
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
    {},
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
    {},
            env, [], [])).toEqual(undefined);

    expect(pockets.test.testFunctionEquality(
            null,
            null,
            env, [], [])).toEqual(undefined);
  });


  it("should return true only for bound functions which are bound to the same object", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, b),
            env, [], [])).toEqual(false);
  });

  it("should return true only for bound functions which are bound to the same method", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a),
            pockets.test.bind.call(TestClass.prototype.anotherMethod, a),
            env, [], [])).toEqual(false);
  });

  it("should return true only for bound functions which have equivalent initial arguments", function() {
    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            env, [], [])).toEqual(true);

    expect(pockets.test.testFunctionEquality(
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 1, 2, 3),
            pockets.test.bind.call(TestClass.prototype.someMethod, a, 4, 5, 6),
            env, [], [])).toEqual(false);
  });
});

describe("pockets.test.createFakeSceneAssistant", function () {
  var origFn, FooAssistant;
  beforeEach(function() {
    FooAssistant = function() {
      this.args = $A(arguments);
    };

    FooAssistant.prototype.setup = function() {
    };

    origFn = window['FooAssistant'];
    window['FooAssistant'] = FooAssistant;
  });

  afterEach(function() {
    window['FooAssistant'] = origFn;
  });

  it("should instantiate an assistant with stageController stubs", function() {
    var assistant = pockets.test.createFakeSceneAssistant('foo');
    expect(assistant.controller.stageController.pushScene).toEqual(Mojo.doNothing);
    expect(assistant.controller.stageController.swapScene).toEqual(Mojo.doNothing);
  });

  it("should construct the correct scene assistant", function() {
    spyOn(FooAssistant.prototype, 'setup');
    var assistant = pockets.test.createFakeSceneAssistant('foo', 'bar', 'baz');
    expect(assistant.args).toEqual(['bar', 'baz']);
    assistant.setup();
    expect(FooAssistant.prototype.setup).wasCalled();
    window['FooAssistant'] = origFn;
  });


  it("should populate the sceneElement correctly", function() {
    spyOn(Mojo.View, 'render').andCallFake(function(renderArgs) {
      expect(renderArgs.template).toEqual('foo/foo-scene');
      return '<div id="element1" class="element">element1Text</div>' +
             '<div id="element2" class="element">element2Text</div>' +
             '</div>';
    });
    var assistant = pockets.test.createFakeSceneAssistant('foo');
    var element1 = assistant.controller.get('element1');
    expect(element1.hasClassName('element')).toBe(true);
    expect(element1.innerText).toEqual('element1Text');

    var element2 = assistant.controller.get('element2');
    expect(element2.hasClassName('element')).toBe(true);
    expect(element2.innerText).toEqual('element2Text');

    expect(assistant.controller.select('.element')).toEqual([element1, element2]);

    expect(assistant.controller.sceneElement.hasClassName('palm-scene')).toBe(true);
    expect(assistant.controller.sceneElement.hasClassName('foo-scene')).toBe(true);
    expect(assistant.controller.sceneElement.id).toEqual('mojo-scene-foo');
  });

  it("should be able to specify a sceneTemplate", function() {
    spyOn(Mojo.View, 'render').andCallFake(function(renderArgs) {
      expect(renderArgs.template).toEqual('some-template-path');
      return '<div></div>';
    });
    var assistant = pockets.test.createFakeSceneAssistant({name:'foo', sceneTemplate: 'some-template-path'});
  });


  it("should be able to specify a sceneName", function() {
    spyOn(Mojo.View, 'render').andCallFake(function(renderArgs) {
      expect(renderArgs.template).toEqual('foo/foo-scene');
      return '<div></div>';
    });
    var assistant = pockets.test.createFakeSceneAssistant({name:'foo'});
    expect(assistant.controller.sceneElement.hasClassName('foo-scene')).toBe(true);
    expect(assistant.controller.sceneElement.id).toEqual('mojo-scene-foo');
  });

  it("should be able to specify a sceneId", function() {
    spyOn(Mojo.View, 'render').andCallFake(function(renderArgs) {
      expect(renderArgs.template).toEqual('foo/foo-scene');
      return '<div></div>';
    });
    var assistant = pockets.test.createFakeSceneAssistant({name:'foo', id: 'bar'});
    expect(assistant.controller.sceneElement.hasClassName('foo-scene')).toBe(true);
    expect(assistant.controller.sceneElement.id).toEqual('bar');
  });

});
