describe('pockets matchers', function () {
  var env, mockSpec;
  beforeEach(function () {
    mockSpec = jasmine.createSpyObj('spec', ['addMatcherResult']);
    env = new jasmine.Env();
  });

  describe('toBeAWidgetOfType', function () {


    it('should return true if object has a _mojoController property and a matching x-mojo-element', function() {
      var widget = document.createElement('div');
      widget._mojoController = {};
      widget.setAttribute('x-mojo-element', 'List');
      var actual = new jasmine.Matchers(env, widget, mockSpec);
      expect(actual.toBeAWidgetOfType('List')).toEqual(true);
    });

    it('should return false if object has a _mojoController property and a different x-mojo-element', function() {
      var widget = document.createElement('div');
      widget._mojoController = {};
      widget.setAttribute('x-mojo-element', 'ToggleButton');

      var actual = new jasmine.Matchers(env, widget, mockSpec);
      expect(actual.toBeAWidgetOfType('List')).toEqual(false);
    });

    it('should return false if object does not have a _mojoController property', function() {
      var widget = document.createElement('div');
      widget.setAttribute('x-mojo-element', 'List');

      var actual = new jasmine.Matchers(env, widget, mockSpec);
      expect(actual.toBeAWidgetOfType('List')).toEqual(false);
    });
  });

  describe('toBeVisible', function() {

    it("should fail if actual is not an element", function() {
      var actual = new jasmine.Matchers(env, 'foo', mockSpec);
      expect(actual.toBeVisible()).toEqual(false);
    });

    it('should fail if actual element is not visible', function() {
      var invisibleElement = new Element('div');
      invisibleElement.hide();

      var actual = new jasmine.Matchers(env, invisibleElement, mockSpec);
      expect(actual.toBeVisible()).toEqual(false);
    });

    it("should fail if actual element's parent is not visible", function() {
      var visibleElement = new Element('div');
      var invisibleParent = new Element('div');
      invisibleParent.hide();
      invisibleParent.appendChild(visibleElement);

      var actual = new jasmine.Matchers(env, visibleElement, mockSpec);
      expect(actual.toBeVisible()).toEqual(false);
    });
  });

  describe('toNotBeVisible', function() {

    it("should fail if actual is not an element", function() {
      var actual = new jasmine.Matchers(env, 'foo', mockSpec);
      expect(actual.toNotBeVisible()).toEqual(false);
    });

    it('should fail if actual element is visible', function() {
      var visibleElement = new Element('div');

      var actual = new jasmine.Matchers(env, visibleElement, mockSpec);
      expect(actual.toNotBeVisible()).toEqual(false);
    });

    it("should pass if actual element is visible & any parent is not visible", function() {
      var visibleElement = new Element('div');
      var invisibleParent = new Element('div');
      invisibleParent.hide();
      invisibleParent.appendChild(visibleElement);

      var actual = new jasmine.Matchers(env, visibleElement, mockSpec);
      expect(actual.toNotBeVisible()).toEqual(true);
    });

  });


  describe("toHaveButtonLabel", function () {

    it("should fail if actual is not an Element", function() {
      var actual = new jasmine.Matchers(env, 'foo', mockSpec);
      expect(actual.toHaveButtonLabel("Hello")).toEqual(false);
    });

    it("should fail if the element is not a Mojo button", function() {
      var element = new Element('div');

      var actual = new jasmine.Matchers(env, element, mockSpec);
      expect(actual.toHaveButtonLabel("Hello")).toEqual(false);
    });

    it("should fail if the button was not setup yet", function() {
      var element = new Element('div');
      element.setAttribute("x-mojo-element", "Button");

      var actual = new jasmine.Matchers(env, element, mockSpec);
      expect(actual.toHaveButtonLabel("Hello")).toEqual(false);
    });

    it("should pass if the button text matches", function() {
      var textElement = new Element('div');
      textElement.innerHTML = "Hello";
      var element = new Element('div');
      element.setAttribute("x-mojo-element", "Button");
      spyOn(element, 'querySelector').andReturn(textElement);

      var actual = new jasmine.Matchers(env, element, mockSpec);
      expect(actual.toHaveButtonLabel("Hello")).toEqual(true);
    });

    it("should fail if the button text does not match", function() {
      var textElement = new Element('div');
      textElement.innerHTML = "Hello, Nurse!";
      var element = new Element('div');
      element.setAttribute("x-mojo-element", "Button");
      spyOn(element, 'querySelector').andReturn(textElement);

      var actual = new jasmine.Matchers(env, element, mockSpec);
      expect(actual.toHaveButtonLabel("Hello")).toEqual(false);
    });

  });
});
