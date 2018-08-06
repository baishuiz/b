Air.Module('B.util.util', function(require:any) {
  let nodeUtil = require('B.util.node');

  class Util  {
    static isEmpty(obj:any) {
      if (obj == null) {
        return true;
      }
      var isObject = beacon.utility.isType(obj, 'Object');
      var isArray = beacon.utility.isType(obj, 'Array');
      if (!isObject && !isArray) {
        return false;
      }
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    };

    static enums(keys:string) {
      let result:Dictionary = {};
      for (let i = keys.length - 1; i >= 0; i--) {
        result[keys[i]] = keys[i];
      };
      return result;
    };

    static getData (pathString:string, root:any):any{
      var rootParent = root.parent;
      var nsPath = pathString.split("."),
          ns = root || window || {},
          root = ns;
      // 如果不是最后一个为undefined，则赋值为空数组，避免Observe绑定失败
      for (var i = 0, len = nsPath.length; i < len; i++) {
          if(!ns || (ns[nsPath[i]] === undefined)){
              return  rootParent && Util.getData(pathString, rootParent);
          } else {
              ns = ns[nsPath[i]];
          }
      };
      return ns ;
    }

    static trim (str:string):string {
      str = str || ''
      return str.trim ? str.trim() : str.replace(/^\s+|\s+^/, '');
    };

    static isHTML(node:any) {
      return node ? node.nodeType === nodeUtil.type.HTML : false;
    }


  };
  return Util;
});
