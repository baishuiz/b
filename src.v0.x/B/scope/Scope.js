Air.Module('B.scope.Scope', function(require) {
  var EVENTS = require('B.event.events');
  var util = require('B.util.util');
  var Scope = function(parent) {
    this.parent = parent;
  }

  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <textNode> 文本节点或属性节点.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(textNode, value, callback, scope, dataPath) {
    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },

      set: function(val) {
        var hasChanged = value !== val;
        var isArray = beacon.utility.isType(val, 'Array');
        var isObject = beacon.utility.isType(val, 'Object');
        var isPathNode = beacon.utility.isType(value, 'Array') || beacon.utility.isType(value, 'Object');
        if (hasChanged) {
          if (isPathNode) {
            // value = value ||  {};
            value = value || (isArray　? [] : {});

            if(isObject){
              for(var aa in value){
                if(!(aa in val)){
                  val[aa] = undefined;
                }
              }
            }

            beacon.utility.merge(value, val);
          } else {
            value = beacon.utility.isType(val, 'Undefined') ? '' : val;
            callback && callback();
          }
        }
      }
    }
    return descriptor;
  }

  var api = function(parent) {
    Scope.prototype = parent || {};
    Scope.prototype.constructor = Scope;
    return new Scope(parent);
  }
  return api;
});
