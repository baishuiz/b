Air.run(function(require){
    var Scope             = require("core.scope"),
        node              = require("utility.node"),
        generateScopeTree = require("core.scopeTree"),
        view              = require('core.views')
        directive         = require("core.directive");

    var EVENTS            = require("core.event"),
        FRAMEWORK_NAME    = 'b';



    Air.domReady(function(){
        
            var scopeList = require('core.scopeList');
            scopeList.init(document, generateScopeTree);
            // beacon(window).on('popstate', function(e){
            //     view.goto(state.viewName);
            // })
            

    });

    void function main(){
        var api = {
            run : require('core.run'),
            views: view,
            config : require('core.config'),
            EVENTS  : require('core.event')
        };
        window[FRAMEWORK_NAME] = api;
    }();

});
