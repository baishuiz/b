Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var viewList = [],
      viewportList = [null],
      activeView = null,
      mainViewport = null,
      middleware = []

  /**
   * 初始化首屏 View
   */
  function init(){
    initLocalViewport();
    var URLPath = location.pathname;
    var viewName = router.getViewNameByURLPath(URLPath);
    show(viewName);
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
      initLocalView(activeViewport, isMainViewport);
    }
  }

  function setMainViewport(viewport){
    viewportList[0] = viewportList.length - 1;
    mainViewport = viewport;
  }

  function initLocalView(viewport, isMainViewport){
    var viewContainer = viewportList.length - 1;
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

  }

  function setMiddleware (moduleName){

  }

  function existView (viewName){}

  function show (viewName){
    var view = getViewByViewName(viewName);
    view ? switchView(view) : throw404Event();
  }

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function switchView(view){
    view.show();
    activeView && activeView.hidden();
    activeView = view;
  }

  function hidden(viewName){
    var view = getViewByViewName(viewName);
    view && view.hidden();
  }

  function createView(){}

  function showLoading(){}

  function hideLoading(){}

  var viewProxy = function(viewportName){

  };
  api = {
    init : init,
    goto : goto,
    setMiddleware : setMiddleware,
    showLoading : showLoading,
    hideLoading : hideLoading
  }

  return api;
});
