if (!pockets) {
  /**
   * @namespace
   */
  var pockets = {};
}

// @ignore
pockets.inTestRunner = function() {
  return false;
};

/**
 * It's a little Crockford to help with #inheritsFrom
 *  @ignore
 * @private
 */
pockets.inherit = function(childClass, parentClass) {
  var subclass = function() {
  };
  subclass.prototype = parentClass.prototype;
  childClass.prototype = new subclass;
};

pockets.launchedInTestMode = function() {
  var launchParameters = Mojo.getLaunchParameters();
  return (launchParameters['runTests'] !== undefined);
};

  /**
   * Sets the parent/child relationship between classes for applications that choose not to use
   * Prototype.js's Class.create() to define classes.
   *
   * Used after you declare the child class's constructor like this:
   *
   * in foo.js:
   *
   *   function Foo() { this.baz = 'quux';}
   *
   * in bar.js:
   *
   *   function Bar() { this.baz = 'corge';}
   *   Bar.inheritsFrom(Foo);
   *
   * @param parentClass
   */
  Function.prototype.inheritsFrom = function(parentClass) {
    pockets.inherit(this, parentClass);
  };

pockets.readFile = function(filePath) {
  var contents;
  contents = Mojo.View._renderNamedTemplate('../../' + filePath, {});
  if (contents.match(/template load failed/)) {
    throw new Error("couldn't read file " + Mojo.appPath + filePath);
  }
  return contents;
};

/**
 * @ignore
 * @private
 */
pockets.getVersionString = function () {
  return window.PalmSystem.version;
};

/**
 * Returns true if your application is currently running in Palm Host
 */
pockets.inPalmHost = function() {
  return !!pockets.getVersionString().match('mojo-host');
};

/**
 * Returns true if your application is currently running in the emulator
 */
pockets.inEmulator = function() {
  return !!pockets.getVersionString().match('desktop');
};

/**
 * Returns true if your application is currently running on device
 */
pockets.inDevice = function() {
  return !!pockets.getVersionString().match('device');
};
