if (!pockets.ui) {
  pockets.ui = {};
}

pockets.ui.htmlForElement = function(element) {
  return element.outerHTML;
};

pockets.ui.ListWidget = function(options) {
  this.model_ = {listTitle: options.title, items: []};
  this.options = options;

  if (options.parentElement) {
    options.parentElement.appendChild(new Element('div', {
      'id': options.widgetId,
      'x-mojo-element': "List"
    }));
  }

  options.assistant.controller.setupWidget(options.widgetId, {
    listTemplate: options.listTemplate,
    itemTemplate: options.itemTemplate,
    onItemRendered: this.onItemRendered.bind(this)
  }, this.model_);

  if (options.parentElement) {
    options.assistant.controller.instantiateChildWidgets(options.parentElement);
  }
};

pockets.ui.ListWidget.prototype.updateModelWithFunction = function(updateFunc) {
  updateFunc(this.model_);
  this.options.assistant.controller.modelChanged(this.model_, this.options.assistant);
};

pockets.ui.ListWidget.prototype.addItemToList = function(item) {
  this.updateModelWithFunction(function(list) {
    list.items.push(item);
  });
};

pockets.ui.ListWidget.prototype.onItemRendered = function(listWidget, itemModel, itemNode) {
};


