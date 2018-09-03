Air.Module('B.scope.scopeManager', function(require:any) {
  let rootScope = {};
  let ScopeTreeManager = require('B.scope.ScopeTreeManager');
  let initModel = require('B.directive.model');
  let eventDirective = require('B.directive.event');
  let showDirective = require('B.directive.show');
  let existDirective = require('B.directive.exist');
  let styleDirective = require('B.directive.style');
  let propertyDirective = require('B.directive.property');
  let Repeater = require('B.directive.Repeater');
  let tagManager = require('B.scope.tagManager');

  let util = require('B.util.util');
  let nodeUtil = require('B.util.node');
  let memCache = require('B.data.memCache');

  let scopeTreeManager = new ScopeTreeManager();


  function isView(node:any) {
    let isHTMLElement = util.isHTML(node);
    return isHTMLElement && (node.nodeName.toUpperCase() == 'VIEW');
  }

  function isRepeat(node:any) {
    let isHTMLElement = util.isHTML(node);
    return isHTMLElement && (node.hasAttribute('b-repeat'));
  }

  // DOM 树遍历回溯栈
  let backtrackingPoints:Array<any> = [];

  /**
   *作用：获取模板标签
   *参数: <content> 文本节点值/属性节点值
   *返回：array  模板标签列表
   **/
  // function getDataPath(content) {
  //   return content.match(/{{.+?}}/g) || [];
  // }

  /**
   *作用：监听文本节点或属性节点的数据源变动
   *参数: <dataPath> 数据源路径（有效 token）
   *参数: <currentScopeIndex> 当前作用域索引值
   *返回：undefined
   **/
  function bindObjectData(dataPath:string, currentScopeIndex:number, callback?:Function) {
    let scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
    let scope = scopeStructure.scope
    let activePath = '';
    // dataPath = dataPath.replace(/\.\d+$/,'')
    let pathNodes = dataPath.split('.') || [];
    for (let i = 0; i < pathNodes.length; i++) {
      // let nextPathNode = pathNodes.shift();
      let nextPathNode = pathNodes[i];
      let activeObj = activePath ? util.getData(activePath, scope) : scope;
      activeObj = activeObj || Air.NS(activePath, scope);
      let nextObj = nextPathNode && util.getData(nextPathNode, activeObj);

      nextPathNode && (!(Object.getOwnPropertyDescriptor(activeObj, nextPathNode) && Object.getOwnPropertyDescriptor(activeObj, nextPathNode).set) || /^\d+$/.test(nextPathNode) || (i === pathNodes.length - 1)) &&
        Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex, callback));
      activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
    }
  }

  /**
   *作用：获得有效 token 列表
   *参数: <tag> 数据标签
   *返回：有效 token 列表
   **/
  function getTokens(tag:any, node:any, scopeIndex:number) {
    node.$template = node.$template || node.nodeValue;
    let scope = scopeTreeManager.getScope(scopeIndex);
    // let tokens = tag.match(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g) || [];
    let tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
    let result = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = util.trim(tokens[i]);
      if (!(/^\d+$/.test(token) || /^['"]/.test(token) || token == '' || token === 'true' || token === 'false')) {
        let tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')', 'g');
        let lastTagStr = (node.$tag || tag);
        let tagStr = lastTagStr.replace(tokenReg, function($0:string, $1:string, $2:string) {
          if ($0.indexOf('util.getData("' + token) >= 0) {
            return $0
          } else {
            return $0.replace($2, 'util.getData("' + token + '", scope)')
          }
        });
        node.$template = node.$template.replace(lastTagStr, tagStr);
        node.$tag = tagStr;

        result.push(token);
      }
    }
    if (result.length === 0) {
      node.$tag = tag;
    }
    return result;
  }

  function tryGenerateSubViewScope(node:any, scopeStructure:any) {
    if (node.tagName.toLowerCase() === 'view') {
      let scopeKey = node.getAttribute('b-scope-key');
      let viewName = node.getAttribute('name');
      let subScopeName = scopeKey || viewName;
      // let subScope = scopeTreeManager.getScopeByName(subScopeName);
      let subScope = scopeStructure.scope;
      let currentScopeName = scopeStructure.name;
      if (!subScope) {
        let subScopeIndex = scopeTreeManager.addScope(currentScopeName, subScopeName);
        subScope = scopeTreeManager.getScope(subScopeIndex);
      }

      if (scopeKey) {
        let controllerMap = memCache.get('controllerMap') || {};
        let controller = controllerMap[viewName];

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
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <value> 模板标签初始值.
   *参数: <dataPath> 数据路径（标签模板内的有效 token）
   *参数: <scope> 当前标签所在的作用域id.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(value:any, dataPath:any, scopeIndex:any, callBack:Function) {
    let scope = scopeTreeManager.getScope(scopeIndex);
    let oldLength = 0;

    let descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
       let isArray = beacon.utility.isType(value, 'Array');
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

      set: function(val:any) {
        let hasChanged = value !== val;
        let isArray = beacon.utility.isType(val, 'Array');
        let isObject = beacon.utility.isType(val, 'Object');
        let isPathNode = isArray || isObject;
        if (hasChanged && isPathNode) {
          value = value || (isArray　? [] : {});
          if (isArray) {
            let oldLen = value.length;
            let newLen = val.length;

            if (newLen < oldLen) {
              value.splice(newLen - oldLen, oldLen - newLen);
            }
          }

          if(isObject){
            for(let aa in value){
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
    }
    return descriptor;
  }
  beacon.on('updateObjectData', function(e:any, args:any){
    bindObjectData(args.dataPath, args.currentScopeIndex);
    // args.callback && args.callback();
  })

  class ScopeManager{
    public getScope:Function = (scopeName:string) => {
      return scopeTreeManager.getScopeByName(scopeName)
    };

    public setRoot:Function = (scope:any)=>{
      return scopeTreeManager.setRootScope(scope)
    };
    public getScopeInstance:Function =  (scopeName:string) =>{
      return scopeTreeManager.getScopeInstanceByName(scopeName)
    };

    /**
     *作用：get scope of view
      *参数: <viewName>  name of view element
      *参数: <viewElement> view element
      *参数: [needScope] 解析模板时是否生成 scop 对象
      *返回：undefind
      **/
    public parseScope(viewName:string, viewElement:HTMLElement, needScope?:boolean) {
      let scopeStructure = scopeTreeManager.getScopeByName(viewName);
      
      if (!scopeStructure) {
        this.parseTemplate(viewElement, viewName);
        scopeStructure = scopeTreeManager.getScopeByName(viewName) || {};
      }
      return scopeStructure.scope;
    }

    /**
     *作用：监听文本节点|属性节点的数据变化
      *参数: <tag>  数据标签
      *参数: <node> 文本节点|属性节点
      *参数: <scopeIndex> 数据标签所在作用域索引值
      *返回：undefind
      **/
    public watchData(tag:any, node:any, scopeIndex:any, callback?:Function, callbackNow?:boolean){
      let scope = scopeTreeManager.getScope(scopeIndex);
      let tokens = getTokens(tag, node, scopeIndex);
      for(let i = 0; i < tokens.length; i++){
        let activeToken = tokens[i];
        callback && callbackNow && callback(util.getData(activeToken, scope.scope));
        tagManager.addNode(scopeIndex, activeToken, node, callback);
        bindObjectData(activeToken, scopeIndex, callback);
      }
    }    

    /**
     *作用：解析文本|属性节点，监听数据变化
    *参数: <node> 文本节点|属性节点
    *参数: <currentScopeIndex> 数据标签所在作用域索引值
    *返回：undefind
    **/
    private parseTEXT(node:any, currentScopeIndex:any) {
      let tags = node.nodeValue.match(/{{.*?}}/g) || [];
      let scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
      let scope = scopeStructure.scope;

      // 遍历节点内所有数据标签
      for (let i = 0; i < tags.length; i++) {
        let activeTag = tags[i];
        this.watchData(activeTag, node, currentScopeIndex);
        if (node.$tag) {
          let val = eval(node.$tag.replace(/(^{{)|(}}$)/g, '')) || '';
          node.nodeValue = node.nodeValue.replace(activeTag, val);
          node.$tag = '';
        }
        
      }
    }    

    /**
     *作用：遍历属性节点
    *参数: <node> HTML引用.
    *参数: <currentScopeIndex> 当前作用域索引值.
    *返回：undefind
    **/
    private parseHTML(node:HTMLElement, currentScopeName:string) {
      let scopeStructure = scopeTreeManager.getScope(currentScopeName) || scopeTreeManager.getRoot();;
      tryGenerateSubViewScope(node, scopeStructure);
      let scope = scopeStructure.scope;
      existDirective(node, scopeStructure, this.watchData)
      if (!node.parentElement) {
        return;
      }
      initModel(node, scopeStructure, this.watchData);
      eventDirective(node, scope);
      showDirective(node, scopeStructure, this.watchData);
      styleDirective(node, scopeStructure, this.watchData);
      propertyDirective(node, scopeStructure, this.watchData);

      let attributes = [].concat.apply([], node.attributes);
      for (let i = 0; i < attributes.length; i++) {　
        let activeAttribute = attributes[i];
        if ([initModel.key, showDirective.key].indexOf(activeAttribute.name) !== -1) {
          continue;
        }
        this.parseTEXT(activeAttribute, currentScopeName);
      }
    }


    
    private parseViewElement(view:HTMLElement):Node{
      
      return view.lastChild;
    }

    /**
    *作用：模板解析
    *参数: <node> 模板引用.
    *参数: [currentScopeIndex] 模板当前所处作用域索引值. 默认值 = 0 
    *返回：undefind
    **/
    private parseTemplate(rootElement:HTMLElement,currentScopeName:string='root', ...other:Array<any>){
      // let treeWalker = document.createTreeWalker(rootElement);
      let nodeIterator = document.createNodeIterator(rootElement, NodeFilter.SHOW_ALL);
      // let treeWalker = [].concat.apply(rootElement,rootElement.querySelectorAll("*"));
      let scopeList:Array<string> = [];
      let lastViewEndElement:Array<Node> = [];
      let currentNode = rootElement;
      // let index:number = 0;
      do {
        // let currentNode:HTMLElement = (<HTMLElement>treeWalker.currentNode);
        // let currentNode = (<HTMLElement>treeWalker[index]);
        if(isView(currentNode)) {
          scopeList.push(currentScopeName);
          let lastChildElement = currentNode.lastChild;
          lastChildElement && lastViewEndElement.push(lastChildElement);

          currentScopeName = currentNode.getAttribute('b-scope-key') || currentNode.getAttribute('name');
          let parentScopName:string = scopeList[scopeList.length-2];
          scopeTreeManager.addScope(parentScopName, currentScopeName);
        } else if (isRepeat(currentNode)) {
          let nextSibling = currentNode.nextSibling;
          let repeatNode = this.createRepeatNodes(currentNode, currentScopeName);
          if(repeatNode) {
            for (let nodeIndex = 0; nodeIndex < repeatNode.length; nodeIndex++) {
              const element = repeatNode[nodeIndex];
              this.parseTemplate(element,currentScopeName);
            }
          }
        }
        

        switch (currentNode.nodeType) {
          case nodeUtil.type.HTML:
            this.parseHTML(currentNode, currentScopeName);
            break;
          case nodeUtil.type.TEXT:
          case nodeUtil.type.ATTR:
            this.parseTEXT(currentNode, currentScopeName);
            break;
          default:
        }

        if(lastViewEndElement[lastViewEndElement.length-1] === currentNode) {
          lastViewEndElement.pop();
          currentScopeName = scopeList.pop();
        }

        // index++;
        // let result = treeWalker[index] && treeWalker[index].outerHTML
      } while(currentNode = <HTMLElement>nodeIterator.nextNode())

      

    }

 
    /**
     *作用：基于 repeat 模板生成对应 UI元素
    *参数: <template> repeat模板引用.
    *参数: <scope> 当前 repeat 元素所处的作用域.
    *返回：使用 repeat 模板生成的第一个元素
    **/
    private createRepeatNodes(template:any, currentScopeIndex:any) {
      let scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
      let parseTemplateProxy = (node:any, scopeName:any, currentScopeIndex:any, isSub:any, needScope?:any) => {
        this.parseTemplate(node, scopeName, currentScopeIndex,isSub, needScope);
      }
      let repeater = new Repeater(template, currentScopeIndex, scopeStructure, parseTemplateProxy);
      let newNodes = repeater.updateUI();
      // let newFirstNode = repeater.updateUI()[0];
      // return newFirstNode;
      return newNodes;
    }

  }
  return new ScopeManager();
});
