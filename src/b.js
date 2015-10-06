Air.run(function(require){
    var Scope             = require("core.scope"),
        node              = require("utility.node"),
        generateScopeTree = require("core.scopeTree"),
        directive         = require("core.directive");

    var EVENTS            = require("core.event"),
        FRAMEWORK_NAME    = 'b';

    function getApps(){
        var apps = document.querySelectorAll("[" + directive.key.app + "]");
        return apps;
    }

    Air.domReady(function(){
        var apps      = getApps(), // 获取所有App
            scopeList = require('core.scopeList');

        // 遍历App 列表
        var appIndex = 0, appCount = apps.length;
        for(; appIndex < appCount; appIndex++) {
            var app       = apps[appIndex],
                appName   = app.getAttribute(directive.key.app)
                rootScope = new Scope(); // 初始化应用rootScope

            scopeList[appName] = rootScope;
            generateScopeTree(app.childNodes, rootScope); // 构建 subScope
        }
    });

    void function main(){
        var api = {
            run : require('core.run'),
            views: require('core.views'),
            config : require('core.config')
        };
        window[FRAMEWORK_NAME] = api;
    }();

});
