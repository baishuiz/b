Air.Module("B.controller.run", function(require:any){
  let memCache = require('B.data.memCache');
  let run = function(controllerName:string, controller:Function){
    let scopeManager = require("B.scope.scopeManager");
    let viewManager = require("B.view.viewManager");
    let EVENTS = require('B.event.EVENTS');
    let scopeKey = viewManager.getScopeKeyByViewName(controllerName);
    let scope = scopeManager.getScopeInstance(scopeKey || controllerName);

    if (scopeKey) {
      let controllerMap = memCache.get('controllerMap');
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
