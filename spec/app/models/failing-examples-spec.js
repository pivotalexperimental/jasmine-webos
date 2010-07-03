describe("This is a sample suite", function () {

  describe("with a nested suite", function () {
    it("with a failing spec", function() {
      expect(true).toBe(false);
    });

    it("and a passing spec", function() {
      expect(1).toEqual(1);
    });
  });

  it("with another failing spec", function() {
    expect(false).toEqual(true);
  });
});
