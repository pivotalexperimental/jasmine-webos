describe("Mock Ajax", function() {
  var request, onSuccess, onFailure, onComplete;

  beforeEach(function() {
    onSuccess = jasmine.createSpy("onSuccess");
    onFailure = jasmine.createSpy("onFailure");
    onComplete = jasmine.createSpy("onComplete");
    request = new Ajax.Request("balthazarurl", {
      onSuccess: onSuccess,
      onFailure: onFailure,
      onComplete: onComplete
    });
  });

  it("should store URL and transport", function() {
    expect(request.url).toEqual("balthazarurl");
    expect(request.transport).toBeTruthy();
  });

  describe("AjaxRequests", function() {
    it("should attach new AJAX requests to AjaxRequests.requests", function() {
      expect(AjaxRequests.requests.length).toEqual(1);
      expect(AjaxRequests.activeRequest()).toEqual(request);

      var request2 = new Ajax.Request("balthazarurl2", {
        onSuccess: onSuccess,
        onFailure: onFailure,
        onComplete: onComplete
      });

      expect(AjaxRequests.requests.length).toEqual(2);
      expect(AjaxRequests.activeRequest()).toEqual(request2);
    });

    it("should let you clear AJAX requests", function() {
      AjaxRequests.clear();
      expect(AjaxRequests.requests.length).toEqual(0);
    });
  });

  describe(".response", function() {
    it("should pretend that the AJAX request returned a response with status, contentType, and responseText", function() {
      request.response({status: 201, contentType: "text/html", responseText: "You have been redirected."});
      expect(onSuccess).wasCalled();
      expect(onComplete).wasCalled();
      expect(onFailure).wasNotCalled();
      var response = onSuccess.mostRecentCall.args[0];
      expect(response.status).toEqual(201);
      expect(response.getHeader('Content-type')).toEqual("text/html");
      expect(response.responseText).toEqual("You have been redirected.");
      expect(response.responseJSON).toEqual(null);
    });

    it("should call failure for error statuses", function() {
      request.response({status: 500, contentType: "text/html", responseText: "Ar mateys."});
      expect(onSuccess).wasNotCalled();
      expect(onComplete).wasCalled();
      expect(onFailure).wasCalled();
      var response = onFailure.mostRecentCall.args[0];
      expect(response.status).toEqual(500);
      expect(response.getHeader('Content-type')).toEqual("text/html");
      expect(response.responseText).toEqual("Ar mateys.");
    });

    it("should present responseJSON if contentType is application/json", function() {
      request.response({status: 201, contentType: "application/json", responseText: "{'foo':'bar'}"});
      expect(onSuccess).wasCalled();
      var response = onSuccess.mostRecentCall.args[0];
      expect(response.getHeader('Content-type')).toEqual("application/json");
      expect(response.responseJSON).toEqual({foo: "bar"});
    });

    it("should default to status 200", function() {
      request.response({contentType: "text/html", responseText: "Yay!"});
      expect(onSuccess).wasCalled();
      expect(onComplete).wasCalled();
      var response = onSuccess.mostRecentCall.args[0];
      expect(response.status).toEqual(200);
    });

    it("should default to contentType application/json", function() {
      request.response({status: 200, responseText: "{'foo':'bar'}"});
      expect(onComplete).wasCalled();
      var response = onComplete.mostRecentCall.args[0];
      expect(response.getHeader('Content-type')).toEqual("application/json");
      expect(response.responseJSON).toEqual({foo: "bar"});
    });

    it("should convert null response status to status 0", function() {
      request.response({status: null, responseText: ""});
      expect(onSuccess).wasCalled();
      expect(onComplete).wasCalled();
      var response = onSuccess.mostRecentCall.args[0];
      expect(response.status).toEqual(0);
    });

    it("should accept a string", function() {
      request.response("{'foo': 'bar'}");
      expect(onSuccess).wasCalled();
      var response = onSuccess.mostRecentCall.args[0];
      expect(response.responseText).toEqual("{'foo': 'bar'}");
    });
  });
});
