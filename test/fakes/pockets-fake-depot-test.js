describe('pockets.FakeDepot', function() {
  var fakeDepot;
  var valueFromDepot;
  var callback;

  beforeEach(function() {
    fakeDepot = new pockets.FakeDepot();

    callback = function(obj) {
      valueFromDepot = obj;
    };
  });

  describe('should save a copy of the added value, not a reference', function() {
    it('for objects', function() {
      // for objects, should be a copy
      var objectValue = {isSame: false};
      fakeDepot.simpleAdd('key', objectValue);
      objectValue.isSame = true;
      fakeDepot.simpleGet('key', callback);
      expect(valueFromDepot.isSame).toEqual(false);
    });

    it('for arrays', function() {
      // for arrays, should be a copy
      var arrayValue = ['initial value'];
      fakeDepot.simpleAdd('key', arrayValue);
      arrayValue.push('additional value');
      fakeDepot.simpleGet('key', callback);
      expect(valueFromDepot).toEqual(['initial value']);
    });

    it('for arrays of objects', function() {
      // for arrays of objects, should be a deep copy
      var arrayValue = [{id: 1}, {id: 2}];
      fakeDepot.simpleAdd('key', arrayValue);
      arrayValue[0].id = 666;
      fakeDepot.simpleGet('key', callback);
      expect(valueFromDepot).toEqual([{id: 1}, {id: 2}]);
    });

  });

  it('should save the value for scalars', function() {
    // for scalars, should be the value
    fakeDepot.simpleAdd('key', 1);
    fakeDepot.simpleGet('key', callback);
    expect(valueFromDepot).toEqual(1);
  });

  it('should save null for null', function() {
    // for null, should be null
    fakeDepot.simpleAdd('key', null);
    fakeDepot.simpleGet('key', callback);
    expect(valueFromDepot === null).toEqual(true);
  });

  it('should return null for non-existent keys', function() {
    var fakeDepot = new pockets.FakeDepot();
    var valueFromDepot;
    var callback = function(obj) {
      valueFromDepot = obj;
    };

    fakeDepot.simpleGet('key', callback);
    expect(valueFromDepot).toBeNull();
  });

  it('should properly store nested objects', function() {
    var fakeDepot = new pockets.FakeDepot();
    var valueFromDepot;
    var callback = function(obj) {
      valueFromDepot = obj;
    };

    var nestedObj = {foo: {foo: [123]}};
    fakeDepot.simpleAdd('key', nestedObj);
    fakeDepot.simpleGet('key', callback);
    expect(valueFromDepot).toEqual(nestedObj);
  });

});
