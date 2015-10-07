Air.Module('core.router', function(){
  // var routers = [
  //    {
  //       rule: reg,
  //       viewName : "viewName",
  //       sign   : "ABCDEF"
  //    }
  // ]

  var routers = [];


  var router = function(rule){
      // routers = crateRouter(rule);
      // for (var rule in rules) {
      //   if (object.hasOwnProperty(rule)) {
      //     createReg(rule);
      //   }
      // }
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
    var reg = new RegExp("^" + regStr + "$","i");
    rule.rule = reg;
    rule.params = params;
    return rule;
  }

  router.set = function(rule){
    routers.push(parseRouter(rule));
  };


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
