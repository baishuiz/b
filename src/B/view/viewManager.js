Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var viewList = [],
      activeView = null,
      middleware = []

  /**
   * 初始化首屏 View
   */
  function init(){
    var URLPath = location.pathname;
    var viewName = router.getViewNameByURLPath(URLPath);
    show(viewName);
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

  var api = {
    init : init,
    goto : goto,
    setMiddleware : setMiddleware,
    showLoading : showLoading,
    hideLoading : hideLoading
  }

  return api;
});
