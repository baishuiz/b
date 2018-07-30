/**
 * @author baishuiz@gmail.com, xuemengfei@gmail.com
 * @version v0.2.0
 */
Air.run(function(require){
  var viewManager   = require("B.view.viewManager"),
      scopeManager = require('B.scope.scopeManager'),
      router = require("B.router.router"),
      memCache = require('B.data.memCache'),
      run = require('B.controller.run'),
      serviceFactory = require('B.service.serviceFactory'),
      HTTP = require('B.network.HTTP'),
      storage = require('B.data.storage'),
      TDK = require('B.TDK.TDK');
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : viewManager, // ViewManager
      router   : router, // Router
      scopeManager　:　scopeManager,
      service  : serviceFactory,
      utility  : {
        storage  : storage,
        HTTP: HTTP
      },

      /**
       * [环境初始化]
       * @param  {Environment} env [环境配置对象]
       * @return void
       */
      init     : function(env){
        env = env || {}; //root scope
        memCache.set('env', env);
        Air.moduleURL(env.$moduleURL);
        viewManager.init(env);
      },
      run      : run,
      Module   : Air.Module,
      TDK      : TDK,
      bridge   : {
        run: function(){},
        isHybrid: false,
        isInApp: false
      },
      ready    : function(callback){
        callback = typeof callback === 'function' ? callback : function(){};
        Air.domReady(function(){
          callback();
        });
      },
      setModuleURL: function(url) {
        Air.moduleURL(url);
      }
    };
    window[FRAMEWORK_NAME] = api;
  }();
});
