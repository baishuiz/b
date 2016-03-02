Air.Module("B.router.router", function(){

  var routers = [];


  function set(routerConfig){
    var ruleObj = parseRule(routerConfig.rule);
    var router  = {
                    rule     : routerConfig.rule,
                    viewName : routerConfig.viewName,
                    sign     : routerConfig.sign,
                    reg      : ruleObj.reg,
                    params   : ruleObj.params
                  }
    routers.push(router);
    routers[routerConfig.viewName] = router;
  }

  function parseRule(ruleString){
    var paramRule = /:\w+/ig;
    var params = [];
    var matchRuleStr  = ruleString.replace(paramRule, function(param){
                          params.push(param.replace(":",""));
                          return "(\\w+)";
                        });
    var reg = new RegExp("^" + matchRuleStr + "\/*$","i");
    return {
      reg: reg,
      params: params
    };
  }

  function getMatchedRouter(urlPath){
    var rulesCount = routers.length;
    var ruleIndex  = 0
    for(ruleIndex; ruleIndex < rulesCount; ruleIndex++){
      var activeRouter = routers[ruleIndex];
      var matchedRouter = tryMatchParams(activeRouter, urlPath);
      if (matchedRouter) {
        return matchedRouter;
      }
    }
    return null;
  }

  function tryMatchParams(activeRouter, urlPath) {
    var matchedRouter = null;
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

  function getURLByRule(rule, params, query) {
    var url = rule.replace(/:(\w+)/ig, function(param, key){
      return params[key] || "";
    });
    if (!location.origin) {
      location.origin = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: '');
    }
    url = location.origin + url + query;
    return url;
  }

  function getURLPathByViewName(viewName, options) {
    options = options || {};
    var params = options.params || {};
    var query  = options.query || "";
    var router = routers[viewName];
    var rule = router && router.rule || "";
    var url = getURLByRule(rule, params, query);
    return url;
  }

  function get(viewName) {
    return routers[viewName] || {};
  }

  var api = {
    set : set,
    getMatchedRouter : getMatchedRouter,
    getURLPathByViewName : getURLPathByViewName,
    get: get
  }
  return api;
});
