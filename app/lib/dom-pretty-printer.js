pockets.DomPrettyPrinter = function() {
  jasmine.PrettyPrinter.call(this);
  this.dom = pockets.dom.create('div', {className: 'pretty-printed'});
  this.currentNode = this.dom;
};
jasmine.util.inherit(pockets.DomPrettyPrinter, jasmine.PrettyPrinter);

pockets.DomPrettyPrinter.prototype.append = function(node) {
  this.currentNode.appendChild(node);
  return node;
};

pockets.DomPrettyPrinter.prototype.emitString = function(value) {
  this.append(document.createTextNode("'" + value + "'"));
};

pockets.DomPrettyPrinter.prototype.emitScalar = function(value) {
  this.append(document.createTextNode(value));
};

pockets.DomPrettyPrinter.prototype.emitArray = function(array) {
  var table = this.append(pockets.dom.create('table', {className: 'array'},
    pockets.dom.create('tr', {},
      pockets.dom.create('th', {colSpan: 2}, 'Array[' + array.length + ']'))));

  var prevCurrentNode = this.currentNode;
  for (var i = 0; i < array.length; i++) {
    var valueTd;
    var tr = pockets.dom.create('tr', {},
      pockets.dom.create('td', {}, '' + i),
      valueTd = pockets.dom.create('td')
      );
    table.appendChild(tr);
    this.currentNode = valueTd;
    this.format(array[i]);
  }
  this.currentNode = prevCurrentNode;
};

pockets.DomPrettyPrinter.prototype.emitObject = function(obj) {
  var table = this.append(pockets.dom.create('table', {className: 'object'},
    pockets.dom.create('tr', {},
      pockets.dom.create('th', {colSpan: 2}, 'Object'))));

  var prevCurrentNode = this.currentNode;
  this.iterateObject(obj, function(property, isGetter) {
    var isOwnProperty = obj.hasOwnProperty(property);
    var valueTd;
    table.appendChild(pockets.dom.create('tr', {},
      pockets.dom.create('td', {className: 'key ' + (isOwnProperty ? 'own' : 'prototype')}, property),
      valueTd = pockets.dom.create('td')
      ));
    if (isGetter) {
      valueTd.appendChild(pockets.dom.create('span', {className: 'getter'}, '<getter>'));
    } else {
      this.currentNode = valueTd;
      this.format(obj[property]);
    }
  }.bind(this));
  this.currentNode = prevCurrentNode;
};

