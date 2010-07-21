if (! (jasmine && jasmine.webos) ) {
  /**
   * @namespace
   */
  jasmine.webos = {};
}

jasmine.webos.launchedInTestMode = function() {
  var launchParameters = Mojo.getLaunchParameters();
  return (launchParameters['runTests'] !== undefined);
};

jasmine.webos.readFile = function(filePath) {
  if (!jasmine.webos.getPalmVersionString()) {
    throw new Error("Jasmine webOS cannot read files when running in a browser");
  }

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
jasmine.webos.getPalmVersionString = function () {
  return window.PalmSystem && window.PalmSystem.version;
};

/**
 * Returns true if your application is currently running in the emulator
 */
jasmine.webos.inEmulator = function() {
  return !!jasmine.webos.getPalmVersionString().match('desktop');
};

/**
 * Returns true if your application is currently running on device
 */
jasmine.webos.inDevice = function() {
  return !!jasmine.webos.getPalmVersionString().match('device');
};

jasmine.webos.runTests = function(stageController) {
  stageController.pushScene({
    name: 'test',
    sceneTemplate: '../../plugins/jasmine-webos/app/views/test/test-scene'
  });
};

jasmine.webos.explode = function() {
  throw "jasmine.webos.explode does not expect to be called";
};

jasmine.webos.versionString = function() {
  return 'Jasmine webOS ' +
      jasmine.webos.version.major + '.' +
      jasmine.webos.version.minor + '.' +
      jasmine.webos.version.build +
      ' v.' +
      jasmine.webos.version.revision;
};
