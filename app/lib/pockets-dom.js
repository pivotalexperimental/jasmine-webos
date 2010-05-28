/**
 * @namespace
 */
pockets.dom = {};

/**
 * Prune all children from a DOM element
 * @param {Element} parent node from which you wish to remove all children
 */
pockets.dom.removeChildren = function(node) {
  var child;
  while ((child = node.firstChild)) {
    node.removeChild(child);
  }
};

/**
 * Creates a DOM node as specified.
 *
 * @param {String} type Element's type. e.g. 'div'
 * @param {Object} attrs Element's attributes.  Use 'cssClass' instead of 'class'.
 * @param {String|Object} childrenVarArgs Children to append to the created node.
 * @return {Element}
 */
pockets.dom.create = function(type, attrs, childrenVarArgs) {
  var el = document.createElement(type);

  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];

    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }

  for (var attr in attrs) {
    if (attr == 'cssClass') {
      el.setAttribute('class', attrs[attr]);
    } else {
      if (attr.indexOf('x-') == 0) {
        el.setAttribute(attr, attrs[attr]);
      } else {
        el[attr] = attrs[attr];
      }
    }
  }

  return el;
};

/**
 * Escape a string to make it HTML safe.
 * NOTE: not fully implemented yet
 *
 * @param {String} str to be escaped
 * @returns {String} HTML-escaped string
 */
pockets.dom.htmlEscape = function(str) {
  if (!str) return str;
  return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
};
