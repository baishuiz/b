Air.Module('B.data.storage', function(require){
  var memCache = require('B.data.memCache');

  var set = memCache.set;

  var get = function(key, callback){
    var value = memCache.get(key);
    callback && callback(value);
  }

  return {
    get: get,
    set: set
  }
});
