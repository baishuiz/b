Air.Module("B.router.router", function(){

  var routers = [];


  function set(routerConfig){
    var RuleReg   = getMatchRuleReg(routerConfig.rule);
    var router    = {
                      rule     : routerConfig.rule,
                      viewName : routerConfig.viewName,
                      sign     : routerConfig.sign,
                      reg      : RuleReg
                    }
    routers.push(router);
    routers[routerConfig.viewName] = router;
  }

  function getMatchRuleReg(ruleString){
    var paramRule = /:\w+/ig;
    var matchRuleStr = ruleString.replace(paramRule, function(param){
                         return "(\\w+)";
                       });
    var reg = new RegExp("^" + matchRuleStr + "\/*$","i");
    return reg;
  }

  function getViewNameByURLPath(urlPath){
    var rulesCount = routers.length;
    var ruleIndex  = 0
    for(ruleIndex; ruleIndex < rulesCount; ruleIndex++){
      var activeRouter = routers[ruleIndex];
      var isMatched  = tryMatchURLPath(urlPath, activeRouter);
      if(isMatched){
        return activeRouter.viewName
      }
    }
    return null;
  }

  function tryMatchURLPath(urlPath, router){
    return router.reg.test(urlPath);
  }

  function getUrlByViewName(viewName) {
    var router = routers[viewName];
    return router && router.rule;
  }

  var api = {
    set : set,
    getViewNameByURLPath : getViewNameByURLPath,
    getUrlByViewName : getUrlByViewName
  }
  return api;
});
