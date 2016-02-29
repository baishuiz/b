Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  var memCache = require('B.data.MemCache');

  function Service(config, scope){
    config = config || {};
    var header = config.header || {};
    header['Content-Type'] = 'application/json;charset=utf-8';

    var requestParams = null;
    var http = new HTTP();

    this.query = function(requestParams, options){
      options = options || {};
      var url = config.protocol + '://' + config.host + config.path;
      var cacheKey = url + JSON.stringify(requestParams);

      if (!options.noCache) {
        var cachedData = memCache.get(cacheKey);
        if (cachedData) {
          var fromCache = true;
          options.successCallBack && options.successCallBack(cachedData, fromCache);
          beacon(scope).on(EVENTS.DATA_CHANGE);
          return;
        }
      }
      // TODO 中间件
      var requestOptions = {
        url: url,
        method: config.method,
        header: header,
        data: JSON.stringify(requestParams),
        successCallBack: function(responseText){
          var responseData = null;
          try {
            responseData = JSON.parse(responseText);
          } catch(e) {
            options.errorCallBack && options.errorCallBack();
          }

          // 记录缓存
          memCache.set(cacheKey, responseData, {
            expiredSecond: config.expiredSecond
          });

          options.successCallBack && options.successCallBack(responseData);
          beacon(scope).on(EVENTS.DATA_CHANGE);
        },
        errorCallBack: function(xhr){
          options.errorCallBack && options.errorCallBack(xhr);
          beacon(scope).on(EVENTS.DATA_CHANGE);
        }
      }
      http.request(requestOptions);
    };
  }

  return Service;

});
