Air.Module("B.controller.run", function(require){
  var run = function(controllerName, controller){
    var scopeManager = require("B.scope.scopeManager");
    var EVENTS = require('B.event.EVENTS');
    var scope = scopeManager.getScope(controllerName);

    // TODO 需要在run之后再显示view
    Air.run(controller, false, scope);
    Air.run(function(){
      beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      beacon(scope).on(EVENTS.RUN_COMPLETE);
    })
  }

  return run;
});
