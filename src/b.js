/**
 * @author baishuiz@gmail.com, xuemengfei@gmail.com
 * @version v0.2.0
 */
Air.run(function(require){
  var view   = require("B.view.viewManager"),
      router = require("B.router.router"),
      memCache = require('B.data.memCache');
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : view, // ViewManager
      router   : router, // Router
      service  : null,
      utility  : null,

      /**
       * [环境初始化]
       * @param  {Environment} env [环境配置对象]
       * @return void
       */
      init     : function(env){
        memCache.set('env', env);
        view.init()
      },
      run      : function(){},
      Module   : function(){},
      domReady : function(){}
    };
    window[FRAMEWORK_NAME] = api;
  }()
});


// 考虑到模板内嵌 view 存在的可能性，
// 为避免冗余模板请求，故此 view 初始化在 domReady 之后进行。
// Air.domReady(function(){
//   b.views.init();
// });
