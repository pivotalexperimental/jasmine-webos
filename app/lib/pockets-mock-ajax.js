Ajax.Request.prototype.response = function(responseOptions) {
  this.transport.readyState = 4;
  if (typeof(responseOptions) == "string") {
    responseOptions = {responseText: responseOptions};
  }

  this.transport.responseHeaders = responseOptions.responseHeaders ||
                                   {"Content-type": responseOptions.contentType || Ajax.Response.defaultContentType};
  this.transport.status = typeof(responseOptions.status) == "undefined" ? 200 : responseOptions.status;
  this.transport.responseText = responseOptions.responseText;
  this.transport.onreadystatechange();
};

Ajax.Response.defaultContentType = "application/json";

if (pockets.inPalmHost()) {
  Ajax.Request.prototype.oldRequest = Ajax.Request.prototype.normalRequest;
} else {
  Ajax.Request.prototype.oldRequest = Ajax.Request.prototype.request;
}

Ajax.Request.prototype.request = function(url) {
  this.oldRequest(url);
  AjaxRequests.requests.push(this);
};


Ajax.RealRequest = Class.create(Ajax.Request, {
  request: function(url) {
    this.transport = Try.these(
            function() {
              return new XMLHttpRequest()
            },
            function() {
              return new ActiveXObject('Msxml2.XMLHTTP')
            },
            function() {
              return new ActiveXObject('Microsoft.XMLHTTP')
            }
            ) || false;
    this.oldRequest(url);
  }
});

AjaxRequests = {
  requests: [],
  clear: function() {
    this.requests.clear();
  },
  activeRequest: function() {
    if (this.requests.length > 0) {
      return this.requests[this.requests.length - 1];
    } else {
      return null;
    }
  }
};

FakeAjaxTransport = Class.create({
  initialize: function() {
    this.overrideMimeType = false;
    this.readyState = 0;
  },
  open: Mojo.doNothing,
  send: Mojo.doNothing,
  setRequestHeader: jasmine.createSpy(),
  getResponseHeader: function(name) {
    return this.responseHeaders[name];
  }
});

if (pockets.inPalmHost()) {
  /** Replace this method to bypass our Ajax.Request mock */
  window.palmGetResource = function(pathToResource) {
    var uri = pathToResource;
    var responseText = null;
    var request = new Ajax.RealRequest(uri, {
      method: 'get',
      asynchronous: false,
      evalJS: false,
      parameters: {"palmGetResource": true},
      onSuccess: function(transport) {
        responseText = transport.responseText;
      }
    });
    return responseText;
  };
}

beforeEach(function() {
  AjaxRequests.requests.clear();
  spyOn(Ajax, "getTransport").andCallFake(function() {
    return new FakeAjaxTransport();
  });
});
