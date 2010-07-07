/* Make jasmine consider bound functions */

jasmine.webos.bind = function() {
  if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
  var boundFn = function() {
    return boundFn.method.apply(boundFn.object, boundFn.args.concat($A(arguments)));
  };
  boundFn.method = this;
  boundFn.args = $A(arguments);
  boundFn.object = boundFn.args.shift();
  boundFn["__isJasmineWebOsBoundFn__"] = true;
  return boundFn;
};

jasmine.webos.testFunctionEquality = function(a, b, env, mismatchKeys, mismatchValues) {
  if (typeof a === "function" && typeof b === "function" && a["__isJasmineWebOsBoundFn__"] && b["__isJasmineWebOsBoundFn__"]) {
    if (a.object !== b.object) {
      mismatchValues.push("'this' object of bound functions didn't match");
      return false;
    }
    if (a.method !== b.method) {
      mismatchValues.push("method of bound functions didn't match");
      return false;
    }
    return env.equals_(a.args, b.args, mismatchKeys, mismatchValues);
  }
  return undefined;
};

Function.prototype.bind = jasmine.webos.bind;
jasmine.getEnv().addEqualityTester(jasmine.webos.testFunctionEquality);

