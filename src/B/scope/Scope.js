Air.Module('B.scope.Scope', function(require) {
  var EVENTS = require('B.event.events');
  var util = require('B.util.util');
  var Scope = function(parent) {
    this.parent = parent
  }

  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <textNode> 文本节点或属性节点.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(textNode, value, callback, scope) {
    var template = textNode.nodeValue;
    textNode.nodeValue = getExpressionValue(template, dataPath, value, scope);

    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },

      set: function(val) {
        var hasChanged = this.value !== value;
        var isPathNode = beacon.utility.isType(value, 'Array') || beacon.utility.isType(value, 'Object');
        if (hasChanged && isPathNode) {
          value = val;
          textNode.nodeValue = getExpressionValue(template, dataPath, value, scope);
          callback && callback();
        }
      }
    }
    return descriptor;
  }

  function getExpressionPath(expressionStr) {
    var tokens = expressionStr.match(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g) || [];
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
       token = trim(token);
       if(/^\d+$/.test(token) || /^['"]/.test(token) || token=='' || token==='true' || token ==='false' ){
       } else {
         result.push(token);
         // return 'util.getData("' + token + '", $scope)'
       }
    }
    return result;
  }

  function getExpressionValue(expressionStr, dataPath, value, scope) {
    dataPath = dataPath.replace(/{{|}}/ig, '');
    var expression = dataPath.replace(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g, function(token){
       token = trim(token);
       if(/^\d+$/.test(token) || /^['"]/.test(token) || token=='' || token==='true' || token ==='false' ){
         return token
       } else {
         return 'util.getData("' + token + '", scope)'
       }
    });

    var data = eval(expression) //new Function($scope, 'return ' + expression)($scope);
    data = util.isEmpty(data) ? '' : data;
    var temlateReg = new RegExp('\\{\\{' + dataPath.replace(/(\$|\.)/, '\\$1') + '\\}\\}', 'g');
    return expressionStr.replace(temlateReg, data);
  }

  var proto = {};

  proto.listenDataChange = function(dataPath, node, callback) {
    var scope = this;
    var activePath = '';

    var pathNodes = dataPath.split('.') || [];
    for (var i = 0; i < pathNodes.length; i++) {
      var nextPathNode = pathNodes.shift();

      var activeObj = activePath ? util.getData(activePath, scope) : scope;
      activeObj = activeObj || Air.NS(activePath, scope);
      var nextObj = nextPathNode && util.getData(nextPathNode, scope);
      Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, node, nextObj, callback, scope));
      activePath = nextPathNode ? (activePath + '.' + nextPathNode) : nextPathNode;
    }
  }

  var api = function(parent) {
    Scope.prototype = parent || proto;
    return new Scope(parent);
  }
  return api;
});
