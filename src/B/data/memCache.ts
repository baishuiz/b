Air.Module('B.data.memCache', function(){
  let MEMORY_CACHE:Dictionary = {};
  let EXPIRED_LIST:Dictionary = {};
  function set(key:string, value:any, options:Dictionary) {
    if (!key) {
      return;
    }
    MEMORY_CACHE[key] = value;
    if (options && typeof options.expiredSecond === 'number') {
      let now = new Date();
      now.setSeconds(now.getSeconds() + options.expiredSecond);
      EXPIRED_LIST[key] = now;
    }
  }

  function get(key:string) {
    if (!key) {
      return;
    }
    let value = MEMORY_CACHE[key];
    let expiredTime = EXPIRED_LIST[key];
    if (expiredTime) {
      let now = new Date();
      if (now.getTime() > expiredTime.getTime()) {
        delete MEMORY_CACHE[key];
        delete EXPIRED_LIST[key];
        return undefined;
      }
    }
    return value;
  }

  return {
    get: get,
    set: set
  }
});
