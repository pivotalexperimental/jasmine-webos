function loadFile(path) {
  var responseText = null;

  var request = new Ajax.Request(path, {
    method: 'get',
    asynchronous: false,
    evalJS: false,
    parameters: {"palmGetResource": true},
    onSuccess: function(response) {
      responseText = response.responseText;
    }
  });

  return responseText;
}