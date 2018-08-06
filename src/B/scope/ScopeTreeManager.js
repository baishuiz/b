Air.Module('B.scope.ScopeTreeManager', function(require) {
  var Scope = require('B.scope.Scope');

  /**
   *作用：节点管理器类
   *参数：根 scope数据对象
   *返回：节点管理器 API
   *TODO: 考虑改为单例模式
   **/
  function ScopeTreeManager(rootScope) {
    var scopeTree = []; // scope 栈
    var scopeMap = {};
    var getStructure = function() {
      return {
        scope: null,
        // mScope : null,
        pn: null, // parent scope index
        name: null
      };
    };

    var getScope = function(index) {
      return scopeTree[index] || null;
    }

    /**
     *作用：更新根scope
     *参数：scope 新数据对象
     *返回：undefind
     **/
    var setRootScope = function(scope) {
      var rootScope = scopeTree[0] || getStructure();
      rootScope.scope = rootScope.scope || {};
      beacon.utility.merge(rootScope.scope, scope);
      scopeTree[0] = rootScope;
      scopeTree['root'] = rootScope;
    }

    /**
     *作用：生成新的scope结构，该结构内含 scope 及 对应的中间scope（mscope）
     *参数：父级scope结构的索引值
     *返回：生成的scope结构的索引值
     **/
    var addScope = function(parentIndex, scopeName) {
      var parentScopeStructure = getScope(parentIndex)||getScope(0);
      var newScope = getStructure();
      scopeTree[scopeName] = newScope;
      var scopeIndex = scopeTree.push(newScope) - 1;
      newScope.scope = new Scope(parentScopeStructure.scope);
      newScope.pn = parentIndex;
      newScope.name = scopeName;
      newScope.index = scopeIndex;
      scopeMap[scopeName] = newScope;
      // return scopeIndex;
      return scopeName;
    }

    var getScopeByName = function(scopeName) {
      return scopeMap[scopeName];
    }

    var getScopeInstanceByName = function(scopeName) {
      var scopeStructure = scopeMap[scopeName] || {};
      return scopeStructure.scope;
    }

    // 初始化根 scope
    setRootScope(rootScope);

    var api = {
      addScope: addScope,
      getScope: getScope,
      getScopeByName: getScopeByName,
      getScopeInstanceByName: getScopeInstanceByName,
      setRootScope: setRootScope
    };

    return api;
  }

  return ScopeTreeManager;
});
