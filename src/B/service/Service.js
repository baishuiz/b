Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  var memCache = require('B.data.MemCache');
  var middleware = require('B.util.middleware');

  var ERROR_CODE = {
    parse: 1, // JSON 解析出错
    timeout: 2, // 超时
    network: 3, // 网络错误
    business: 4 // 业务错误（由中间件控制）
  }

  function Service(config, scope){
    config = config || {};
    var header = config.header || {};
    header['Content-Type'] = 'application/json;charset=utf-8';

    var self = this;
    var requestParams = null;
    var http = new HTTP();

    var SERVICEEVENTS = {
        SUCCESS: beacon.createEvent("service response success"),
        ERROR: beacon.createEvent("service response error")
    }

    this.EVENTS = SERVICEEVENTS;

    this.on = function(event, handle){
      beacon(self).on(event, handle);
    }

    this.off = function(event, handle){
      beacon(self).off(event, handle);
    }

    this.query = function(requestParams, options){
      options = options || {};
      var timeoutSeconds = beacon.isType(config.timeout, 'Number') ? config.timeout : 30;
      var url = config.protocol + '://' + config.host + config.path;
      var cacheKey = url + JSON.stringify(requestParams);
      var finished = false;
      var timer = null;

      if (!options.noCache) {
        var cachedData = memCache.get(cacheKey);
        if (cachedData) {
          var fromCache = true;
          options.successCallBack && options.successCallBack(cachedData, fromCache);
          beacon(self).on(SERVICEEVENTS.SUCCESS, cachedData);
          beacon(scope).on(EVENTS.DATA_CHANGE);
          return;
        }
      }

      var startTimeoutCount = function() {
        timer = setTimeout(function(){
          http.abort();
        }, timeoutSeconds * 1000);
      }

      var clearTimeoutCount = function() {
        clearTimeout(timer);
      }

      var httpSuccessCallback = function(responseText) {
        clearTimeoutCount();
        var responseData = null;
        var parseError = false;
        try {
          responseData = JSON.parse(responseText);
        } catch(e) {
          parseError = true;
        }

        if (parseError) {
          options.errorCallBack && options.errorCallBack(ERROR_CODE.parse, responseText);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : ERROR_CODE.parse,
            response : responseText
          });
          beacon(scope).on(EVENTS.DATA_CHANGE);
          return;
        } else {
          callAfterQueryMiddleware({xhr: http.xhr, data: responseData}, function(isError) {
            if (isError) {
              options.errorCallBack && options.errorCallBack(ERROR_CODE.business, responseData);
              beacon(self).on(SERVICEEVENTS.ERROR, {
                error : ERROR_CODE.business,
                response : responseData
              });
            } else {
              // 记录缓存
              memCache.set(cacheKey, responseData, {
                expiredSecond: config.expiredSecond
              });

              options.successCallBack && options.successCallBack(responseData);
              beacon(self).on(SERVICEEVENTS.SUCCESS, responseData);
            }

            beacon(scope).on(EVENTS.DATA_CHANGE);

          });
        }
      }

      var httpErrorCallback = function(xhr) {
        clearTimeoutCount();

        var errorCode = xhr.status ? ERROR_CODE.network : ERROR_CODE.timeout;
        callAfterQueryMiddleware({errorCode: errorCode, xhr: xhr}, function(errorInfo){
          options.errorCallBack && options.errorCallBack(errorCode, errorInfo);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : errorCode,
            response : errorInfo
          });
        });

        beacon(scope).on(EVENTS.DATA_CHANGE);

      }

      var requestOptions = {
        url: url,
        method: config.method,
        header: header,
        data: JSON.stringify(requestParams)
      };

      callBeforeQueryMiddleware(requestOptions, function(){
        // 避免外部修改回调函数，所以在外部处理完成后再赋值
        requestOptions.successCallBack = httpSuccessCallback;
        requestOptions.errorCallBack = httpErrorCallback;

        http.request(requestOptions);
        startTimeoutCount();
      });
    };

    this.abort = function(){
      http.abort();
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
