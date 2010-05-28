pockets.experimental = {};

pockets.experimental.trace = function() {
  var callstack = [];
  var currentFunction = arguments.callee.caller;
  while (currentFunction) {
    var fn = currentFunction.toString();
    var fname = currentFunction['__name__'] || fn.substring(fn.indexOf("function") + 8, fn.indexOf("(")).replace(/ +/, '') || "anonymous";
    callstack.push(fname);
    currentFunction = currentFunction.caller;
  }
  return callstack;
};

pockets.experimental.addNames = function(root, prefix, depth) {
  if (depth === undefined) depth = 0;
  if (depth > 3) return;

  prefix = prefix || '';
  for (var property in root) {
    var o = root[property];
    if (!o || o === window.document || o === window || o.__name__ || o['__beenHereBefore__']) continue;

    o['__beenHereBefore__'] = true;
    pockets.experimental.addNames(o, prefix + property + '.', depth + 1);
    delete o['__beenHereBefore__'];

    if (typeof o == 'function') {
      o.__name__ = prefix + property;
    }
  }
};

pockets.experimental.info = function() {
  pockets.experimental._log.apply(pockets, ["info"].concat($A(arguments)));
};

pockets.experimental.error = function() {
  pockets.experimental._log.apply(pockets, ["error"].concat($A(arguments)));
};

/** crashes the emulator!!!! :( */
pockets.experimental._log = function(level, varargs) {
  if (!pockets.inPalmHost() && Mojo.Log[level]) {
    var objectsToJsonify = [];
    var message = "";
    for (var i = 1; i < arguments.length; i++) {
      if (i > 1) message += ", ";
      if (typeof arguments[i] === "object") {
        message += "%j";
        objectsToJsonify.push(arguments[i]);
      } else {
        message += arguments[i];
      }
    }
    Mojo.Log[level].apply(Mojo.Log, [message].concat(objectsToJsonify));
  } else if (console && console[level]) {
    console[level].apply(console, $A(arguments).slice(1));
  }
};
