Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  var memCache = require('B.data.MemCache');
  var middleware = require('B.util.middleware');

  var serviceQueue = {};

  var ERROR_CODE = {
    parse: 1, // JSON 解析出错
    timeout: 2, // 超时
    network: 3, // 网络错误
    business: 4 // 业务错误（由中间件控制）
  }

  function Service(config, scope, controlEvents){
    config = config || {};
    var header = config.header || {};
    header['Content-Type'] = 'application/json;charset=utf-8';

    var self = this;
    var requestParams = null;
    var http = new HTTP();
    this.noTriggerEvent = false; // 不触发事件

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
      var curServiceQueue = serviceQueue[cacheKey];

      var tryReturnCacheData = function() {
        var cachedDataText = memCache.get(cacheKey);
        var cachedData;
        try {
          cachedData = JSON.parse(cachedDataText);

          var fromCache = true;
          options.successCallBack && options.successCallBack(cachedData, fromCache);
          beacon(self).on(SERVICEEVENTS.SUCCESS, cachedData);
          beacon(scope).on(EVENTS.DATA_CHANGE);

          return true;
        } catch(e) {
          return false;
        }
      }

      if (!options.noCache && !curServiceQueue) {
        var getCacheSuccess = tryReturnCacheData();
        if (getCacheSuccess) {
          return;
        }
      }

      controlEvents.onQuery && controlEvents.onQuery();

      var startTimeoutCount = function() {
        timer = setTimeout(function(){
          http.abort();
        }, timeoutSeconds * 1000);
      }

      var clearTimeoutCount = function() {
        clearTimeout(timer);
      }

      var httpSuccessCallback = function(xhrOrResponseData, isQueue) {
        clearTimeoutCount();
        xhrOrResponseData = xhrOrResponseData || {};
        var responseText = '';
        var responseData = null;
        var parseError = false;

        controlEvents.onComplete && controlEvents.onComplete();

        // 不是队列进入的，并且readState为4，则解析json
        if (!isQueue && xhrOrResponseData.readyState === 4) {
          responseText = xhrOrResponseData.responseText;
          try {
            responseData = JSON.parse(responseText);
          } catch(e) {
            parseError = true;
          }
        } else { // 否则，为队列传入的responseData
          responseData = xhrOrResponseData;
        }

        if (parseError) {
          options.errorCallBack && options.errorCallBack(ERROR_CODE.parse, responseText);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : ERROR_CODE.parse,
            response : responseText
          });
          beacon(scope).on(EVENTS.DATA_CHANGE);
          if (!isQueue) {
            var isError = true;
            runQueue(isError, xhrOrResponseData);
          }

          tryClearQueue();

          return;
        } else {
          callAfterQueryMiddleware({xhr: http.xhr, data: responseData}, function(isError) {
            if (isError) {
              options.errorCallBack && options.errorCallBack(ERROR_CODE.business, responseData);
              beacon(self).on(SERVICEEVENTS.ERROR, {
                error : ERROR_CODE.business,
                response : responseData
              });
              if (!isQueue) {
                var isError = true;
                runQueue(isError, xhrOrResponseData);
              }
            } else {
              var useCache = false;
              if (!options.noCache) {
                useCache = tryReturnCacheData();
              }

              if (!useCache) {
                // 记录缓存
                config.expiredSecond && memCache.set(cacheKey, responseText, {
                  expiredSecond: config.expiredSecond
                });

                options.successCallBack && options.successCallBack(responseData);
                beacon(self).on(SERVICEEVENTS.SUCCESS, responseData);
                if (!isQueue) {
                  var isError = false;
                  runQueue(isError, responseData);
                }
              }
            }

            beacon(scope).on(EVENTS.DATA_CHANGE);

            tryClearQueue();

          });
        }
      }

      var httpErrorCallback = function(xhr, isQueue) {
        clearTimeoutCount();

        controlEvents.onComplete && controlEvents.onComplete();
        tryClearQueue();

        // abortAll时不触发事件
        if (self.noTriggerEvent) {
          self.noTriggerEvent = false;
          return;
        }

        // status = 0 为abort后进入的，算做超时
        var errorCode = xhr.status ? ERROR_CODE.network : ERROR_CODE.timeout;
        callAfterQueryMiddleware({errorCode: errorCode, xhr: xhr}, function(errorInfo){
          options.errorCallBack && options.errorCallBack(errorCode, errorInfo);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : errorCode,
            response : errorInfo
          });

          if (!isQueue) {
            var isError = true;
            runQueue(isError, xhr);
          }
        });

        beacon(scope).on(EVENTS.DATA_CHANGE);

      }

      function runQueue(isError, xhrOrResponseData) {
        var args = [].slice.call(arguments, 1);
        var isQueue = true;
        if (curServiceQueue && curServiceQueue.length) {
          for (var curService; curService = curServiceQueue.shift();) {
            if (curService) {
              if (isError) {
                curService.httpErrorCallback && curService.httpErrorCallback.call(self, xhrOrResponseData, isQueue);
              } else {
                curService.httpSuccessCallback && curService.httpSuccessCallback.call(self, xhrOrResponseData, isQueue);
              }
            }
          }
          tryClearQueue();
        }
      }

      // 服务请求完，如果队列为空，则删除队列
      function tryClearQueue() {
        if (curServiceQueue && !curServiceQueue.length) {
          delete serviceQueue[cacheKey];
        }
      }

      var requestOptions = {
        url: url,
        method: config.method,
        header: header,
        data: JSON.stringify(requestParams)
      };

      callBeforeQueryMiddleware(requestOptions, function(){

        // 首次进入，队列不存在
        if (!curServiceQueue) {
          curServiceQueue = serviceQueue[cacheKey] = [];

          // 避免外部修改回调函数，所以在外部处理完成后再赋值
          requestOptions.successCallBack = httpSuccessCallback;
          requestOptions.errorCallBack = httpErrorCallback;

          http.request(requestOptions);
          startTimeoutCount();
        } else {
          curServiceQueue.push({
            httpSuccessCallback: httpSuccessCallback,
            httpErrorCallback: httpErrorCallback
          })
        }
      });
    };

    this.abort = function(noTriggerEvent){
      self.noTriggerEvent = noTriggerEvent;
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
