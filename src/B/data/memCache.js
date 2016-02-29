Air.Module('B.data.memCache', function(){
  var MEMORY_CACHE = {};
  function set(key, value, options) {
    if (!key) {
      return;
    }
    MEMORY_CACHE[key] = value;
  }

  function get(key) {
    if (!key) {
      return;
    }
    return MEMORY_CACHE[key];
  }

  return {
    get: get,
    set: set
  }
});
