Air.Module('B.scope.scopeManager', function(require) {
  var rootScope = {};
  var ScopeTreeManager = require('B.scope.ScopeTreeManager');
  var initModel = require('B.directive.model');
  var eventDirective = require('B.directive.event');
  var showDirective = require('B.directive.show');
  var existDirective = require('B.directive.exist');
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
    return str.trim ? str.trim() : str.replace(/^\s+|\s+^/, '');
  };

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
   *返回：undefined
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

      nextPathNode && (!(Object.getOwnPropertyDescriptor(activeObj, nextPathNode) && Object.getOwnPropertyDescriptor(activeObj, nextPathNode).set) || (i === pathNodes.length - 1)) &&
        Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex, callback));
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
  function watchData(tag, node, scopeIndex, callback, callbackNow){
     var scope = scopeTreeManager.getScope(scopeIndex);
     var tokens = getTokens(tag, node, scopeIndex);
     for(var i = 0; i < tokens.length; i++){
       var activeToken = tokens[i];

      //  var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
      //  var scope = scopeStructure.scope
       callback && callbackNow && callback(util.getData(activeToken, scope.scope));

       tagManager.addNode(scopeIndex, activeToken, node, callback);
       // bindObjectData(activeToken, scopeIndex, callback);
     }

  }


  /**
   *作用：获得有效 token 列表
   *参数: <tag> 数据标签
   *返回：有效 token 列表
   **/
  function getTokens(tag, node, scopeIndex) {
    node.$template = node.$template || node.nodeValue;
    var scope = scopeTreeManager.getScope(scopeIndex);
    // var tokens = tag.match(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g) || [];
    var tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
    var result = [];
    var temp = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = trim(tokens[i]);
      if (!(/^\d+$/.test(token) || /^['"]/.test(token) || token == '' || token === 'true' || token === 'false')) {
        // var tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')', 'g');
          var tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')');
        var lastTagStr = (node.$tag || tag);
        // var tagStr = lastTagStr.replace(tokenReg, function($0, $1, $2) {
        //   if ($0.indexOf('util.getData("' + token) >= 0) {
        //     return $0
        //   } else {
        //     return $0.replace($2, 'util.getData("' + token + '", scope)')
        //   }
        // });

          var tagStrList = lastTagStr.match(tokenReg);
          // var tagStrList = tokenReg.exec(token);
          temp.push(tagStrList);
          // temp.push(tagStr);

        // node.$template = node.$template.replace(lastTagStr, tagStr);
        // node.$tag = tagStr;

        result.push(token);
      }
    }

    // console.log(JSON.stringify(temp),"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    for(var j = temp.length - 1; j >=0; j--) {
        // var activeToken = temp[j];
        // // console.log(activeToken[0], activeToken[1], activeToken[2], activeToken.index);
        // var lastTagStr = (node.$tag || tag);
        //
        // var left = activeToken.input.substr(0, activeToken.index);
        // var right = activeToken.input.substr(activeToken.index + activeToken[0].length);
        // var ttt = 'util.getData("' + activeToken[2] + '", scope)'
        // var tagStrNew = left + ttt + right;
        //
        // node.$template = node.$template.replace(lastTagStr, tagStrNew);
        // node.$tag = tagStrNew;

        // console.log(tagStrNew, "*****************************************88");
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
    var scope = scopeTreeManager.getScope(currentScopeIndex).scope;

    // 遍历节点内所有数据标签
    for (var i = 0; i < tags.length; i++) {
      var activeTag = tags[i];
      watchData(activeTag, node, currentScopeIndex);
      if (node.$tag) {
        var val = eval(node.$tag.replace(/(^{{)|(}}$)/g, '')) || '';
        node.nodeValue = node.nodeValue.replace(activeTag, val);
        node.$tag = '';
      }
    }
  }

  function tryGenerateSubViewScope(node, scopeStructure) {
    if (node.tagName.toLowerCase() === 'view') {
      var scopeKey = node.getAttribute('b-scope-key');
      var viewName = node.getAttribute('name');
      var subScopeName = scopeKey || viewName;
      // var subScope = scopeTreeManager.getScopeByName(subScopeName);
      var subScope = scopeStructure.scope;
      var currentScopeIndex = scopeStructure.index;
      if (!subScope) {
        var subScopeIndex = scopeTreeManager.addScope(currentScopeIndex, subScopeName);
        subScope = scopeTreeManager.getScope(subScopeIndex);
      }

      if (scopeKey) {
        var controllerMap = memCache.get('controllerMap') || {};
        var controller = controllerMap[viewName];

        if (controller) {
          setTimeout(function() {
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
    tryGenerateSubViewScope(node, scopeStructure);
    var scope = scopeStructure.scope;
    existDirective(node, scopeStructure, watchData)
    if (!node.parentElement) {
      return;
    }
    initModel(node, scopeStructure, watchData);
    eventDirective(node, scope);
    showDirective(node, scopeStructure, watchData);
    styleDirective(node, scopeStructure, watchData);
    propertyDirective(node, scopeStructure, watchData);

    var attributes = [].concat.apply([], node.attributes);
    for (var i = 0; i < attributes.length; i++) {　
      var activeAttribute = attributes[i];
      if ([initModel.key, showDirective.key].indexOf(activeAttribute.name) !== -1) {
        continue;
      }
      parseTEXT(activeAttribute, currentScopeIndex);
    }

      var children = node.childNodes;
      for (var childIndex = 0; childIndex < children.length; childIndex++) {
          var activeChild = children[childIndex];
          if (activeChild.nodeType === nodeUtil.type.TEXT && activeChild.nodeValue.indexOf('{{')>=0) {
              parseTEXT(activeChild, currentScopeIndex);
          }
      }
  }


  /**
   *作用：模板解析
   *参数: <node> 模板引用.
   *参数: [currentScopeIndex] 模板当前所处作用域索引值. 默认值 = 0 
   *返回：undefind
   **/
  function parseTemplateRAW(node, scopeName, currentScopeIndex, isSub, needScope) {

    if (!node) {
      return;
    }

    // if (!isSub) {
      // backtrackingPoints = [];
    // }
    currentScopeIndex = currentScopeIndex || 0;

    var popPoints = function(nextNode, scopeName) {
      return {
        nextNode: nextNode,
        scopeName: scopeName
      }
    }


    var goOn = function(nextNode, scopeName) {
      if (!nextNode && isSub) {
        var lastNode = backtrackingPoints.pop();
        nextNode = lastNode && getNode(lastNode.nextSibling);
        var targetScopeIndex = isView(lastNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex
        scopeName = isView(lastNode) && targetScopeIndex;
      }

      parseTemplate(nextNode, scopeName, targetScopeIndex || currentScopeIndex, true);
    }

    if (isView(node) || needScope) {
      // view scope 压栈
      scopeName = node.getAttribute('b-scope-key') || node.getAttribute('name');
      currentScopeIndex = scopeTreeManager.addScope(currentScopeIndex, scopeName);
      // scopeName = currentScopeIndex;
    } else if (isRepeat(node)) { // view 不允许进行 repeat
      var nextNode = isSub && getNode(node.nextSibling);
      var repeatNode = createRepeatNodes(node, currentScopeIndex);
      if (!repeatNode) {
        // repeat 元素没有下一个节点时退栈，统一放到 goOn 中处理
        return goOn(nextNode, scopeName);
      } else {
        node = repeatNode;
      }
    }



    // 回溯点压栈
    if (isSub && getNode(node.nextSibling) && getNode(node.firstChild)) { backtrackingPoints.push(node) };

    var nextSibling = getNode(node.nextSibling);
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

    var nextNode;
    if (!node.parentElement) {
      if (isSub && (node.firstChild)) {
        backtrackingPoints.pop();
      }

      nextNode = (isSub && nextSibling);
    } else {
      nextNode = getNode(node.firstChild) || (isSub && nextSibling);
    }

    goOn(nextNode, scopeName);
  }


  function parseTemplateProxy(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);

        if (!active) {
            active = true;

            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }

            active = false;

            return value;
        }
    }
}

// var parseTemplate = parseTemplateProxy(parseTemplateRAW);
// var parseTemplate = parseTemplateRAW;

    /**
     * @param node
     * @param scopeName
     * @param currentScopeIndex
     * @param isSub
     * @param needScope
     */
    var parseTemplate = function (node, scopeName, currentScopeIndex, isSub, needScope) {
        if (!node) {
            return;
        }

        currentScopeIndex = currentScopeIndex || 0;
        parseNode(node, currentScopeIndex)

        var activeRepeat;
        while(activeRepeat = node.querySelector('[b-repeat]')) {

          // if(!activeRepeat){break;}
          parseNode(activeRepeat, currentScopeIndex);
        }


         var nodes = node.querySelectorAll('*');
         // var nodes = node.childNodes;
         for(var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++){
           var activeNode = nodes[nodeIndex];
           // var targetScopeIndex = isView(activeNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex;
           // scopeName = isView(activeNode) && targetScopeIndex;
           parseNode(activeNode, currentScopeIndex)
         }



         function parseNode(node){
             if (isView(node) || needScope) {
                 // view scope 压栈
                 scopeName = node.getAttribute('b-scope-key') || node.getAttribute('name');
                 currentScopeIndex = scopeTreeManager.addScope(currentScopeIndex, scopeName);
             }
             else if (isRepeat(node)) { // view 不允许进行 repeat
                 // var nextNode = isSub && getNode(node.nextSibling);
                 createRepeatNodes(node, currentScopeIndex);
                 return;

             }
             switch (node.nodeType) {
                 case nodeUtil.type.HTML:
                   if (!node.kkk) {
                       parseHTML(node, currentScopeIndex);
                   }
                     break;
                 case nodeUtil.type.TEXT:
                 case nodeUtil.type.ATTR:
                     parseTEXT(node, currentScopeIndex);
                     break;
                 default:
             }
         }
    };


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
  function createDescriptor(value, dataPath, scopeIndex, callBack) {
    var scope = scopeTreeManager.getScope(scopeIndex);
    var oldLength = 0;

    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
       var isArray = beacon.utility.isType(value, 'Array');
       if(isArray){
         // 数组push操作等，会触发get，此时拿到的length是push之前的，所以要延迟
         setTimeout(function() {
           if (oldLength !== value.length) {
             callBack && callBack();
           }
           oldLength = value.length;
         }, 0);
       }

        return value;
      },

      set: function(val) {
        var hasChanged = value !== val;
        var isArray = beacon.utility.isType(val, 'Array');
        var isObject = beacon.utility.isType(val, 'Object');
        var isPathNode = isArray || isObject;
        if (hasChanged && isPathNode) {
          value = value || (isArray　? [] : {});
          if (isArray) {
            var oldLen = value.length;
            var newLen = val.length;

            if (newLen < oldLen) {
              value.splice(newLen - oldLen, oldLen - newLen);
            }
          }

          if(isObject){
            for(var aa in value){
              if(!(aa in val)){
                val[aa] = undefined;
              }
            }
          }

          beacon.utility.merge(value, val);
          // beacon.utility.blend(value, val, {reset:true});
           isArray && callBack && callBack();
          //  (isObject) && callBack && callBack(util.getData(dataPath, scope.scope));
          
          // callBack && callBack();
        } else {
          if (value !== val) {
            value = val;
            tagManager.updateNodeValue(scopeIndex, scope.scope, dataPath);
          }
        }
      }
    };
    return descriptor;
  }
  beacon.on('updateObjectData', function(e, args){
    bindObjectData(args.dataPath, args.currentScopeIndex);
    // args.callback && args.callback();
  });


  function getNode(node) {
    if(!node) {return node;}
    switch (node.nodeType) {
      case nodeUtil.type.HTML:
        return node; // TODO: 过滤无效 HTML
        break;
      case nodeUtil.type.TEXT:
      case nodeUtil.type.ATTR:
        return getTextNode(node);
        break;
        
      default:
        return node
    }
  }

  function getTextNode(node){
    var hasTempleteTag = node.nodeValue.indexOf('{{')>=0;
    if(hasTempleteTag){
      return node;
    } else {
      return getNode(node.nextSibling)
    }
  }

  return {
    parseScope: parseScope,
    getScope: scopeTreeManager.getScopeByName,
    setRoot: scopeTreeManager.setRootScope,
    getScopeInstance: scopeTreeManager.getScopeInstanceByName,
    watchData: watchData
  }
});
