Air.Module('B.scope.ScopeTreeManager', function(require:any) {
  var Scope = require('B.scope.Scope');

  /**
   *作用：节点管理器类
   *参数：根 scope数据对象
   *返回：节点管理器 API
   *TODO: 考虑改为单例模式
   **/
  class ScopeTreeManager {
    private scopeMap:Dictionary = {};
    private rootScope:any;


    constructor(rootScope:any={}){
      let scopeStructure= ScopeTreeManager.getStructure();
      scopeStructure.scope = rootScope;
      this.rootScope = scopeStructure;
    }
    
    static getStructure ():any {
      return {
        scope: null,
        // mScope : null,
        pn: null, // parent scope index
        name: null
      };
    };

    public getScope (scopeName:string) {
      return this.getScopeByName(scopeName);
    }

    public getRoot(){
      return this.rootScope;
    }

    /**
     *作用：更新根scope
     *参数：scope 新数据对象
     *返回：undefind
     **/
    public setRootScope (scope:any) {
      this.rootScope.scope = scope;
    }

    /**
     *作用：生成新的scope结构，该结构内含 scope 及 对应的中间scope（mscope）
     *参数：父级scope结构的索引值
     *返回：生成的scope结构的索引值
     **/
    public addScope(parentName:string, scopeName:string) {
      let parentScopeStructure = this.getScope(parentName) || this.rootScope;
      let newScope = ScopeTreeManager.getStructure();
      this.scopeMap[scopeName] = newScope;
      // var scopeIndex = scopeTree.push(newScope) - 1;
      newScope.scope = new Scope(parentScopeStructure.scope);
      newScope.pn = parentName;
      newScope.name = scopeName;
      // newScope.index = scopeIndex;
      // return scopeIndex;
      return scopeName;
    }

    public getScopeByName (scopeName:string) {
      return this.scopeMap[scopeName];
    }

    public getScopeInstanceByName (scopeName:string) {
      let scopeStructure = this.getScope(scopeName) || {};
      return scopeStructure.scope;
    }

  }

  return ScopeTreeManager;
});
