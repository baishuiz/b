Air.Module('B.directive.style', function(require:any) {
  let node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  let attribute = 'b-style';
  let api = function(target:any, scopeStructure:any, watchData:Function) {
    let isStyleElement = node(target).hasAttribute(attribute);
    isStyleElement && processStyleElement(target, scopeStructure, watchData);
  }

  function processStyleElement(target:any, scopeStructure:any, watchData:Function) {
    let $scope = scopeStructure.scope;
    let scopeIndex = scopeStructure.name;
    let attrNode = target.getAttributeNode(attribute);

    // attrNode.nodeValue = '{{' + attrNode.nodeValue + '}}';

    let tags = attrNode.nodeValue.match(/{{.*?}}/g) || [];

    // 遍历节点内所有数据标签
    for(let i = 0; i < tags.length; i++){
      let activeTag = tags[i];
      // watchData(activeTag, node, currentScopeIndex);
      watchData(activeTag, attrNode, scopeIndex, watchElement);
    }



    function watchElement(displayStatus:any) {
      target.style.cssText = displayStatus;
    }
  }


  let elemdisplay = {};
  return api;
});
