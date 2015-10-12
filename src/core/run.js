Air.Module("core.run", function(require){
    var EVENTS    = require("core.event");

    var run = function(controllerName, controller){
    	  var scopeList = require("core.scopeList");
        var scope = scopeList.get(controllerName);
        controller(require, scope);
        beacon.on(EVENTS.DATA_CHANGE, scope);
    }

    return run;
});
