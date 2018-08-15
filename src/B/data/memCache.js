Air.Module('B.data.memCache', function () {
    var MEMORY_CACHE = {};
    var EXPIRED_LIST = {};
    function set(key, value, options) {
        if (!key) {
            return;
        }
        MEMORY_CACHE[key] = value;
        if (options && typeof options.expiredSecond === 'number') {
            var now = new Date();
            now.setSeconds(now.getSeconds() + options.expiredSecond);
            EXPIRED_LIST[key] = now;
        }
    }
    function get(key) {
        if (!key) {
            return;
        }
        var value = MEMORY_CACHE[key];
        var expiredTime = EXPIRED_LIST[key];
        if (expiredTime) {
            var now = new Date();
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
    };
});
