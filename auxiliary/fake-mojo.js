// fake out enough Mojo for Jasmine.webos to load
if (typeof Mojo == "undefined") {
  var Mojo = {
    doNothing: function() {}
  }
}
