/**
 * @author baishuiz@gmail.com
 * @version v1.0.0
 */
Air.run(function(require:any) {
  let FRAMEWORK_NAME:string = 'b';
  let viewManager   = require("B.view.viewManager"),
      scopeManager = require('B.scope.scopeManager'),
      router = require("B.router.router"),
      memCache = require('B.data.memCache'),
      run = require('B.controller.run'),
      serviceFactory = require('B.service.serviceFactory'),
      HTTP = require('B.network.HTTP'),
      storage = require('B.data.storage'),
      TDK = require('B.TDK.TDK');

  class B{
  // void function main(){
    private FRAMEWORK_NAME:string = 'b';

    public views  = viewManager;
    public router = router;
    public scopeManager = scopeManager;
    public service = serviceFactory;
    public run = run;
    public Module   =  Air.Module;
    public TDK =  TDK;
    public bridge   = {
      run: function(){},
      isHybrid: false,
      isInApp: false
    };

    // constructor(target) {
      // target[this.FRAMEWORK_NAME] = new B(window)
    // }

    public utility:Object = {
      storage:storage,
      HTTP : HTTP
    };

      /**
       * [环境初始化]
       * @param  {Environment} env [环境配置对象] 默认值为 root Scope
       * @return void
       */
    public init(env:any={}){
      memCache.set('env', env);
      Air.moduleURL(env.$moduleURL);
      viewManager.init(env);
    }


    public ready(callback=function(){}){
      Air.domReady(function(){
        callback();
      });
    };

    public setModuleURL(url:string) {
      Air.moduleURL(url);
    }
  }  
  (<any>window)[FRAMEWORK_NAME] = new B();
});
