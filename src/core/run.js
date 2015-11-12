Air.Module("core.run", function(require){
    var EVENTS      = require("core.event");
    var service     = require("core.service");
    var scopeList   = require("core.scopeList");
    var switchStyle = require("utility.switchStyle");

    var run = function(controllerName, controller){
        var scopeList = require("core.scopeList");
        var scope = scopeList.get(controllerName);

        beacon.on(service.EVENTS.COMPLETE, function(e, data){
          beacon(scope).on(EVENTS.DATA_CHANGE, scope);
        });

        // beacon(scope).on(EVENTS.DATA_CHANGE, function(e, scope){
        //   scopeList.updateShadow(scope);
        // });

    	  // try{  // TODO: 服务依赖需要Try来屏蔽错误
          Air.run(controller, false, scope);
          Air.run(function(){
            // scopeList.updateShadow(scope);
            beacon(scope).on(EVENTS.DATA_CHANGE, scope);
            switchStyle.hide();
            beacon.on("hi", scope); // TODO: 换名
          })

          // })




        // }catch(e){
        //   // console.log(e);
        // }
    }

    return run;
});
