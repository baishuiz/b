Air.Module("B.controller.run", function(require){
  var memCache = require('B.data.memCache');
  var run = function(controllerName, controller){
    var scopeManager = require("B.scope.scopeManager");
    var viewManager = require("B.view.viewManager");
    var EVENTS = require('B.event.EVENTS');
    var scopeKey = viewManager.getScopeKeyByViewName(controllerName);
    var scope = scopeManager.getScopeInstance(scopeKey || controllerName);

    if (scopeKey) {
      var controllerMap = memCache.get('controllerMap');
      if (!controllerMap) {
        controllerMap = {};
        memCache.set('controllerMap', controllerMap);
      }

      controllerMap[controllerName] = controller;
      memCache.set('controllerMap', controllerMap);
    }

    // TODO 需要在run之后再显示view
    Air.run(controller, false, scope);
    Air.run(function(){
      beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      beacon(scope).on(EVENTS.RUN_COMPLETE);
    })
  }

  return run;
});
