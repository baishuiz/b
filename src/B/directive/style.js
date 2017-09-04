Air.Module('B.directive.style', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-style';
  var api = function(target, scopeStructure, watchData) {
    var isStyleElement = node(target).hasAttribute(attribute);
    isStyleElement && processStyleElement(target, scopeStructure, watchData);
  }

  function processStyleElement(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.index;
    var attrNode = target.getAttributeNode(attribute);

    // attrNode.nodeValue = '{{' + attrNode.nodeValue + '}}';

    var tags = attrNode.nodeValue.match(/{{.*?}}/g) || [];

    // 遍历节点内所有数据标签
    for(var i = 0; i < tags.length; i++){
      var activeTag = tags[i];
      // watchData(activeTag, node, currentScopeIndex);
      watchData(activeTag, attrNode, scopeIndex, watchElement);
    }



    function watchElement(displayStatus) {
      target.style.cssText = displayStatus;
    }
  }


  var elemdisplay = {};
  return api;
});
