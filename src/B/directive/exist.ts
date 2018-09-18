Air.Module('B.directive.exist', function(require:any) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-exist';
  var api:any = function(target:any, scopeStructure:any, watchData:any) {
    var isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, scopeStructure, watchData);
    // return isShowElement
  }
  api.key = attribute;

  function processShowElement(target:any, scopeStructure:any, watchData:any) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var attrNode = target.getAttributeNode(attribute);

    if(attrNode.nodeValue){
      attrNode.nodeValue = '{{(' + attrNode.nodeValue + ')}}';
    } else {
      return
    }
    
    var callbackNow = true;
    watchData(attrNode.nodeValue, attrNode, scopeIndex, watchElement, callbackNow);

    function watchElement(displayStatus:any) {
      // displayStatus ? showHide(target, true) : showHide(target);
      displayStatus && removeDom(target);
    }
  }

  // function getCSS(target, name) {
  //   var display = target.style.display;
  //
  //   if (!display) {
  //     display = window.getComputedStyle ? window.getComputedStyle(target, null)[name] : target.currentStyle[name];
  //   }
  //
  //   return display;
  // }

  // var elemdisplay = {};

  // Called only from within defaultDisplay
  // function actualDisplay(name) {
  //   var target = document.body.appendChild(document.createElement(name));
  //   var display = getCSS(target, 'display');
  //
  //   document.body.removeChild(target);
  //
  //   return display;
  // }

  // function defaultDisplay(nodeName) {
  //   var document = document,
  //     display = elemdisplay[nodeName];
  //
  //   if (!display) {
  //     display = actualDisplay(nodeName);
  //
  //     elemdisplay[nodeName] = display;
  //   }
  //
  //   return display;
  // }


  // function showHide(target:any, show:any) {
  //   var display, hidden, olddisplay;
  
  //   if (!target) {
  //     return;
  //   }
  
  //   olddisplay = getData(target, 'olddisplay');
  //   display = target.style.display;
  
  //   // if (show) {
    
  //   //   // Reset the inline display of this element to learn if it is
  //   //   // being hidden by cascaded rules or not
  //   //   if (!olddisplay && display === 'none') {
  //   //     target.style.display = '';
  //   //     display = '';
  //   //   }
    
  //   //   // Set elements which have been overridden with display: none
  //   //   // in a stylesheet to whatever the default browser style is
  //   //   // for such an element
  //   //   if (display === '') {
  //   //     olddisplay = setData(target, 'olddisplay', defaultDisplay(target.nodeName));
  //   //   }
  //   // } else {
  //   //   if (display && display !== 'none') {
  //   //     setData(target, 'olddisplay', display);
  //   //   }
  //   // }
    
  //   // // Set the display of most of the elements in a second loop
  //   // // to avoid the constant reflow
  //   // if (!show || display === 'none' || display === '') {
  //   //   target.style.display = show ? olddisplay || '' : 'none';
  //   // }
  
  // }

  function removeDom(target:any) {
    if (!target) {
      return;
    }

    var parent = target.parentElement;
    parent && parent.removeChild(target);
  }

  return api;
});