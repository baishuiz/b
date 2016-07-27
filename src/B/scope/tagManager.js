Air.Module('B.scope.tagManager', function(require) {
  var util = require('B.util.util');
  var nodeMap = [];

  /**
   *作用：新增 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *参数: <node> 文本节点|属性节点
   *返回：array  文本节点|属性节点列表
   **/
  function addNode(scopeIndex, token, node, callback){
    nodeMap[scopeIndex] = nodeMap[scopeIndex] || {};
    nodeMap[scopeIndex][token] = nodeMap[scopeIndex][token]  || [];
    nodeMap[scopeIndex][token].push({
      element : node,
      template : node.$template,
      callback : callback
    });
  }

  /**
   *作用：获取 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function getNodes(scopeIndex, token){
    var nodeList = nodeMap[scopeIndex][token]  || [];
    return nodeList;
  }

  /**
   *作用：更新相关文本节点|属性节点值
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function updateNodeValue(scopeIndex, scope, token, callback){
    var nodes = getNodes(scopeIndex, token);
    for(var i = 0; i< nodes.length; i++){
      var activeNode = nodes[i];
      var newValue = activeNode.template.replace(/{{(.*?)}}/g, function(tag, expression){
        return eval(expression) || '';
      });
      activeNode.element.nodeValue = newValue;
      activeNode.callback && activeNode.callback(newValue);
    }
  }




  var api = {
        addNode : addNode,
        getNodes : getNodes,
        updateNodeValue : updateNodeValue
  };
  return api;
});
