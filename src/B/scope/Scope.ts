Air.Module('B.scope.Scope', function(require:any) {
  let EVENTS = require('B.event.events');
  let util = require('B.util.util');


  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <textNode> 文本节点或属性节点.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(textNode:any, value:any, callback:Function, scope:any, dataPath:string) {
    let descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },

      set: function(val:any) {
        let hasChanged = value !== val;
        let isArray = beacon.utility.isType(val, 'Array');
        let isObject = beacon.utility.isType(val, 'Object');
        let isPathNode = beacon.utility.isType(value, 'Array') || beacon.utility.isType(value, 'Object');
        if (hasChanged) {
          if (isPathNode) {
            // value = value ||  {};
            value = value || (isArray　? [] : {});

            if(isObject){
              for(let aa in value){
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

  class Scope {
    private parent:any
    constructor(parent:any){
      this.parent = parent;
    }
    
  }  

  let api = function(parent:any) {
    Scope.prototype = parent || {};
    Scope.prototype.constructor = Scope;
    return new Scope(parent);
  }
  return api;
});
