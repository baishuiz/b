Air.Module("B.view.View", function(require:Function){
  let scopeManager = require('B.scope.scopeManager');
  let EVENTS =  require('B.event.events');

  // window.statsEvents || (window.statsEvents = {});
  // statsEvents.PAGE_SHOW = EVENTS.PAGE_SHOW;
  // statsEvents.PAGE_HIDE = EVENTS.PAGE_HIDE;


  class View{
    private dom:Element;
    private viewName : string
  
    constructor(viewName:string, dom:string, options:Dictionary);
    constructor(viewName:string, dom:Element, options:Dictionary);
    constructor(viewName:any, dom:any, options:any={}){
      this.viewName = viewName;
      // TODO 本地模板需要解析script上的{{}}
      if (beacon.isType(dom, 'String')) {
        let domWrapper = View.createDomByString(dom);
        this.dom = domWrapper.querySelector(`view[name="${viewName}"]`);

        View.parseTag('style', viewName, domWrapper, function(tagList:NodeListOf<HTMLStyleElement>){
          View.loadStyle(tagList, dom);
        });
        View.parseTag('script', viewName, domWrapper, function(tagList:NodeListOf<HTMLScriptElement>){
          View.loadScript(tagList, dom, options.initCallback);
        });
      } else {
        this.dom = dom;
      }      
    };
    


    private template: string;
    private router : any;
    private initQueue : number[] = [];
    private showBeforeQueue : number[] = [];
    private showAfterQueue : number[] = [];
    private hideQueue :number[] = [];
    public events = {
          onShow: beacon.createEvent('view onShow'),
          onHide: beacon.createEvent('view onHide')
        };

    // beacon(this).on(events.onShow, function () {
    //   beacon.on(statsEvents.PAGE_SHOW, [location.href, viewName]);
    // });
    // beacon(this).on(events.onHide, function () {
    //   beacon.on(statsEvents.PAGE_HIDE, [location.href, viewName]);
    // });


    static createDomByString(templateString:string){
      var div = document.createElement('div');
      if(typeof DOMParser === 'undefined'){
        div.innerHTML = 'X<div></div>' + templateString; // 兼容 IE8
      } else {
        div.innerHTML = templateString;
      }
      return div;
    }
  
    static loadStyle(styleList:NodeList, dom:Element) {
      for (let i = 0, len = styleList.length; i < len; i++) {
        let style = styleList[i];
        dom.appendChild(style);
      }
    }
  
  
    static loadScript(scriptList:NodeListOf<HTMLScriptElement>, dom:Element, fn:Function) {
      setTimeout(function(){ // 兼容IE8 本地缓存造成的执行顺序bug
        View.runJS(scriptList, dom);
      },0)
      fn && fn();
    }
  
    static runJS(scripts:NodeListOf<HTMLScriptElement>, dom:Element){
      for (let scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
        var activeScript:HTMLScriptElement = scripts[scriptIndex];
        var tmpScript = document.createElement('script');
        var src = activeScript.src;
  
        // TODO loadJS 会检查相同url的则不重新加载
        // 不知为什么 loadJS 的时候该 view 的 dom 已经被插入了页面
        // 所以先给移除掉，后续再排查
        activeScript.parentNode && activeScript.parentNode.removeChild(activeScript);
  
        if (src) {
          Air.loadJS(src);
        } else {
          tmpScript.text = activeScript.text;
          dom.appendChild(tmpScript);
        }
      };
    }
  
    static splitDom(domWrapper:HTMLElement, cssSelector:string){
      var elements:NodeList = domWrapper.getElementsByTagName(cssSelector);
      elements = [].concat.apply([], elements)//[].slice.call(elements); //兼容 IE8
      return elements
    }
  
    static parseTag(tagName:string, viewName:string, domWrapper:HTMLElement, fn:Function) {
      let domList:NodeList = View.splitDom(domWrapper, tagName);
      domList = [].concat.apply([], domList);
  
      for (var i = 0; i < domList.length; i++) {
        // TODO : scope 命名 修改为 viewName::tagname 以 避免与view命名冲突
        var needScope = true;
        var tagScope = scopeManager.parseScope(viewName + tagName, domList[i], needScope);
        fn && fn(domList);
      }
    }

    
    public show = function (){
      this.dom.setAttribute('active','true');

      // IE8 不渲染
      // if(typeof DOMParser === 'undefined'){
      //   dom.style.borderBottom = '1px solid transparent';
      //   setTimeout(function(){
      //     dom.style.borderBottom = 'none';
      //   }, 0);
      // }
    };

    public hide = function(){
      this.dom.removeAttribute('active');
    };

    public getDom = function (){
      return this.dom;
    };

    public getViewName (){
      return this.viewName;
    };


    public parseSrc (){
      let els:NodeListOf<Element> = this.dom.querySelectorAll('[b-src]');
      if (!els) {return;}
      for (let i = 0, len = els.length; i < len; i++) {
        let el = els[i];
        let src = el.getAttribute('b-src');
        if (src) {
          el.setAttribute('src', src);
        }
      }
    };

  }

  return View;

});
