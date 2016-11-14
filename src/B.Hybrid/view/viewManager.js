Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var HTTP   = require('B.network.HTTP');
  var memCache = require('B.data.memCache');
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');
  var middleware = require('B.util.middleware');
  var bridge = require('B.bridge');
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
    var URLPath, query;
    if (bridge.isHybrid) {
      URLPath = location.hash.replace(/^#/, '') || '/';
      var URLPathAry = URLPath.split('?');
      URLPath = URLPathAry[0];
      query = URLPathAry[1] ? '?' + URLPathAry[1] : '';
    } else {
      URLPath = location.pathname;
      query = location.search;
    }
    var activeRouter = router.getMatchedRouter(URLPath);
    listenNativeAppear(function(){
      if (activeRouter) {
          goTo(activeRouter.viewName, {
            replace: true,
            init: true,
            params: activeRouter.params,
            query: query
          });
      } else {
        throw404();
      }
    });
    listenURLChange();
  }

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
        var view = new View(activeViewName, activeView)
        viewContainer['views'][activeViewName] = view;
        scopeManager.parseScope(activeViewName, view.getDom());
      }
    }
  }



  function goTo (viewName, options){
    var fnName = 'beforeGoTo';
    var url = getURL(viewName, options);
    var paramObj = { viewName: viewName, options: options, url: url };
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
    return loadingViewList.indexOf(viewName) === -1 ? false : true;
  }

  function addLoadingView(viewName) {
    var idx = loadingViewList.indexOf(viewName);
    if (idx === -1) {
      loadingViewList.push(viewName);
    }
  }

  function removeLoadingView(viewName) {
    var idx = loadingViewList.indexOf(viewName);
    if (idx !== -1) {
      loadingViewList.splice(idx, 1);
    }
  }

  function changeURLParams(viewName, options) {
    options = options || {};
    var $scope = scopeManager.getScope(viewName);
    $scope['$request'] = $scope.$request || {};
    $scope.$request.params = options.params;
  }

  function getURL (viewName, options) {
    options = options || {}
    var url = router.getURLPathByViewName(viewName, {
      params: options.params,
      query: options.query,
      noOrigin: true
    });

    return url;
  }

  function switchURL (viewName, options) {
    options = options || {};
    var fromUrl = location.href;
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


    var fnName = 'afterURLChange';
    var paramObj = {
      from: fromUrl,
      to: url
    };
    // switchURL 方法对外支持中间件，中间件参数为 paramObj
    middleware.run(fnName, paramObj);
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

  function show (viewName){
    var view = getViewByViewName(viewName);
    if (view) {
      view.parseSrc();
      switchView(view);
    } else {
      throw404();
    }
  }

  function hideNativeLoading() {
    bridge.run('hideloading');
  }


  function throw404(){
    var fnName = 'viewNotFound';
    middleware.run(fnName);
    hideNativeLoading();
  };

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function getScopeKeyByViewName(viewName) {
    var dom = activeView.getDom();
    var subViewDom = dom.querySelector('view[name="' + viewName + '"]');
    return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
  }

  function loadView(viewName, options){
    showLoading();
    var env = memCache.get('env');
    var curRouter = router.get(viewName);
    var sign = curRouter.sign || '';
    var extPath = sign ? '_' + sign : '';
    var templatePath = env.$templatePath + viewName + extPath + '.html';
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
          hideLoading();
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
        hideNativeLoading();
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
  }

  /**
  * 监听Native appear
  */
  var isNativeAppearInit = true;
  function listenNativeAppear(initCallback) {
    bridge.run('appear', {
      callback: bridge.register('appear', function(){
        if (isNativeAppearInit) {
          isNativeAppearInit = false;
          initCallback && initCallback();
        } else {
          viewAppear();
        }
      }, { keepCallback: true })
    }, {
      unified: false
    });
  }

  /**
  * Native appear 后执行 view onShow
  */
  function viewAppear() {
    var params = {
      viewName: activeView.getViewName()
    };
    runOnAppear(params, function() {
      activeView.show();
      triggerOnShow(activeView);
    });
  }

  function triggerOnHide(curView, toView, noHide) {
    var viewName = curView.getViewName();
    !noHide && curView && curView.hide();
    beacon(curView).on(curView.events.onHide, {
      to: toView
    });
    var $scope = scopeManager.getScope(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function triggerOnShow(curView, lastViewName) {
    var viewName = curView.getViewName();
    beacon(curView).on(curView.events.onShow, {
      from: lastViewName
    });
    var $scope = scopeManager.getScope(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function showLoading(){}

  function hideLoading(){}

  function getActive(){
    return activeView;
  }

  function goToHybrid(viewName, options) {
    options = options || {};
    if (options.replace) {
      goTo(viewName, options);
    } else {
      var fnName = 'beforeGoTo';
      var url = getURL(viewName, options);
      var paramObj = { viewName: viewName, options: options, url: url };
      var next = function(paramObj){
        activeView && triggerOnHide(activeView, null ,true);

        bridge.run('gotopage', {
          vc: paramObj.vc,
          url: paramObj.url
        });
      }

      // goTo 方法对外支持中间件，中间件参数为 paramObj
      middleware.run(fnName, paramObj, next);
    }
  }

  function back () {
    activeView && triggerOnHide(activeView, null ,true);
    bridge.run('goback');
  }

  /**
  * show 之前对外提供中间件 onAppear
  */
  function runOnAppear(params, next) {
    var fnName = 'onAppear';
    middleware.run(fnName, params, next);
  }

  api = {
    init : init,
    goTo : goToHybrid,
    back : back,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    showLoading : showLoading,
    hideLoading : hideLoading,
    getActive : getActive,
    getScopeKeyByViewName: getScopeKeyByViewName
  }

  return api;
});
