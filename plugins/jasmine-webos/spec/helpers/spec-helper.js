if (typeof Mojo == 'undefined') {
  jasmine.webos.initTestMojo();
} else {
  beforeEach(function() {
    spyOn(Mojo.Event, 'listen').andCallThrough();
    spyOn(Mojo.Event, 'stopListening').andCallThrough();
    spyOn(Mojo.Log, 'error').andCallThrough();
    spyOn(Mojo, "Depot").andReturn(new jasmine.webos.FakeDepot());
  });
}
