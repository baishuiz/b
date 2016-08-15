Air.Module('B.scope.scopeManager', function(require) {
  var rootScope = {};
  var ScopeTreeManager = require('B.scope.ScopeTreeManager');
  var initModel =  require('B.directive.model');
  var eventDirective = require('B.directive.event');
  var showDirective = require('B.directive.show');
  var styleDirective = require('B.directive.style');
  var propertyDirective = require('B.directive.property');
  var Repeater = require('B.directive.Repeater');
  var tagManager = require('B.scope.tagManager');

  var util = require('B.util.util');
  var nodeUtil = require('B.util.node');
  var memCache = require('B.data.memCache');

  var scopeTreeManager = new ScopeTreeManager(rootScope);

  var trim = function(str) {
    str = str || ''
    return str.trim ? str.trim() : str.replace(/^\s+|\s+^/,'');
  }

  function parseScope(scopeName, dom, needScope) {
    var scopeStructure = scopeTreeManager.getScopeByName(scopeName);
    if (!scopeStructure) {
      parseTemplate(dom, scopeName, null, null, needScope);
      scopeStructure = scopeTreeManager.getScopeByName(scopeName) || {};
    }

    return scopeStructure.scope;
  }

  function isHTML(node) {
    return node ? node.nodeType === nodeUtil.type.HTML : false;
  }

  function isView(node) {
    var isHTMLElement = isHTML(node);
    return isHTMLElement && (node.nodeName.toUpperCase() == 'VIEW');
  }

  function isRepeat(node) {
    var isHTMLElement = isHTML(node);
    return isHTMLElement && (node.hasAttribute('b-repeat'));
  }

  // DOM 树遍历回溯栈
  var backtrackingPoints = [];

  /**
   *作用：获取模板标签
   *参数: <content> 文本节点值/属性节点值
   *返回：array  模板标签列表
   **/
  function getDataPath(content) {
    return content.match(/{{.+?}}/g) || [];
  }

  /**
   *作用：监听文本节点或属性节点的数据源变动
   *参数: <dataPath> 数据源路径（有效 token）
   *参数: <currentScopeIndex> 当前作用域索引值
   *返回：undefind
   **/
  function bindObjectData(dataPath, currentScopeIndex, callback) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    var scope = scopeStructure.scope
    var activePath = '';
    // dataPath = dataPath.replace(/\.\d+$/,'')
    var pathNodes = dataPath.split('.') || [];
    for (var i = 0; i < pathNodes.length; i++) {
      // var nextPathNode = pathNodes.shift();
      var nextPathNode = pathNodes[i];
      var activeObj = activePath ? util.getData(activePath, scope) : scope;
      activeObj = activeObj || Air.NS(activePath, scope);
      var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);

      nextPathNode && (!Object.getOwnPropertyDescriptor(activeObj, nextPathNode) || /^\d+$/.test(nextPathNode) || (i === pathNodes.length - 1)) &&
        Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex));
      activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
    }
  }



  /**
   *作用：监听文本节点|属性节点的数据变化
   *参数: <tag>  数据标签
   *参数: <node> 文本节点|属性节点
   *参数: <scopeIndex> 数据标签所在作用域索引值
   *返回：undefind
   **/
  function watchData(tag, node, scopeIndex, callback){
     var scope = scopeTreeManager.getScope(scopeIndex);
     var tokens = getTokens(tag, node, scopeIndex);
     for(var i = 0; i < tokens.length; i++){
       var activeToken = tokens[i];
       tagManager.addNode(scopeIndex, activeToken, node, callback);
      //  tagManager.updateNodeValue(scopeIndex, scope, activeToken)
       bindObjectData(activeToken, scopeIndex);
     }
  }

  /**
   *作用：获得有效 token 列表
   *参数: <tag> 数据标签
   *返回：有效 token 列表
   **/
  function getTokens(tag, node, scopeIndex){
    node.$template = node.$template || node.nodeValue;
    var scope = scopeTreeManager.getScope(scopeIndex);
    // var tokens = tag.match(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g) || [];
    var tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = trim(tokens[i]);
      if(!(/^\d+$/.test(token) || /^['"]/.test(token) || token=='' || token==='true' || token ==='false')){
        // node.nodeValue = node.nodeValue.replace(token, 'util.getData("' + token + '", scope)')
        // console.log(token, '*************')
        var tokenReg = new RegExp(token.replace(/([.*?+\-^\/$])/g, '\\$1'), 'g');
        node.$template = node.$template.replace(tokenReg, 'util.getData("' + token + '", scope)')
        if(tokens.length === 1){
          node.nodeValue = node.nodeValue.replace(tag, util.getData(token, scope.scope)||'');
        }

        result.push(token);
      }
    }
    return result;
  }

  /**
   *作用：解析文本|属性节点，监听数据变化
   *参数: <node> 文本节点|属性节点
   *参数: <currentScopeIndex> 数据标签所在作用域索引值
   *返回：undefind
   **/
  function parseTEXT(node, currentScopeIndex) {
     var tags = node.nodeValue.match(/{{.*?}}/g) || [];

     // 遍历节点内所有数据标签
     for(var i = 0; i < tags.length; i++){
       var activeTag = tags[i];
       watchData(activeTag, node, currentScopeIndex);
     }
  }

  function tryGenerateSubViewScope(node, scopeStructure, currentScopeIndex) {
    if (node.tagName.toLowerCase() === 'view') {
      var scopeKey = node.getAttribute('b-scope-key');
      var viewName = node.getAttribute('name');
      var subScopeName = scopeKey || viewName;
      var subScope = scopeTreeManager.getScopeByName(subScopeName);
      if (!subScope) {
        var subScopeIndex = scopeTreeManager.addScope(currentScopeIndex, subScopeName);
        subScope = scopeTreeManager.getScope(subScopeIndex);
      }

      scopeStructure = subScope;

      if (scopeKey) {
        var controllerMap = memCache.get('controllerMap') || {};
        var controller = controllerMap[viewName];

        if (controller) {
          setTimeout(function(){
            b.run(viewName, controller);
          }, 0);
        }
      }
    }

    return scopeStructure;
  }

  /**
   *作用：遍历属性节点
   *参数: <node> HTML引用.
   *参数: <currentScopeIndex> 当前作用域索引值.
   *返回：undefind
   **/
  function parseHTML(node, currentScopeIndex) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    scopeStructure = tryGenerateSubViewScope(node, scopeStructure, currentScopeIndex);
    var scope = scopeStructure.scope;

    initModel(node, scopeStructure, watchData);
    eventDirective(node, scope);
    showDirective(node, scopeStructure, watchData);
    styleDirective(node, scopeStructure, watchData);
    propertyDirective(node, scope);

    var attributes = [].concat.apply([], node.attributes);
    for (var i = 0; i < attributes.length; i++) {　
      var activeAttribute = attributes[i];
      parseTEXT(activeAttribute, currentScopeIndex);
    }
  }


  /**
   *作用：模板解析
   *参数: <node> 模板引用.
   *参数: [currentScopeIndex] 模板当前所处作用域索引值.
   *返回：undefind
   **/
  function parseTemplate(node, scopeName, currentScopeIndex, isSub, needScope) {

    if (!node) {
      return
    }

    if(!isSub) {
      backtrackingPoints = [];
    }
    currentScopeIndex = currentScopeIndex || 0;

    if (isView(node) || needScope) {
      // view scope 压栈
      scopeName = node.getAttribute('b-scope-key') || node.getAttribute('name');
      currentScopeIndex = scopeTreeManager.addScope(currentScopeIndex, scopeName);
      // scopeName = currentScopeIndex;
    } else if (isRepeat(node)) { // view 不允许进行 repeat
      var nextNode = isSub && node.nextSibling;
      var repeatNode = createRepeatNodes(node, currentScopeIndex);
      if(!repeatNode){
        return parseTemplate(nextNode, scopeName, targetScopeIndex || currentScopeIndex, true);
      }else {
        node = repeatNode;
      }
    }



    // 回溯点压栈
    if (isSub && node.nextSibling && node.firstChild) { backtrackingPoints.push(node) };

    switch (node.nodeType) {
      case nodeUtil.type.HTML:
        parseHTML(node, currentScopeIndex);
        break;
      case nodeUtil.type.TEXT:
      case nodeUtil.type.ATTR:
        parseTEXT(node, currentScopeIndex);
        break;
      default:
    }

    var nextNode = node.firstChild || (isSub && node.nextSibling);
    if (!nextNode && isSub ) {
      var lastNode = backtrackingPoints.pop();
      nextNode = lastNode && lastNode.nextSibling;
      var targetScopeIndex = isView(lastNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex
      scopeName = isView(lastNode) && targetScopeIndex;
    }


    // 退出当前 scope
    // var targetScopeIndex = isView(nextNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex
    return parseTemplate(nextNode, scopeName, targetScopeIndex || currentScopeIndex, true);
  }


  /**
   *作用：基于 repeat 模板生成对应 UI元素
   *参数: <template> repeat模板引用.
   *参数: <scope> 当前 repeat 元素所处的作用域.
   *返回：使用 repeat 模板生成的第一个元素
   **/
  function createRepeatNodes(template, currentScopeIndex) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    var repeater = new Repeater(template, currentScopeIndex, scopeStructure, parseTemplate);
    var newFirstNode = repeater.updateUI()[0];
    return newFirstNode;
  }

  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <value> 模板标签初始值.
   *参数: <dataPath> 数据路径（标签模板内的有效 token）
   *参数: <scope> 当前标签所在的作用域id.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(value, dataPath, scopeIndex) {
    var scope = scopeTreeManager.getScope(scopeIndex);
    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },

      set: function(val) {
        var hasChanged = value !== val;
        var isPathNode = beacon.utility.isType(val, 'Array') || beacon.utility.isType(val, 'Object');
        if (hasChanged && isPathNode) {
          value = value || {};
          beacon.utility.merge(value, val);
        } else {
          if(value !== val){
            value = val;
            tagManager.updateNodeValue(scopeIndex, scope.scope, dataPath);
          }
        }
      }
    }
    return descriptor;
  }




  return {
    parseScope: parseScope,
    getScope: scopeTreeManager.getScopeByName,
    setRoot: scopeTreeManager.setRootScope,
    getScopeInstance: scopeTreeManager.getScopeInstanceByName,
    watchData: watchData
  }
});
