function FakeView() {
  var additionalMethods = arguments && arguments[0];
  var methodsToStub = ['pushScene'];
  methodsToStub.push.apply(methodsToStub, additionalMethods);

  return  jasmine.createSpyObj('FakeView', methodsToStub);
}
