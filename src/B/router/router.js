Air.Module("B.router.router", function(){

  var routers = [];


  function set(routerConfig){
    var paramRule = /:\w+/ig;
    var RuleReg   = getMatchRuleReg(routerConfig.rule);
    var router    = {
                      rule     : routerConfig.rule,
                      viewName : routerConfig.viewName,
                      sign     : routerConfig.sign,
                      reg      : reg
                    }
    routers.push(router);
  }

  function getMatchRuleReg(ruleString){
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
        return activeRule.viewName
      }
    }
    return null;
  }

  function tryMatchURLPath(urlPath, router){
    return router.reg.test(urlPath);
  }

  var api = {
    set : set,
    getViewNameByURLPath : getViewNameByURLPath
  }
  return api;
});
