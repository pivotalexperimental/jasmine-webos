pockets.FakeDepot = function() {
  this.values = {};
};

pockets.FakeDepot.prototype.add = function(key, value, onSuccess, onFailure) {
  this.values[key] = Object.toJSON(value);
  if (onSuccess) {
    onSuccess();
  }
};

pockets.FakeDepot.prototype.simpleAdd = pockets.FakeDepot.prototype.add;

pockets.FakeDepot.prototype.get = function(key, onSuccess, onFailure) {
  onSuccess(this._internalGet(key));
};

pockets.FakeDepot.prototype.simpleGet = pockets.FakeDepot.prototype.get;

pockets.FakeDepot.prototype._internalGet = function(key) {
  return this.values[key] ? eval('(' + this.values[key] + ')') : null;
};
