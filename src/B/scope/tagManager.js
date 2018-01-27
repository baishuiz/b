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

  function removeNode(scopeIndex, token) {
      token = token.replace(/\./g, '\\.');
      var reg = new RegExp('^'+token + '.+','ig');
      for (var key in nodeMap[scopeIndex]) {
          if (key.match(reg) !== null) {
              nodeMap[scopeIndex] = nodeMap[scopeIndex] || {};
              nodeMap[scopeIndex][key] = [];
              // updateNodeValue(scopeIndex, scope.scope, key);
          }
      }
  }

  /**
   *作用：获取 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function getNodes(scopeIndex, token){
    var node = nodeMap[scopeIndex];
    var nodeList = node && node[token]  || [];
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
    var result;
    for(var i = 0; i< nodes.length; i++){
      var activeNode = nodes[i];
      var newValue = activeNode.element.$template.replace(/{{(.*?)}}/g, function(tag, expression){
        // return eval(expression) || '';
        
        try{
          result = eval(expression);
        }catch(e){
          // result = expression;
          var result= expression.replace(/[\$_\w]+(\.[\w\d]+)*|['"]?\w+?\b/g, function(a){
            // console.log(a,"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            if(/^['"]/.test(a)||/^\d+$/.test(a)){
              return a;
            }else{
              return "util.getData('" + a +"', scope)"

            }
            // return '6666666666666666666' 
          })

          // console.log(result,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
          result = eval(result);
          // console.log(scopeIndex,scope)
          // console.log(expression, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        }
        return result || '';
      });

      // 修正 select 开始
      // ToDo: 代码外移    （这段逻辑好像没什么用？xmf 20160927）
      var ownerElement = activeNode.element.ownerElement;
      if(ownerElement && ownerElement.nodeName.toLowerCase() === 'option' && ownerElement.parentNode){
        setTimeout(function(){
          if (ownerElement.parentNode) {
            ownerElement.parentNode.value = ownerElement.parentNode.initValue;
          }
        },0);
      }
      // 修正 select 结束

      activeNode.element.nodeValue = newValue;
      activeNode.callback && activeNode.callback(newValue);
    }
  }

  function updateAll(scopeIndex, scope,  token) {
    token = token.replace(/\./g, '\\.');
    var reg = new RegExp('^'+token + '\\.\\d\\..+','ig');
    for (var key in nodeMap[scopeIndex]) {
        if (key.match(reg) !== null) {
            updateNodeValue(scopeIndex, scope.scope, key);
        }
    }
  }



  var api = {
        addNode : addNode,
        removeNode : removeNode,
        getNodes : getNodes,
        updateNodeValue : updateNodeValue,
        updateAll: updateAll
  };
  return api;
});
