/**
 * @author baishuiz@gmail.com
 * @version v2.0
 */
Air.run(function(require){
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : require("B.view.viewManager"), // ViewManager
      router   : require("B.router.router"), // Router
      service  : null,
      utility  : null,

      /**
       * [环境初始化]
       * @param  {Environment} env [环境配置对象]
       * @return void
       */
      init     : function(env){},
      run      : function(){},
      Module   : function(){},
      domReady : function(){}
    };
    window[FRAMEWORK_NAME] = api;
  }()
});
