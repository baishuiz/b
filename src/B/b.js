Air.run(function (require) {
    var FRAMEWORK_NAME = 'b';
    var viewManager = require("B.view.viewManager"), scopeManager = require('B.scope.scopeManager'), router = require("B.router.router"), memCache = require('B.data.memCache'), run = require('B.controller.run'), serviceFactory = require('B.service.serviceFactory'), HTTP = require('B.network.HTTP'), storage = require('B.data.storage'), TDK = require('B.TDK.TDK');
    var B = (function () {
        function B() {
            this.FRAMEWORK_NAME = 'b';
            this.views = viewManager;
            this.router = router;
            this.scopeManager = scopeManager;
            this.service = serviceFactory;
            this.run = run;
            this.Module = Air.Module;
            this.TDK = TDK;
            this.bridge = {
                run: function () { },
                isHybrid: false,
                isInApp: false
            };
            this.utility = {
                storage: storage,
                HTTP: HTTP
            };
        }
        B.prototype.init = function (env) {
            if (env === void 0) { env = {}; }
            memCache.set('env', env);
            Air.moduleURL(env.$moduleURL);
            viewManager.init(env);
        };
        B.prototype.ready = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            Air.domReady(function () {
                callback();
            });
        };
        ;
        B.prototype.setModuleURL = function (url) {
            Air.moduleURL(url);
        };
        return B;
    }());
    window[FRAMEWORK_NAME] = new B();
});
