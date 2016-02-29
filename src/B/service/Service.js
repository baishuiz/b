Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  // var Data = require('B.data.data'); TODO

  function successHandler() {

  }

  function Service(config, scope){
    // var cachedData = Data;
    config = config || {};
    var header = config.header || {};
    header['Content-Type'] = 'application/json;charset=utf-8';

    var requestParams = null;
    var http = new HTTP();
    var getCachedData = function(){

    };

    this.onQueryBefore = function(){

    };
    this.onQueryAfter = function(){

    };

    this.query = function(requestParams, options){
      // TODO options.noCache || 缓存过期
      // TODO 中间件
      var requestOptions = {
        url: config.protocol + '://' + config.host + config.path,
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
