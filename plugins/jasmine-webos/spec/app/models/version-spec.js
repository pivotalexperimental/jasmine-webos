describe("Jasmine webOS Version", function () {
  beforeEach(function() {
    jasmine.webos.version = {
      major: 1,
      minor: 2,
      build: 3,
      revision: 4567890
    }
  });

  it("#versionString should return the correct version string", function() {
    expect(jasmine.webos.versionString()).toEqual('Jasmine webOS 1.2.3 v.4567890');
  });
});
