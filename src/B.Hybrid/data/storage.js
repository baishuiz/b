Air.Module('B.data.storage', function(require){
  var bridge = require('B.bridge');
  var two = function(str) {
    str = (str || '0') + '';
    if (str.length === 1) {
      str = '0' + str;
    }
    return str;
  }

  var set = function(key, value, options) {
    if (!key) {
      return;
    }
    options = options || {};
    var expiredSecond = typeof options.expiredSecond === 'number' ? options.expiredSecond : 0;
    var expireTime = 0;

    if (expiredSecond) {
      expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + expiredSecond);
      expireTime = expireTime.getFullYear() + two(expireTime.getMonth() + 1) + two(expireTime.getDate()) +
                   two(expireTime.getHours()) + two(expireTime.getMinutes()) + two(expireTime.getSeconds());
    }

    var param = {
      key: key,
      value: JSON.stringify(value)
    };

    if (expireTime) {
      param['expireTime'] = expireTime;
    }

    bridge.run('setdata', param);
  };

  var get = function(key, callback){
    if (!key) {
      callback && callback();
      return;
    }
    var param = {
      key: key,
      success: function(res) {
        var result = res && res.result;
        try {
          result = JSON.parse(result);
        } catch (e) {
          result = null;
        }
        callback && callback(result);
      },
      failed: function() {
        callback && callback(null);
      }
    };

    bridge.run('getdata', param);
  }

  return {
    get: get,
    set: set
  }
});
