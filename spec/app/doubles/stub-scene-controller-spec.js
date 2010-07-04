// Only include this suite if running on the emulator
if (window && window.PalmSystem && window.PalmSystem.version) {
  describe("jasmine.webos.StubSceneController", function () {
    var sceneElement, controller;

    beforeEach(function() {
      var html = '<div>' +
                 '<div id="sceneId">' +
                 '<div id="first" class="elementClass"></div>' +
                 '<div class="elementClass"></div>' +
                 '</div>' +
                 '</div>';
      sceneElement = Mojo.View.convertToNode(html, document);
      controller = new jasmine.webos.StubSceneController({}, sceneElement, {});
    });

    describe("#get", function () {
      it("should return the correct node", function() {
        expect(controller.get('sceneId')).toEqual(sceneElement.querySelector('#sceneId'));
      });

      it("should return null if the node is not found", function() {
        expect(controller.get('someOtherId')).toBeNull();
      });
    });

    describe("#select", function () {
      it("should return the correct nodes", function() {
        expect(controller.select('.elementClass')).toEqual($A(sceneElement.querySelectorAll('.elementClass')));
      });

      it("should return null if the node is not found", function() {
        expect(controller.select('.someOtherElementClass')).toEqual([]);
      });
    });

    describe("listening", function () {
      var eventSpy, first;

      beforeEach(function() {
        eventSpy = jasmine.createSpy('eventSpy');
        first = controller.get('first');
        controller.listen(first, Mojo.Event.tap, eventSpy);
      });

      it("should be able to start listening", function() {
        Mojo.Event.send(first, Mojo.Event.tap);
        expect(eventSpy).wasCalled();
      });

      it("should be able to stop listening", function() {
        controller.stopListening(first, Mojo.Event.tap, eventSpy);
        Mojo.Event.send(first, Mojo.Event.tap);
        expect(eventSpy).wasNotCalled();
      });
    });

    describe("getSceneScroller", function () {
      var scroller;

      beforeEach(function() {
        var scrollerHtml = '<div></div>';
        scroller = Mojo.View.convertToNode(scrollerHtml, document);
        scroller.appendChild(sceneElement);
      });

      it("should be the parentNode by default", function() {
        controller = new jasmine.webos.StubSceneController({}, sceneElement, {});
        expect(controller.getSceneScroller()).toEqual(scroller);
      });

      it("should be undefined if disableSceneScroller is set", function() {
        controller = new jasmine.webos.StubSceneController({}, sceneElement, {disableSceneScroller: true});
        expect(controller.getSceneScroller()).toBe(undefined);
      });
    });

    describe("should provide a simple stub for", function () {

      it("setupWidget", function() {
        expect(controller.setupWidget).toBe(Mojo.doNothing);
      });

      it("serviceRequest", function() {
        expect(controller.serviceRequest).toBe(Mojo.doNothing);
      });

      it("modelChanged", function() {
        expect(controller.modelChanged).toBe(Mojo.doNothing);
      });

      it("showDialog", function() {
        expect(controller.showDialog).toBe(Mojo.doNothing);
      });

      it("showBanner", function() {
        expect(controller.showBanner).toBe(Mojo.doNothing);
      });
    });
  });
}
