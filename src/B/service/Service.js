Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  var memCache = require('B.data.MemCache');
  var middleware = require('B.util.middleware');

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
      var httpSuccessCallback = function(responseText) {
        var responseData = null;
        try {
          responseData = JSON.parse(responseText);
        } catch(e) {
          responseData = {
            err: true
          };
        }

        callAfterQueryMiddleware(responseData, function(isError) {
          if (isError) {
            options.errorCallBack && options.errorCallBack(responseData);
          } else {
            // 记录缓存
            memCache.set(cacheKey, responseData, {
              expiredSecond: config.expiredSecond
            });

            options.successCallBack && options.successCallBack(responseData);
          }

          beacon(scope).on(EVENTS.DATA_CHANGE);
        });

      }
      var httpErrorCallback = function(xhr) {
        options.errorCallBack && options.errorCallBack();
        beacon(scope).on(EVENTS.DATA_CHANGE);
      }

      var requestOptions = {
        url: url,
        method: config.method,
        header: header,
        data: JSON.stringify(requestParams)
      }

      callBeforeQueryMiddleware(requestOptions, function(){
        // 避免外部修改回调函数，所以在外部处理完成后再赋值
        requestOptions.successCallBack = httpSuccessCallback;
        requestOptions.errorCallBack = httpErrorCallback;

        http.request(requestOptions);
      });
    };
  }

  // beforeQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件无返回值
  function callBeforeQueryMiddleware(requestOptions, next) {
    var fnName = 'beforeQuery';
    middleware.run(fnName, requestOptions, next);
  }

  // afterQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件返回是否失败
  function callAfterQueryMiddleware(responseData, next) {
    var fnName = 'afterQuery';
    middleware.run(fnName, responseData, next);
  }

  return Service;

});
