pockets.test.ui = {};

pockets.test.ui.getTestWindow = function() {
  return pockets.test.testWindow;
};

/**
 * @return {Node} DOM element representing an item of a ListSelector (aka popup menu)
 * @param {String} itemValue the model value of the item you want to select
 */
pockets.test.ui.getListSelectorItemElement = function(itemValue) {
  return pockets.test.ui.getTestWindow().document.body.querySelector(".palm-popup-content .palm-row[x-mojo-menu-cmd='" + itemValue + "']");
};

pockets.test.ui.chooseListSelectorItem = function(listSelectorId, selectionValue) {
  var listSelectorEl = pockets.test.ui.getTestWindow().document.getElementById(listSelectorId);
  if (!listSelectorEl) {
    throw 'element with id ' + listSelectorId + ' is not present in the current scene';
  }
  Mojo.Event.send(listSelectorEl, Mojo.Event.tap);
  pockets.test.ui.selectPopupItemFromOpenMenu(selectionValue, "list " + listSelectorId);
};

pockets.test.ui.selectPopupItemFromOpenMenu = function(selectionValue, listDescription) {
  var selectionEl = pockets.test.ui.getListSelectorItemElement(selectionValue);
  if (!selectionEl) {
    throw '"' + selectionValue + '" is not a valid selection for ' + listDescription;
  }
  Mojo.Event.send(selectionEl, Mojo.Event.tap);
};

pockets.test.ui.hasListSelectorItem = function(listSelectorId, selectionValue) {
  var listSelectorEl = pockets.test.ui.getTestWindow().$(listSelectorId);
  if (!listSelectorEl) {
    throw 'element with id ' + listSelectorId + ' is not present in the current scene';
  }
  Mojo.Event.send(listSelectorEl, Mojo.Event.tap);
  var selectionEl = pockets.test.ui.getListSelectorItemElement(selectionValue);
  return (!!selectionEl);
};

pockets.test.ui.chooseIntegerPickerItem = function(integerPickerId, itemValue) {
  //TODO - Ideally, choose item should use DOM events, not object methods. Some behavior may not get fired 
  var testWindow = pockets.test.ui.getTestWindow();
  testWindow.$(integerPickerId)._mojoController.assistant.strategy._choose(itemValue);
};

pockets.test.ui.sendMenuCommand = function(assistant, command) {
  assistant.handleCommand(Mojo.Event.make(Mojo.Event.command, {
    command: command,
    originalEvent: null
  }));
};

/**
 * @param {Object} assistant the assistant which should handle the menu click
 * @param {Object} matcher if a String, the contents of the 'command' property for the button.  If a function, this function is used
 *                 to match the button.
 */
pockets.test.ui.clickMenuButton = function(assistant, matcher) {
  var matchingButtons = pockets.test.ui.getTestWindow().$$(".palm-menu-button");
  var matchingTexts = pockets.test.ui.getTestWindow().$$(".palm-menu-text");
  var matching = matchingButtons.concat(matchingTexts);

  for (var i = 0; i < matching.length; i++) {
    var model = matching[i]._mojoMenuItemModel;
    if (typeof matcher == "string") {
      if (model.command == matcher) {
        pockets.test.ui.sendMenuCommand(assistant, model.command);
        return;
      }
    }
    if (typeof matcher == "function") {
      if (matcher(model)) {
        pockets.test.ui.sendMenuCommand(assistant, model.command);
        return;
      }
    }
  }
  throw new Error("Did not find a match in menu items");
};

/**
 * @param {Object} assistant the assistant which should handle the menu click
 * @param {String} commandName the contents of the 'name' property which you have to add to the command menu item model
 */
pockets.test.ui.clickAppMenuButton = function(assistant, commandName) {
  try {
    assistant.controller._menu.assistant.controller.stageController.sendEventToCommanders = Mojo.doNothing;
    assistant.controller._menu.assistant.showAppMenu();
  }
  catch (e) {
    throw 'A custom appMenu has not been defined';
  }
  var appModel = assistant.controller._menu.assistant.appModel;

  for (var i = 0; i < appModel.items.length; i++) {
    var model = appModel.items[i];
    if (model.items) {
      for (var j = 0; j < model.items.length; j++) {
        if (model.items[j].command === commandName) {
          pockets.test.ui.sendMenuCommand(assistant, model.items[j].command);
          return;
        }
      }
    } else {
      if (model.command === commandName) {
        pockets.test.ui.sendMenuCommand(assistant, model.command);
        return;
      }
    }
  }
  throw new Error("Did not find a '" + commandName + "' app menu item");
};


/**
 * @param {Object} controller the controller which contains the button widget
 * @param {String} buttonId the DOM Id of the button which you want to click
 */
pockets.test.ui.tapButton = function(controller, buttonId) {
  var buttonEl = controller.get(buttonId);
  Mojo.Event.send(buttonEl, Mojo.Event.tap);
};

pockets.test.ui.FakeController = function() {
  this.elements = {};
};

pockets.test.ui.FakeController.prototype.get = function(id) {
  return this.elements[id] || (this.elements[id] = pockets.dom.create('div', {
    id: id
  }));
};

pockets.test.ui.FakeController.prototype.setupWidget = function(id, attributes, model) {
  var widgetEl = this.get(id);
  widgetEl.widgetSetup = {
    attributes: attributes,
    model: model
  };
};

pockets.test.ui.FakeController.prototype.showDialog = Mojo.doNothing;

