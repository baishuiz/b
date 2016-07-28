Air.Module('B.directive.Repeater', function(require) {
  var attrName = 'b-repeat';
  var util = require('B.util.util');


  function getTemplateStr(str, idx, dataPath, dataPrefix){
    var reg = new RegExp("\\b\("+ dataPrefix +"\)\\b", 'g');
    // var repeatIndexREG = new RegExp('\\b' + dataPath + '\\[\\d+\\]\\.\\$index\\b');
    var repeatIndexREG = new RegExp('\\b' + dataPath + '\\.\\d+\\.\\$index\\b');
    var repeatIndexREG2 = new RegExp('{{\\b' + dataPath + '\\.\\d+\\.\\$index\\b}}');

    var result = str.replace(/\{\{.*?\}\}|b-show\s*=\s*".*?"|b-model\s*=\s*".*?"|b-property\s*=\s*".*"|b-repeat\s*=\s*".*"/g, function(tag){
        // return tag.replace(reg, dataPath + '[' + idx + ']');
        return tag.replace(reg, dataPath + '.' + idx);
    });
    result = result.replace(repeatIndexREG2, idx);
    result = result.replace(repeatIndexREG, idx);

    return result;
  }


  function fixSelectElement(placeholder, target){
    if(target.nodeName.toLowerCase()=='option'){
      setTimeout(function(){
        placeholder.parentNode.value = placeholder.parentNode.defaultValue;
      },0);
    }
  }

  /**
   *作用：repeat模板控制器类
   *参数: <template> repeat模板引用.
   *参数: <scope> 当前 repeat 元素所处的作用域.
   *返回：Repeater 实例
   **/
  function Repeater(template, currentScopeIndex, scopeStructure, parseTemplate) {
    var scope = scopeStructure.scope;
    var uiElementCount = 0;
    var tag = generatePlaceholder(template);
    var expressionStr = template.getAttribute('b-repeat');
    var expressionREG = /(\S+)\s+in\s+(\S+)/;
    var expression = expressionStr.match(expressionREG) || [];
    var dataPath = expression[2];
    var dataPrefix = expression[1];
    var templateStr = template.outerHTML;
    template.parentNode.removeChild(template);

    function generatePlaceholder(target) {
      if (target.placeholder) {
        return target.placeholder;
      }
      var placeholder = document.createComment('repeat placeholder ' + target.getAttribute(attrName));
      target.parentNode.insertBefore(placeholder, target);
      target.placeholder = placeholder;
      return placeholder;
    }

    var getCount = function() {
      var data = util.getData(dataPath, scope) || [];
      var count = data.length || 0;
      return count;
    }

    var getDataPrefix = function() {
      return dataPrefix;
    }

    var addUI = function(num) {

      // var templateStr = template.outerHTML;

      var elementContent = '';
      var elementContainer = document.createDocumentFragment();
      var newFirstNode = null;
      var newNodeList = [];
      for (var i = 0; i < num; i++) {
        var uiIndex = uiElementCount + i;
        elementContent = getTemplateStr(templateStr, uiIndex, dataPath, dataPrefix);
        var docContainer = document.createElement('div');
        docContainer.innerHTML = elementContent;
        var targetNode = docContainer.firstChild;
        targetNode.removeAttribute('b-repeat');
        targetNode.$index = uiIndex;
        elementContainer.appendChild(targetNode);
        // newFirstNode = newFirstNode || ((i === 0) && targetNode);
        newNodeList.push(targetNode)
      }

      // template.parentNode.insertBefore(elementContainer, template);
      tag.parentNode.insertBefore(elementContainer, tag);
      fixSelectElement(tag, targetNode)
      elementContainer = null;
      docContainer = null;
      uiElementCount += num;
      return newNodeList;
    }

    var removeUI = function(num) {
      num = Math.abs(num);
      for (var i = 0; i < num; i++) {
        tag.parentNode.removeChild(tag.previousElementSibling);
      }
      uiElementCount -= num;
    }

    var updateUI = function() {
      var repeatCount = getCount();
      var num = repeatCount - uiElementCount;
      var isRemove = num < 0;
      var isAdd = num > 0;
      isRemove && removeUI(num);
      var newFirstNode = isAdd && addUI(num);
      return newFirstNode;
    }

    /**
     *作用：监听 repeat 元素数据源变动
     *参数: <repeater> repeat ui 控制器
     *参数: <dataPath> 数据源路径
     *返回：undefind
     **/
    function bindRepeatData(repeater, dataPath) {
      var activePath = '';
      var pathNodes = dataPath.split('.') || [];
      // (template, currentScopeIndex, scopeStructure, parseTemplate)
      for (var i = 0; i < pathNodes.length; i++) {
        // var nextPathNode = pathNodes.shift();
        var nextPathNode = pathNodes[i];

        var activeObj = activePath ? util.getData(activePath, scope) : scope;
        activeObj = activeObj || Air.NS(activePath, scope);
        var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);
        Object.defineProperty(activeObj, nextPathNode, createRepeatDataDescriptor.call(activeObj, repeater, nextObj));
        activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
      }
    }

    /**
     *作用：创建 repeat 数据源的描述符
     *参数: <repeater> 模板 UI 控制器.
     *参数: <scope> 模板当前所处作用域.
     *返回：repeat 数据源的描述符
     **/
    function createRepeatDataDescriptor(repeater, value) {
      var oldLength = 0;
      value = value || [];
      var descriptor = {
        enumerable: true,
        configurable: true,
        get: function() {
          // 数组push操作等，会触发get，此时拿到的length是push之前的，所以要延迟
          setTimeout(function() {
            if (oldLength !== value.length) {
              var nodes = repeater.updateUI();
              // node && parseTemplate(node, currentScopeIndex);
              for(var i=0; i<nodes.length; i++){
                var activeNode = nodes[i];
                activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex)
              }
            }
            oldLength = value.length;
          }, 0);
          return value;
        },

        set: function(val) {
          var hasChanged = value !== val;
          var isArray = beacon.utility.isType(value, 'Array');
          var isObject = beacon.utility.isType(value, 'Object');

          if (hasChanged && isObject) {
            value = value || {};
            beacon.utility.merge(value, val);
          } else if (hasChanged && isArray) {
            value = value || [];
            beacon.utility.merge(value, val);
            var nodes = repeater.updateUI();
            // node && parseTemplate(node, currentScopeIndex, currentScopeIndex);
            for(var i=0; i<nodes.length; i++){
              var activeNode = nodes[i];
              activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex)
            }
          }
        }
      }
      return descriptor;
    }

    var api = {
      updateUI: updateUI,
      getDataPrefix: getDataPrefix
    }

    bindRepeatData(api, dataPath);

    return api;
  }

  return Repeater;
});
