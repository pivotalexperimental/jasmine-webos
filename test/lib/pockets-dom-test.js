describe('pockets.dom', function() {
  it('removeChildren should remove all child nodes of an element', function() {
    var div = document.createElement('div');
    div.innerHTML = 'a<b>c</b>d';
    expect(div.childNodes.length).toEqual(3);
    pockets.dom.removeChildren(div);
    expect(div.childNodes.length).toEqual(0);
  });

  it('create should create a new node with the given type, attributes, and children; string children are added as text, *not* html', function() {
    var expectedString;
    if (pockets.inPalmHost()) {
      expectedString = '<span id="the-id">1 &lt; 2 &lt;g&gt;</span>';
    } else {
      expectedString = '<span id="the-id">1 &lt; 2 &lt;g></span>';
    }
    expect(pockets.ui.htmlForElement(pockets.dom.create('span', {id: 'the-id'}, '1 < 2 <g>'))).toEqual(expectedString);

    var div = pockets.dom.create('div', {cssClass: 'css-class', id: 'my-id'},
      pockets.dom.create('span', {}, 'some text'),
      'some more text',
      pockets.dom.create('span', {}, 'still more text'),
      '1 < 2 <g>');

    if (pockets.inPalmHost()) {
      expectedString = '<div class="css-class" id="my-id"><span>some text</span>some more text<span>still more text</span>1 &lt; 2 &lt;g&gt;</div>';
    } else {
      expectedString = '<div class="css-class" id="my-id"><span>some text</span>some more text<span>still more text</span>1 &lt; 2 &lt;g></div>';
    }


    expect(pockets.ui.htmlForElement(div)).toEqual(expectedString);
  });

});
