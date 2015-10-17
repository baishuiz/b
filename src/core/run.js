Air.Module("core.run", function(require){
    var EVENTS    = require("core.event");
    var service   = require("core.service");
    var scopeList = require("core.scopeList");

    var run = function(controllerName, controller){
        var scopeList = require("core.scopeList");
        var scope = scopeList.get(controllerName);

        beacon.on(service.EVENTS.COMPLETE, function(e, data){
          beacon.on(EVENTS.DATA_CHANGE, scope);
        });

    	  // try{
          Air.run(controller, false, scope);
          Air.run(function(){
            scopeList.updateShadow(scope);
            beacon.on(EVENTS.DATA_CHANGE, scope);
            beacon.on("hi", scope);          
          })

          // })


  
          
        // }catch(e){
        //   // console.log(e);
        // }
    }

    return run;
});
