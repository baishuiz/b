Air.Module('B.util.middleware', function(){
  var middlewares = {};

  function set(fnName, fn) {
    if (fnName && fn) {
      middlewares[fnName] = middlewares[fnName] || [];
      middlewares[fnName].push(fn);
    }
  }

  function run(fnName, paramObj, next) {
    var fns = middlewares[fnName];
    var fnLength = fns && fns.length;

    if (fnLength) {
      var fnIndex = 0;
      var handle = function() {
        var fn = fns[fnIndex];
        if (fnIndex < fnLength && fn) {
          fn(paramObj, function() {
            fnIndex++;
            handle.apply(handle, arguments);
          });
          return;
        }
        next.apply(next, arguments);
      }
      handle();
    } else {
      next();
    }
  }

  return {
    set: set,
    run: run
  };
});
