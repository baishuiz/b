Air.Module('B.util.middleware', function(){
  var middlewares = {};

  function add(fnName, fn) {
    if (fnName && fn) {
      middlewares[fnName] = middlewares[fnName] || [];
      middlewares[fnName].push(fn);
    }
  }

  function remove(fnName, fn) {
    if (fnName && fn) {
      var list = middlewares[fnName] || [];
      var index = list.indexOf(fn);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }

  function run(fnName, paramObj, next) {
    var fns = middlewares[fnName];
    var fnLength = fns && fns.length;
    next = next || function(){};

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
    add: add,
    run: run,
    remove: remove
  };
});
