Air.Module('B.data.memCache', function(){
  var MemCache = {};
  function set(key, value) {
    if (!key || !value) {
      return;
    }
    MemCache[key] = value;
  }

  function get(key) {
    if (!key) {
      return;
    }
    return MemCache[key];
  }

  return {
    get: get,
    set: set
  }
});
