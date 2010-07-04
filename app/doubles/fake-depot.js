if (!jasmine) {
  var jasmine = {
    webos: {}
  }
} else {
  if (!jasmine.webos) {
    jasmine.webos = {};
  }
}

jasmine.webos.FakeDepot = function(seedObject) {
  var values = {};
  var self = {};

  self.peek = function(key) {
    if (values.hasOwnProperty(key)) {
      return eval("(" + values[key] + ")");
    } else {
      return null;
    }
  };

  self.poke = function(key, value) {
    values[key] = Object.toJSON(value);
  };

  self.add = function() {
    var calls = [];

    var add_ = function(key, value, onSuccess, onFailure) {
      calls.unshift({ key: key, value: value, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(add_, calls, function(call) {
      self.poke(call.key, call.value);
      if (call.onSuccess) {
        call.onSuccess();
      }
    }, defaultFailure);

    return add_;
  }();

  self.get = function() {
    var calls = [];

    var get_ = function(key, onSuccess, onFailure) {
      calls.unshift({ key: key, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(get_, calls, function(call) {
      if (call.onSuccess) {
        call.onSuccess(self.peek(call.key));
      }
    }, defaultFailure);

    return get_;
  }();

  self.discard = function() {
    var calls = [];

    var discard_ = function(key, onSuccess, onFailure) {
      calls.unshift({ key: key, onSuccess: onSuccess, onFailure: onFailure });
    };
    addFakeAsynchronicity(discard_, calls, function(call) {
      delete values[call.key];
      if (call.onSuccess) {
        call.onSuccess();
      }
    }, defaultFailure);

    return discard_;
  }();

  seedDepot();
  return self;

  function seedDepot() {
    for (key in seedObject) {
      if (seedObject.hasOwnProperty(key)) {
        self.poke(key, seedObject[key]);
      }
    }
  }

  function addFakeAsynchronicity(func, calls, performSuccess, performFailure) {
    func.succeed = function() {
      performSuccess(calls.shift());
    };

    func.succeedAll = function() {
      calls.each(function(call) {
        performSuccess(call);
      });
      calls.clear();
    };

    func.fail = function() {
      performFailure(calls.shift());
    };

    func.failAll = function() {
      calls.each(function(call) {
        performFailure(call);
      });
      calls.clear();
    }
  }

  function defaultFailure(call) {
    if (call.onFailure) {
      call.onFailure();
    }
  }
};
