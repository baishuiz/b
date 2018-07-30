Air.Module("B.view.viewManager", function(require:Function){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var HTTP   = require('B.network.HTTP');
  var memCache = require('B.data.memCache');
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');
  var middleware = require('B.util.middleware');




  let loading:Dictionary = {
    loadingHandle  : null, // handle 须实现接口【Iloading】 show() & hide()

    showLoading : function (){
                    loading.loadingHandle && loading.loadingHandle.show();
                  },

    hideLoading :function (){
                   loading.loadingHandle && loading.loadingHandle.hide();
                  },

    setLoading : function(handle:Function){
                   loading.loadingHandle = handle
                 },

    unsetLoading : function(){
                  loading.loadingHandle = null
                }
  }


  class ViewManager {
      public loading:Dictionary = loading;
      private mainViewport:viewport;
      private activeView:View;
      private templateCache:Dictionary;
      private loadingViewList:any=[]; // 正在加載中的view
      private lastView:View;
      
      private setMainViewport(viewport:viewport):void{
        this.mainViewport = viewport;
      }

      private initLocalView(viewport:viewport):void{
        let viewportElement:Element = viewport.dom;
        let views:HTMLCollection = viewportElement.children;
        let viewCount:number = views.length;
        for(let viewIndex:number = 0; viewIndex < viewCount; viewIndex++){
          let activeView:Element = views[viewIndex];
          if (activeView.tagName.toLowerCase() === 'view') {
            let activeViewName:string = activeView.getAttribute('name');
            let view = new View(activeViewName, activeView);
            viewport.views[activeViewName] = view;
            scopeManager.parseScope(activeViewName, view.getDom());
          }
        }
      }

      private getViewByViewName(viewName:string):View{
        return this.mainViewport.views[viewName];
      }

      private appendView(viewName:string, view:View) {
        this.mainViewport.dom.appendChild(view.getDom());
        this.mainViewport.views[viewName] = view;
      }

      

      private changeURLParams(viewName:string, options:Dictionary = {}) {
        if(options.isComponent){return;} // 全屏组件不切换 URL，也不需要更新URL参数
        var $scope = scopeManager.getScopeInstance(viewName);
        $scope['$request'] = $scope.$request || {};
        $scope.$request.params = options.params;
      }
    
      private getURL (viewName:string, options:Dictionary) {
        var url = router.getURLPathByViewName(viewName, {
          params: options.params,
          query: options.query,
          hash: options.hash
        });
    
        return url;
      }
    
      private switchURL (viewName:string, options:Dictionary = {}) {
        if(options.isComponent){return;} // 全屏组件不切换 URL
        var url = this.getURL(viewName, options);
    
        // 不支持pushState则跳转。后续是否考虑锚点方案？
        var isReplace = options.replace;
        if (history.pushState && history.replaceState){
          var changeURLState = isReplace ? history.replaceState : history.pushState;
          changeURLState && changeURLState.call(history, {
            viewName: viewName,
            params: options.params,
            hash: options.hash
          }, viewName, url);
        } else {
          if (isReplace) { // 初始化不进行跳转，否则会循环跳转
            !options.init && location.replace(url);
          } else {
            location.href = url;
          }
        }
    
        this.runURLChangeMiddleWare();
      }
    
      private runURLChangeMiddleWare() {
        var fnName = 'afterURLChange';
        middleware.run(fnName);
      }
    
      private listenURLChange() {
        beacon(window).on('popstate', (e:any)=>{
          var state  = e.state || {};
          this.saveLastView();
          if (state.viewName) {
            var hasView = this.getViewByViewName(state.viewName);
            if (hasView) {
              this.changeURLParams(state.viewName, state);
              this.show(state.viewName);
              this.runURLChangeMiddleWare();
            } else {
              var URLPath = location.pathname;
              var activeRouter = router.getMatchedRouter(URLPath);
              if (activeRouter) {
                this.goTo(activeRouter.viewName, {
                  replace: true,
                  params: activeRouter.params,
                  query: location.search,
                  hash: location.hash
                });
              } else {
                this.throw404();
              }
            }
          }
        });
      }
    
    
      private show (viewName:string){
        var view:View = this.getViewByViewName(viewName);
        if (view) {
          view.parseSrc();
          this.switchView(view);
        } else {
          this.throw404();
        }
      }
    
    
      private throw404(){
        var fnName = 'viewNotFound';
        middleware.run(fnName);
      };
    
    
    
      private saveLastView() {
        this.lastView = this.getActive();
      }
    
      private setActive(view: View) {
        this.activeView = view;
      }
    
      private switchView(view:View){
        var lastViewName = '';
        // 7
        if (this.lastView) {
          lastViewName = this.lastView.getViewName();
          this.triggerOnHide(this.lastView, view);
        }
    
        this.setActive(view);
    
        this.activeView.show();
        this.triggerOnShow(this.activeView, lastViewName);
        loading.hideLoading();
      }
    
      private triggerOnHide(curView:View, toView:View) {
        var viewName = curView.getViewName();
        curView && curView.hide();
        beacon(curView).on(curView.events.onHide, {
          to: toView
        });
        var $scope = scopeManager.getScopeInstance(viewName);
        beacon($scope).on(EVENTS.DATA_CHANGE);
      }
    
      private triggerOnShow(curView:View, lastViewName:string) {
        let viewName:string = curView.getViewName();
        // loading.showLoading();
        if (viewName !== lastViewName) {   // 解决hash值问题
          beacon(curView).on(curView.events.onShow, {
            from: lastViewName
          });
        }
    
    
        var $scope = scopeManager.getScopeInstance(viewName);
        beacon($scope).on(EVENTS.DATA_CHANGE);
      }      
    
      // TODO : 支持多Viewport
      private initLocalViewport():void {
        let viewportList:Array<viewport>=[];
        let viewports:NodeListOf<Element> = document.querySelectorAll('viewport');
        let viewportCount:number = viewports.length
        for(let viewportIndex:number = 0; viewportIndex < viewportCount; viewportIndex++){
          let activeViewportElement:Element = viewports[viewportIndex];
          let isMainViewport = (activeViewportElement.getAttribute('main')==='true');
          let activeViewport:viewport = {
            'dom' : activeViewportElement,
            'views' : {}
          };
          viewportList.push(activeViewport);
          isMainViewport && this.setMainViewport(activeViewport);
          this.initLocalView(activeViewport);
        }
      }

      private loadView(viewName:string, options:Dictionary={}){
        loading.showLoading();
        var env = memCache.get('env');
        var curRouter = router.get(viewName);
        var sign = curRouter.sign || '';
        var extPath = sign ? '_' + sign : '';
        var templateBasePath = options.templatePath || env.$templatePath;
        var templatePath = templateBasePath + viewName + extPath + '.html';
        var http = new HTTP();
    

    
        let successCallBack = (xhr:XMLHttpRequest) => {
          var responseText = xhr.responseText;
          // 2
          var view = new View(viewName, responseText, {
            initCallback: function(){
              // loading.hideLoading();
            }
          });
          var scope = scopeManager.parseScope(viewName, view.getDom());
          this.changeURLParams(viewName, options);
          this.appendView(viewName, view);
    
          this.saveLastView();
          this.setActive(view);
    
          // 3
          beacon(scope).once(EVENTS.RUN_COMPLETE, ()=>{
            // 6
            this.switchURL(viewName, options);
            this.show(viewName);
    
            this.removeLoadingView(viewName);
    
          });
        }
    
        let errorCallBack =()=>{
          this.throw404();
        }

        http.get(templatePath, {
          successCallBack : successCallBack,
          errorCallBack : errorCallBack
        });        
      }
    

      private viewIsLoading(viewName:string):boolean {
        // return beacon.utility.arrayIndexOf(this.loadingViewList, viewName) === -1 ? false : true;
        return !this.loadingViewList.indexOf(viewName);

      }
    
      private addLoadingView(viewName:string) {
        var idx = beacon.utility.arrayIndexOf(this.loadingViewList, viewName);
        if (idx === -1) {
          this.loadingViewList.push(viewName);
        }
      }
    
      private removeLoadingView(viewName:string) {
        var idx = beacon.utility.arrayIndexOf(this.loadingViewList, viewName);
        if (idx !== -1) {
          this.loadingViewList.splice(idx, 1);
        }
      }      

      
     
      public goTo (viewName:string, options:Dictionary){
        let fnName:string = 'beforeGoTo';
        let paramObj:Dictionary = { viewName: viewName, options: options };
        // let that = this;
        var next = ()=>{
          var hasView = this.getViewByViewName(viewName);
          if (!this.viewIsLoading(viewName)) {
            if (hasView) {
              this.saveLastView();
              this.switchURL(viewName, options);
              this.changeURLParams(viewName, options);
              this.show(viewName);
            } else {
              this.addLoadingView(viewName);
              this.loadView(viewName, options);
            }
          }
        }
    
        // goTo 方法对外支持中间件，中间件参数为 paramObj
        middleware.run(fnName, paramObj, next);
      }  
      
      public jump (options:ViewJumpOptions) {
        let url:string = options.url || '';
        let projectPath:string = options.project || '';
        let urlPath:string = options.urlPath || '';
        let query:string = options.query || '';
        projectPath = projectPath.replace(/^\//, '');
        let reg:RegExp = new RegExp('^(\/)?(' + projectPath + '[\/|$])?');
        urlPath = urlPath.replace(reg, '');
    
        if (url) {
          location.href = url;
        } else {
          location.href = '/' + (projectPath || '') + '/' + (urlPath || '') + (query || '');
        }
      }  
      
      public back () {
        window.history.back();
      } 
      

      public addMiddleware (middlewareName:string, fn:Function):void {
        middleware.add(middlewareName, fn);
      }

      public removeMiddleware(middlewareName:string, fn:Function):void {
        middleware.remove(middlewareName, fn);
      }

      public getActive(){
        return this.activeView;
      }      

      public getScopeKeyByViewName(viewName:string):string {
        let dom:Element = this.activeView.getDom();
        let subViewDom:Element = dom.querySelector('view[name="' + viewName + '"]');
        return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
      }      

      public getTemplate(viewName:string, options:Dictionary={}):string {
        let env:Dictionary = memCache.get('env');
        let path:string = options.path || env.$templatePath;
        let templatePath:string = path + options.templatePath.replace(/\./g, '/') + '.html';
        let errorCallBack:Function =  options.errorCallBack || function(){};
        let template:string = this.templateCache[viewName];
        if(template) { return template};
        let http = new HTTP();
        http.get(templatePath, {
          successCallBack : function(xhr:XMLHttpRequest){
            let responseText = xhr.responseText;
            this.templateCache[viewName] = responseText;
            options.onSuccess && options.onSuccess(responseText);
          },
          errorCallBack : errorCallBack
        });
      }

      /**
       * 初始化首屏 View
       */
      public init(env:any){
        scopeManager.setRoot(env);
        this.initLocalViewport();
        let URLPath:string = location.pathname;
        let activeRouter = router.getMatchedRouter(URLPath);
        let hash:string = location.hash;
        if (activeRouter) {
          this.goTo(activeRouter.viewName, {
            replace: true,
            init: true,
            params: activeRouter.params,
            query: location.search,
            hash: hash
          });
        } else {
          this.throw404();
        }
        this.listenURLChange();
      }
  }
  return new ViewManager();
});
