Air.Module("B.router.router", function(){

  class Router{

    private routers :Dictionary = [];

    static getURLByRule(rule:string, params:Dictionary, query:string, noOrigin:boolean) {
      let url = rule.replace(/:(\w+)/ig, function(param, key){
        return params[key] || "";
      });
      let defaultOrigin;
      if (!location.origin) {
        defaultOrigin = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: '');
      }
      url = (noOrigin ? '' : location.origin||defaultOrigin) + url + query;
      return url;
    }    

    static tryMatchParams(activeRouter:IrouterConfig, urlPath:string) {
      var matchedRouter:Dictionary;
      var matchedParam = urlPath.match(activeRouter.reg);
  
      if(matchedParam){
        matchedRouter = {
          rule: activeRouter.rule,
          viewName: activeRouter.viewName,
          params: {}
        };
        var matchedParamCount = matchedParam.length;
        var marchedParamIndex = 1;
  
        for (marchedParamIndex; marchedParamIndex < matchedParamCount; marchedParamIndex++) {
          var paramName = activeRouter.params[marchedParamIndex - 1];
          matchedRouter.params[paramName] = matchedParam[marchedParamIndex]
        }
      }
  
      return matchedRouter;
    }

    static parseRule(ruleString:string){
      var paramRule = /:[\w-]+/ig;
      var params:string[] = [];
      var matchRuleStr  = ruleString.replace(paramRule, function(param){
                            params.push(param.replace(":",""));
                            return "([\\w-]+)";
                          });
      var reg = new RegExp("^" + matchRuleStr + "\/*$","i");
      return {
        reg: reg,
        params: params
      };
    }

    public set(routerConfig:IrouterConfig){
      var ruleObj = Router.parseRule(routerConfig.rule);
      var router  = {
                      rule     : routerConfig.rule,
                      viewName : routerConfig.viewName,
                      sign     : routerConfig.sign,
                      reg      : ruleObj.reg,
                      params   : ruleObj.params
                    }
      this.routers.push(router);
      this.routers[routerConfig.viewName] = router;
    }

    public getMatchedRouter(urlPath:string){
      var rulesCount = this.routers.length;
      var ruleIndex  = 0;
      for(ruleIndex; ruleIndex < rulesCount; ruleIndex++){
        var activeRouter = this.routers[ruleIndex];
        var matchedRouter = Router.tryMatchParams(activeRouter, urlPath);
        if (matchedRouter) {
          return matchedRouter;
        }
      }
      return null;
    }    


    public getURLPathByViewName(viewName:string, options:Dictionary) {
      options = options || {};
      var params = options.params || {};
      var query  = options.query || "";
      query = options.hash ? query + options.hash : query;
      var router = this.routers[viewName];
      var rule = router && router.rule || "";
      var url = Router.getURLByRule(rule, params, query, options.noOrigin);
      return url;
    }    

    public get(viewName:string) {
      return this.routers[viewName] || {};
    }    
  
  }

  return new Router();
});
