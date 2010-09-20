/* Test runner bootstrapping: swap in our own AppAssistant,
 * which will remove itself immediately and run tests if requested.
 * Note, if AppAssistant is not defined first, we define a basic one
 */
if (typeof Mojo != "undefined" && !window['AppAssistant']) {
  AppAssistant = function() {};
}
jasmine.webos.originalAppAssistant_ = window['AppAssistant'];
jasmine.webos.originalStageAssistant = window['StageAssistant'];
jasmine.webos.isTestingPockets_ = window['AppAssistant'] && AppAssistant.isPockets;

AppAssistant = function(appController) {
  console.error("=============> Jasmine webOS: Constructing Proxy App Assistant");
  var launchParameters = Mojo.getLaunchParameters();
  var runTests = launchParameters['runTests'];
  var reloadCSS = launchParameters['reloadCSS'];

  window['AppAssistant'] = jasmine.webos.originalAppAssistant_;
  var realAppAssistant = new jasmine.webos.originalAppAssistant_(appController);

  if (runTests) {
    Mojo.Log.info("====> Jasmine webOS: prepping to run specs");
    spyOn(Mojo, "Depot").andReturn(new jasmine.webos.FakeDepot());

    window['StageAssistant'] = function() {
      window['StageAssistant'] = jasmine.webos.originalStageAssistant;
    };

    StageAssistant.prototype.setup = function() {
      jasmine.webos.runTests(this.controller);
    };

    if (Mojo.appInfo.noWindow) {
      console.error("=============> Jasmine webOS: About to push scene for spec results");
      appController.createStageWithCallback({
        name: 'jasmine-webos-test-runner',
        assistantName: 'DefaultStageAssistant',
        lightweight: true
      }, function(stageController) {
        jasmine.webos.runTests(stageController);
      });
    }
  } else {
    var originalHandleLaunch = realAppAssistant.handleLaunch;
    realAppAssistant.handleLaunch = function(launchParams) {
      if (launchParams["reloadCss"]) {
        Mojo.Log.info("reloading css...");
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
          if (links[i].rel === "stylesheet") {
            if (links[i].href.indexOf("?") === -1) {
              links[i].href += "?";
            }
            links[i].href += "x";
          }
        }
        return;
      }
      if (originalHandleLaunch) {
        return originalHandleLaunch.apply(this, arguments);
      }
    };
  }

  return realAppAssistant;
};
