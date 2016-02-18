Air.run(function(require){
    var Scope             = require("core.scope"),
        node              = require("utility.node"),
        generateScopeTree = require("core.scopeTree"),
        view              = require('core.views')
        directive         = require("core.directive"),
        shim              = require("utility.shim");

    var EVENTS            = require("core.event"),
        FRAMEWORK_NAME    = 'b';

    shim.run();


    Air.domReady(function(){

            var scopeList = require('core.scopeList');
            scopeList.init(document, generateScopeTree);
            beacon(window).on('popstate', function(e){
                if (e.state && e.state.viewName){
                    b.views.goto(e.state.viewName, {popstate:true});
                }
            })


    });

    void function main(){
        var api = {
            run : require('core.run'),
            views: view,
            config : require('core.config'),
            EVENTS  : require('core.event'),
            Module  : Air.Module,
            service : require('core.service'),
            loadJS : Air.loadJS
        };
        window[FRAMEWORK_NAME] = api;
    }();

});
