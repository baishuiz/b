Air.Module('B.util.middleware', function(){
  let middlewares:Dictionary = {};

  function add(fnName:string, fn:Function) {
    if (fnName && fn) {
      middlewares[fnName] = middlewares[fnName] || [];
      middlewares[fnName].push(fn);
    }
  }

  function remove(fnName:string, fn:Function) {
    if (fnName && fn) {
      let list = middlewares[fnName] || [];
      let index = list.indexOf(fn);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }

  function run(fnName:string, paramObj:any, next:Function) {
    let fns = middlewares[fnName];
    let fnLength = fns && fns.length;
    next = next || function(){};

    if (fnLength) {
      let fnIndex = 0;
      let handle = function() {
        let fn = fns[fnIndex];
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
