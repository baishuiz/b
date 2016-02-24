Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var HTTP   = require('B.network.http');
  var memCache = require('B.data.memCache');
  var viewList = [],
      viewportList = [],
      activeView = null,
      mainViewport = null,
      middleware = []

  /**
   * 初始化首屏 View
   */
  function init(path){
    initLocalViewport();
    var URLPath = path || location.pathname;
    var viewName = router.getViewNameByURLPath(URLPath);
    goto(viewName, {init:true});
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

  function setMainViewport(viewport){
    mainViewport = viewport;
  }

  function initLocalView(viewContainer){
    var viewport = viewContainer.dom;
    var views = viewport.querySelectorAll('view');
    var viewIndex = 0;
    var viewCount = views.length;
    for(; viewIndex < viewCount; viewIndex++){
      var activeView = views[viewIndex];
      var activeViewName = activeView.getAttribute('name');
      viewContainer['views'][activeViewName] = new View(activeView);
    }
  }



  function goto (viewName, options){
    switchURL(viewName, options);
    var hasView = getViewByViewName(viewName);
    hasView ? show(viewName) : loadView(viewName);
  }

  function switchURL (viewName, options) {
    options = options || {};
    var url = router.getUrlByViewName(viewName);
    var isInit  = options.init;
    var changeURLState = isInit ? history.replaceState : history.pushState;
    changeURLState.call(history,{
      viewName: viewName,
      params: options.params
    }, viewName, url);
  }

  function listenURLChange() {
    beacon(window).on('popstate', function(e){
      var state  = e.state || {};
        state.viewName && show(state.viewName);
    });
  }

  function back () {
    window.history.back();
  }

  function setMiddleware (moduleName){

  }

  function existView (viewName){

  }

  function show (viewName){
    var view = getViewByViewName(viewName);
    view ? switchView(view) : throw404Event();
  }


  function throw404Event(){};

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function loadView(viewName){
    showLoading();
    var env = memCache.get('env');
    var templatePath = env.templatePath + viewName + '.html';
    var http = new HTTP();

    http.get(templatePath, {
      successCallBack : successCallBack,
      errorCallBack : errorCallBack
    });

    function successCallBack(responseText){
      var view = new View(responseText, {
        initCallback: function(){
          hideLoading();
        }
      });
      mainViewport.appendChild(view.getDom());
    }

    function errorCallBack(){
      throw404Event();
    }
  }


  function switchView(view){
    view.show();
    activeView && activeView.hide();
    activeView = view;
  }

  function hide(viewName){
    var view = getViewByViewName(viewName);
    view && view.hide();
  }

  function createView(){}

  function showLoading(){}

  function hideLoading(){}

  function getActive(){
    return activeView && activeView.getDom();
  }

  var viewProxy = function(viewportName){

  };
  api = {
    init : init,
    goto : goto,
    back : back,
    setMiddleware : setMiddleware,
    showLoading : showLoading,
    hideLoading : hideLoading,
    getActive : getActive
  }

  return api;
});
