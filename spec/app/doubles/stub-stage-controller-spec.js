if (window && window.PalmSystem && window.PalmSystem.version) {

  describe("jasmine.webos.StubStageController", function () {
    var stageController;
    beforeEach(function() {
      stageController = new jasmine.webos.StubStageController();
    });

    describe("should provide a simple stub for", function () {
      it("pushScene", function() {
        expect(stageController.pushScene).toBe(Mojo.doNothing);
      });

      it("swapScene", function() {
        expect(stageController.swapScene).toBe(Mojo.doNothing);
      });

      it("swapToRoot", function() {
        expect(stageController.swapToRoot).toBe(Mojo.doNothing);
      });
      it("popScene", function() {
        expect(stageController.popScene).toBe(Mojo.doNothing);
      });

    });

  });
}
