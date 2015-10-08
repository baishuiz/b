Air.Module("core.scopeList", function(require){
    var directive         = require("core.directive"),
        Scope             = require("core.scope");
    var scopeList = {};


    function getApps(target){
        var apps = target.querySelectorAll("[" + directive.key.app + "]");
        return apps;
    }

    function init(target, generateScopeTree){
    	target = target || document	;
    	var apps      = getApps(target); // 获取所有App        
    	// 遍历App 列表
        var appIndex = 0, appCount = apps.length;
        for(; appIndex < appCount; appIndex++) {
            var app       = apps[appIndex],
                appName   = app.getAttribute(directive.key.app)
                rootScope = new Scope(); // 初始化应用rootScope

            scopeList[appName] = rootScope;
            generateScopeTree(app.childNodes, rootScope); // 构建 subScope
        }
    }

    var api = {
    	init : init,
    	get   : function(key){
            return scopeList[key];
    	},

    	set  : function(key, value) {
    		scopeList[key] = value;
    	}
    }

    return api;
})