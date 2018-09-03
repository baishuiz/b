Air.Module('B.data.storage', function(require:any){
  let memCache = require('B.data.memCache');

  let set = memCache.set;

  let get = function(key:string, callback:Function){
    let value = memCache.get(key);
    callback && callback(value);
    return value;
  }

  return {
    get: get,
    set: set
  }
});
