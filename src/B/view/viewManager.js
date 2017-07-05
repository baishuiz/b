Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var HTTP   = require('B.network.HTTP');
  var memCache = require('B.data.memCache');
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');
  var middleware = require('B.util.middleware');
  var viewList = [],
      viewportList = [],
      loadingViewList = [], // 记载中的view
      activeView = null,
      mainViewport = null;
  var lastView = null;

  /**
   * 初始化首屏 View
   */
  function init(env){
    scopeManager.setRoot(env);
    initLocalViewport();
    var URLPath = location.pathname;
    var activeRouter = router.getMatchedRouter(URLPath);
    if (activeRouter) {
      goTo(activeRouter.viewName, {
        replace: true,
        init: true,
        params: activeRouter.params,
        query: location.search
      });
    } else {
      throw404();
    }
    listenURLChange();
  }

  // TODO : 支持多Viewport
  function initLocalViewport(){
    var viewports = document.querySelectorAll('viewport');
    var viewportIndex = 0;
    var viewportCount = viewports.length;
    for(; viewportIndex < viewportCount; viewportIndex++){
      var activeViewport = viewports[viewportIndex];
      var isMainViewport = (activeViewport.getAttribute('main')==='true');
      var activeViewportInfo = {
        dom : activeViewport,
        views : []
      };
      viewportList.push(activeViewportInfo);
      isMainViewport && setMainViewport(activeViewportInfo);
      initLocalView(activeViewportInfo);
    }
  }

  function appendView(viewName, view) {
    mainViewport.dom.appendChild(view.getDom());
    mainViewport.views[viewName] = view;
  }

  function setMainViewport(viewport){
    mainViewport = viewport;
  }

  function initLocalView(viewContainer){
    var viewport = viewContainer.dom;
    var views = viewport.children;
    var viewIndex = 0;
    var viewCount = views.length;
    for(; viewIndex < viewCount; viewIndex++){
      var activeView = views[viewIndex];

      if (activeView.tagName.toLowerCase() === 'view') {
        var activeViewName = activeView.getAttribute('name');
        var view = new View(activeViewName, activeView);
        viewContainer['views'][activeViewName] = view;
        scopeManager.parseScope(activeViewName, view.getDom());
      }
    }
  }



  function goTo (viewName, options){
    var fnName = 'beforeGoTo';
    var paramObj = { viewName: viewName, options: options };
    var next = function(){
      var hasView = getViewByViewName(viewName);
      if (!viewIsLoading(viewName)) {
        if (hasView) {
          saveLastView();
          switchURL(viewName, options);
          changeURLParams(viewName, options);
          show(viewName);
        } else {
          addLoadingView(viewName);
          loadView(viewName, options);
        }
      }
    }

    // goTo 方法对外支持中间件，中间件参数为 paramObj
    middleware.run(fnName, paramObj, next);
  }

  function viewIsLoading(viewName) {
    return beacon.utility.arrayIndexOf(loadingViewList, viewName) === -1 ? false : true;
  }

  function addLoadingView(viewName) {
    var idx = beacon.utility.arrayIndexOf(loadingViewList, viewName);
    if (idx === -1) {
      loadingViewList.push(viewName);
    }
  }

  function removeLoadingView(viewName) {
    var idx = beacon.utility.arrayIndexOf(loadingViewList, viewName);
    if (idx !== -1) {
      loadingViewList.splice(idx, 1);
    }
  }

  function changeURLParams(viewName, options) {
    options = options || {};

    if(options.isComponent){return;} // 全屏组件不切换 URL，也不需要更新URL参数
    var $scope = scopeManager.getScopeInstance(viewName);
    $scope['$request'] = $scope.$request || {};
    $scope.$request.params = options.params;
  }

  function getURL (viewName, options) {
    var url = router.getURLPathByViewName(viewName, {
      params: options.params,
      query: options.query
    });

    return url;
  }

  function switchURL (viewName, options) {
    options = options || {};
    if(options.isComponent){return;} // 全屏组件不切换 URL
    var url = getURL(viewName, options);

    // 不支持pushState则跳转。后续是否考虑锚点方案？
    var isReplace = options.replace;
    if (history.pushState && history.replaceState){
      var changeURLState = isReplace ? history.replaceState : history.pushState;
      changeURLState && changeURLState.call(history, {
        viewName: viewName,
        params: options.params
      }, viewName, url);
    } else {
      if (isReplace) { // 初始化不进行跳转，否则会循环跳转
        !options.init && location.replace(url);
      } else {
        location.href = url;
      }
    }

    runURLChangeMiddleWare();
  }

  function runURLChangeMiddleWare() {
    var fnName = 'afterURLChange';
    middleware.run(fnName);
  }

  function listenURLChange() {
    beacon(window).on('popstate', function(e){
      var state  = e.state || {};
      saveLastView();
      if (state.viewName) {
        var hasView = getViewByViewName(state.viewName);
        if (hasView) {
          changeURLParams(state.viewName, state);
          show(state.viewName);
          runURLChangeMiddleWare();
        } else {
          var URLPath = location.pathname;
          var activeRouter = router.getMatchedRouter(URLPath);
          if (activeRouter) {
            goTo(activeRouter.viewName, {
              replace: true,
              params: activeRouter.params,
              query: location.search
            });
          } else {
            throw404();
          }
        }
      }
    });
  }

  function back () {
    window.history.back();
  }

  function show (viewName){
    var view = getViewByViewName(viewName);
    if (view) {
      view.parseSrc();
      switchView(view);
    } else {
      throw404();
    }
  }


  function throw404(){
    var fnName = 'viewNotFound';
    middleware.run(fnName);
  };

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function getScopeKeyByViewName(viewName) {
    var dom = activeView.getDom();
    var subViewDom = dom.querySelector('view[name="' + viewName + '"]');
    return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
  }

  //加载模板信息
  var templateCache = {};
  function getTemplate(viewName, options){
    options = options || {};
    var env = memCache.get('env');
    var path = options.path || env.$templatePath;
    var templatePath = path + options.templatePath.replace(/\./g, '/') + '.html';
    var errorCallBack =  options.errorCallBack || function(){};
    if(templateCache[viewName]) { return templateCache[viewName]};
    var http = new HTTP();
    http.get(templatePath, {
      successCallBack : function(xhr){
        var responseText = xhr.responseText;
        templateCache[viewName] = responseText;
        options.onSuccess && options.onSuccess(responseText);
      },
      errorCallBack : errorCallBack
    });
  }

  function loadView(viewName, options){
    options = options || {};
    loading.showLoading();
    var env = memCache.get('env');
    var curRouter = router.get(viewName);
    var sign = curRouter.sign || '';
    var extPath = sign ? '_' + sign : '';
    var templateBasePath = options.templatePath || env.$templatePath;
    var templatePath = templateBasePath + viewName + extPath + '.html';
    var http = new HTTP();

    http.get(templatePath, {
      successCallBack : successCallBack,
      errorCallBack : errorCallBack
    });

    function successCallBack(xhr){
      var responseText = xhr.responseText;
      // 2
      var view = new View(viewName, responseText, {
        initCallback: function(){
          // loading.hideLoading();
        }
      });
      var scope = scopeManager.parseScope(viewName, view.getDom());
      changeURLParams(viewName, options);
      appendView(viewName, view);

      saveLastView();
      setActive(view);

      // 3
      beacon(scope).once(EVENTS.RUN_COMPLETE, function(){
        // 6
        switchURL(viewName, options);
        show(viewName);

        removeLoadingView(viewName);

      });
    }

    function errorCallBack(){
      throw404();
    }
  }

  function saveLastView() {
    lastView = getActive();
  }

  function setActive(view) {
    activeView = view;
  }

  function switchView(view){
    var lastViewName = '';
    // 7
    if (lastView) {
      lastViewName = lastView.getViewName();
      triggerOnHide(lastView, view);
    }

    setActive(view);

    activeView.show();
    triggerOnShow(activeView, lastViewName);
    loading.hideLoading();
  }

  function triggerOnHide(curView, toView) {
    var viewName = curView.getViewName();
    curView && curView.hide();
    beacon(curView).on(curView.events.onHide, {
      to: toView
    });
    var $scope = scopeManager.getScopeInstance(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function triggerOnShow(curView, lastViewName) {
    var viewName = curView.getViewName();
    // loading.showLoading();
    beacon(curView).on(curView.events.onShow, {
      from: lastViewName
    });

    var $scope = scopeManager.getScopeInstance(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function getActive(){
    return activeView;
  }

  var loading = {
    loadingHandle : null, // handle 须实现接口【Iloading】 show() & hide()

    showLoading : function (){
                    loading.loadingHandle && loading.loadingHandle.show();
                  },

    hideLoading :function (){
                   loading.loadingHandle && loading.loadingHandle.hide();
                  },

    setLoading : function(handle){
                   loading.loadingHandle = handle
                 },

    unsetLoading : function(){
                  loading.loadingHandle = null
                }
  }

  var api = {
    init : init,
    goTo : goTo,
    back : back,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    // showLoading : loading.showLoading,
    // hideLoading : loading.hideLoading,
    loading : loading,
    getActive : getActive,
    getScopeKeyByViewName: getScopeKeyByViewName,
    getTemplate : getTemplate

  }

  return api;
});
