Air.Module('core.router', function(require){

  var signs = {};
  var routers = [];
  var rules = {};
  var query = require('utility.query');
  var config = require('core.config');



  var router = function(rule){
  
  };

  router.param = {};
  function parseRouter(rule){
    var paramIndex = 0;
    var params = []
    var regStr = rule.router.replace(/\//ig,"\/")
                 .replace(/:\w+/ig, function(param){
                    // params[param] = paramIndex++;
                    params.push(param.replace(":",""));
                    return "(\\w+)"
                  });
    var reg = new RegExp("^" + regStr + "\/*$","i");

    rule.rule = reg;
    rule.params = params;
    return rule;
  }

  router.set = function(rule){
    routers.push(parseRouter(rule));
    signs[rule.viewName] = rule.sign;
    rules[rule.viewName] = rule.router;
  };

  router.getParams = function(pathname){
    var matchedRouter = router.match(pathname || location.pathname) || {};
    return matchedRouter.params || {};
  }

  router.getQuerys = function (url) {
    return query.getQuerys(url || location.href);
  }

  router.getQueryString = function (url) {
    return query.getQueryString(url || location.href);
  }

  router.getRule = function(viewName){
    return rules[viewName];
  }

  router.getSign = function(viewName){
    return signs[viewName] || '';
  }


  router.match = function(pathName){
    for (var i = 0; i < routers.length; i++) {
      var activeRouter = routers[i];
      var result = pathName.match(activeRouter.rule);
      if(result){
        for (var paramIndex = 1; paramIndex < result.length; paramIndex++) {
          var paramName = activeRouter.params[paramIndex-1];
          activeRouter.params[paramName] = result[paramIndex]
        }
        return activeRouter;
      }
    }


  }
  return router;
})
