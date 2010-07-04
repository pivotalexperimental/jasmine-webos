// This suite is for testing rendering of spec results

xdescribe("This is a sample suite", function () {

  describe("with a nested suite", function () {
    it("with a failing spec", function() {
      expect(true).toBe(false);
    });

    it("and a passing spec", function() {
      expect(1).toEqual(1);
    });
  });

  it("with another failing spec with two expectations", function() {
    expect(false).toEqual(true);
    expect(false).toEqual(true);
  });

  it("with yet another failing spec with three expectations", function() {
    expect(1).toEqual(3.5);
    expect(14).toBeLessThan(2);
    expect(false).toEqual(false);
    expect({a: 1, b:2, c:3}).toEqual({a: 1, b: 2, d: 4});
  });
});
