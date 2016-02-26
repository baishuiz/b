Air.Module("B.controller.run", function(require){
    var run = function(controllerName, controller){
        var scopeManager = require("B.scope.scopeManager");
        var EVENTS = require('B.event.EVENTS');
        var scope = scopeManager.getScope(controllerName);

        // beacon(scope).on(EVENTS.DATA_CHANGE, function(e, scope){
        //   scopeList.updateShadow(scope);
        // });

    	  // try{  // TODO: 服务依赖需要Try来屏蔽错误
          Air.run(controller, false, scope);
          Air.run(function(){
            beacon(scope).on(EVENTS.DATA_CHANGE, scope);
          })

          // })
        // }catch(e){
        //   // console.log(e);
        // }
    }

    return run;
});
