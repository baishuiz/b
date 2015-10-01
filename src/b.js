// Air.moduleURL("")
Air.run(function(require){
    var Scope = require("core.scope");
    var node = require("utility.node");
    var generateScopeTree = require("core.scopeTree");
    var EVENTS    = require("core.event");
    var FRAMEWORK_NAME = 'b';

    // 定义module属性名
    var key = {
    	module : "cjia-module",
        app    : "ng-app",
        controller : "ng-controller"
    }


    var nodeType = node.type;





    function getApps(){
        var apps = document.querySelectorAll("[" + key.app + "]");
        return apps;
    }

    // function generateScopeTree(rootDom , $scope){
    //     var scopeList = require('core.scopeList');
    //
    //     var childNodes = rootDom.childNodes;
    //     var childCount = childNodes.length;
    //     for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
    //          var child = childNodes[childIndex];
    //          if(child.nodeType == nodeType.TEXT){
    //             var tag = child.nodeValue;
    //             beacon({target:child, oldvalue:child.nodeValue})
    //             .on(EVENTS.DATA_CHANGE, function(e, data){
    //                 var textNode = this.target;
    //                 var text     = this.oldvalue;
    //                 var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
    //                 for (var i = markups.length - 1; i >= 0; i--) {
    //                     var markup   = markups[i];
    //                     var dataPath = markup.replace(/{{|}}/ig,"");
    //                     // var data = JSON.stringify(Air.NS(dataPath, $scope)).replace(/{}/ig,'')
    //                     var data = Air.NS(dataPath, $scope);
    //                     data = isEmpty(data) ? '' : data;
    //                     text = text.replace(markup, data)
    //
    //
    //                 };
    //                 text.replace(/{{.*?}}/ig, '');
    //                  textNode.nodeValue = text
    //                 // this.target.nodeValue = "haha";
    //             });
    //          } else if (child.nodeType == nodeType.HTML) {
    //             var isController = child.attributes.getNamedItem('ng-controller');
    //             if(isController){
    //                 var controllerName = child.getAttribute(key.controller)
    //                 $scope = new Scope($scope);
    //                 scopeList[controllerName] = $scope;
    //             }
    //
    //             var repeatFilter = require("directive.repeat");
    //             repeatFilter(child, $scope);
    //
    //             generateScopeTree(child, $scope);
    //          }
    //     }
    // }
    //


    Air.domReady(function(){

        // 获取所有App
        var apps = getApps();

        var scopeList = require('core.scopeList');

        // 遍历App 列表
        for(var appIndex = 0, appCount = apps.length ; appIndex < appCount; appIndex++) {
            var app       = apps[appIndex];
            var appName   = app.getAttribute(key.app);

            // 初始化应用rootScope
            var rootScope = new Scope();
            scopeList[appName] = rootScope;

            // 构建 subScope
            generateScopeTree(app.childNodes, rootScope);

        }

    });

    function main(){
        var api     = {
            run : require('core.run')
        };
        window[FRAMEWORK_NAME] = api;
    }

    main();
});
