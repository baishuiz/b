Air.Module("core.run", function(require){
    

    var attrKey = {
    	APP : "ng-app"
    }

    var getApps = function(){
        
    } 


    

    // controller(require, $scope)
    var run = function(controllerName, controller){
    	var scopeList = require("core.scopeList");
        var scope = scopeList[controllerName];
        controller(require, scope);
        beacon.on("DataChange");
    }

    return run;
});