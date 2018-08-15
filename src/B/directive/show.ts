Air.Module('B.directive.show', function(require:any) {
  let node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  let attribute = 'b-show';
  let api:any = function(target:any, scopeStructure:any, watchData:Function) {
    let isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, scopeStructure, watchData);
  }
  api.key = attribute;

  function processShowElement(target:any, scopeStructure:any, watchData:Function) {
    let $scope = scopeStructure.scope;
    let scopeIndex = scopeStructure.name;
    let attrNode = target.getAttributeNode(attribute);

    attrNode.nodeValue = '{{(' + attrNode.nodeValue + ')}}';
    let callbackNow = true;
    watchData(attrNode.nodeValue, attrNode, scopeIndex, watchElement, callbackNow);

    function watchElement(displayStatus:any) {
      displayStatus ? showHide(target, true) : showHide(target);
    }
  }

  function getData(target:any, key:string) {
    target.bData = target.bData || {};
    return target.bData[key];
  }

  function setData(target:any, key:string, value:any) {
    target.bData = target.bData || {};
    target.bData[key] = value;
    return value;
  }

  function getCSS(target:any, name:string) {
    let display = target.style.display;

    if (!display) {
      display = window.getComputedStyle ? (<Dictionary>window.getComputedStyle(target, null))[name] : target.currentStyle[name];
    }

    return display;
  }

  let elemdisplay:Dictionary = {};

  // Called only from within defaultDisplay
  function actualDisplay(name:string) {
    let target = document.body.appendChild(document.createElement(name));
    let display = getCSS(target, 'display');

    document.body.removeChild(target);

    return display;
  }

  function defaultDisplay(nodeName:string) {
    // let document:any = document;
    let  display = elemdisplay[nodeName];

    if (!display) {
      display = actualDisplay(nodeName);

      elemdisplay[nodeName] = display;
    }

    return display;
  }


  function showHide(target:any, show?:boolean) {
    let display, hidden, olddisplay;

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
