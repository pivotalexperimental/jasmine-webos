describe("pockets.FakeStageController", function () {
  var stageController;
  beforeEach(function() {
    stageController = new pockets.FakeStageController();
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