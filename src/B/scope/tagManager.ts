Air.Module('B.scope.tagManager', function(require:any) {
  let util = require('B.util.util');
  let nodeMap:Dictionary = [];

  /**
   *作用：新增 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *参数: <node> 文本节点|属性节点
   *返回：array  文本节点|属性节点列表
   **/
  function addNode(scopeIndex:string, token:string, node:HTMLElement, callback:Function){
    nodeMap[scopeIndex] = nodeMap[scopeIndex] || {};
    nodeMap[scopeIndex][token] = nodeMap[scopeIndex][token]  || [];
    nodeMap[scopeIndex][token].push({
      element : node,
      template : (<any>node).$template,
      callback : callback
    });
  }

  /**
   *作用：获取 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function getNodes(scopeIndex:string, token:string){
    let node = nodeMap[scopeIndex];
    let nodeList = node && node[token]  || [];
    return nodeList;
  }

  /**
   *作用：更新相关文本节点|属性节点值
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function updateNodeValue(scopeIndex:string, scope:any, token:string, callback:Function){
    let nodes = getNodes(scopeIndex, token);
    for(let i = 0; i< nodes.length; i++){
      let activeNode = nodes[i];
      let newValue = activeNode.element.$template.replace(/{{(.*?)}}/g, function(tag:string, expression:string){
        return eval(expression) || '';
      });

      // 修正 select 开始
      // ToDo: 代码外移    （这段逻辑好像没什么用？xmf 20160927）
      let ownerElement = activeNode.element.ownerElement;
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




  let api = {
        addNode : addNode,
        getNodes : getNodes,
        updateNodeValue : updateNodeValue
  };
  return api;
});
