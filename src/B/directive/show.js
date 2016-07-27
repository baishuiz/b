Air.Module('B.directive.show', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-show';
  var api = function(target, scopeStructure, watchData) {
    var isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, scopeStructure, watchData);
  }

  function processShowElement(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var attrNode = target.getAttributeNode(attribute);

    attrNode.nodeValue = '{{' + attrNode.nodeValue + '}}';

    watchData(attrNode.nodeValue, attrNode, scopeIndex, watchElement);

    function watchElement(displayStatus) {
      displayStatus ? showHide(target, true) : showHide(target);
    }
  }

  function getData(target, key, value) {
    target.bData = target.bData || {};
    return target.bData[key];
  }

  function setData(target, key, value) {
    target.bData = target.bData || {};
    target.bData[key] = value;
    return value;
  }

  function getCSS(target, name) {
    var display = target.style.display;

    if (!display) {
      display = window.getComputedStyle ? window.getComputedStyle(target, null)[name] : target.currentStyle[name];
    }

    return display;
  }

  var elemdisplay = {};

  // Called only from within defaultDisplay
  function actualDisplay(name) {
    var target = document.body.appendChild(document.createElement(name));
    var display = getCSS(target, 'display');

    document.body.removeChild(target);

    return display;
  }

  function defaultDisplay(nodeName) {
    var document = document,
      display = elemdisplay[nodeName];

    if (!display) {
      display = actualDisplay(nodeName);

      elemdisplay[nodeName] = display;
    }

    return display;
  }


  function showHide(target, show) {
    var display, hidden, olddisplay;

    if (!target || !target.style) {
      return;
    }

    olddisplay = getData(target, 'olddisplay');
    display = target.style.display;
    if (show) {

      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if (!olddisplay && display === 'none') {
        target.style.display = '';
        display = '';
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if (display === '') {
        olddisplay = setData(target, 'olddisplay', defaultDisplay(target.nodeName));
      }
    } else {
      if (display && display !== 'none') {
        setData(target, 'olddisplay', display);
      }
    }

    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    if (!show || display === 'none' || display === '') {
      target.style.display = show ? olddisplay || '' : 'none';
    }

  }

  return api;
});
