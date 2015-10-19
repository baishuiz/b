Air.Module("core.scopeList", function(require){
    var directive         = require("core.directive"),
        Scope             = require("core.scope");
    var scopeList = {};
    var shadowScopeList = {};


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
            var app         = apps[appIndex],
                appName     = app.getAttribute(directive.key.app)
                rootScope   = new Scope(); // 初始化应用rootScope
                shadowScope = new Scope();

            scopeList[appName] = rootScope;
            shadowScopeList[appName] = shadowScope;
            generateScopeTree(app.childNodes, rootScope); // 构建 subScope
        }
    }

    var api = {
    	init : init,
    	get   : function(key){
            return scopeList[key];
    	},

    	set  : function(key, parentScope) {
            var scope = new Scope(parentScope);
    		scopeList[key] = scope;
            scope.__$shadowScope__ = shadowScope;
            //shadowScopeList[key] = shadowScope;
            

            return scope
    	},

        dirtyCheck : function(dataPath, $scope){
            var value = Air.NS(dataPath, $scope);
            var shadowValue = Air.NS(dataPath, $scope.__$shadowScope__);

            var valueStr       = JSON.stringify(value).replace(/\{\}/g,'""');
            var shadowValueStr = JSON.stringify(shadowValue);
            var result = (valueStr === shadowValueStr);
            return !result
        },

        updateShadow : function(scope){
            var scopeStr = JSON.stringify(scope);
            scope.__$shadowScope__ = JSON.parse(scopeStr);
        }
    }

    return api;
})