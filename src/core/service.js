Air.Module('core.service', function(require){
  var Request = require('core.network.request');
  var EVENTS    = require("core.event");
  var config  = require('core.config');

  var serviceConfigs = {

  }

  function getURL(configs){
      var url = configs.protocol + "://" + configs.host + configs.path;
      return url;
  }

  var serviceEvents = {
    COMPLETE : beacon.createEvent("service response complete"),
    SUCCESS : beacon.createEvent("service response success"),
    ERROR : beacon.createEvent("service response error")
  }

  var service = function(configKey){
      var baseConfigs = b.config.get("service");
      var baseCofig = baseConfigs[configKey];


      serviceAPI =  {
        set : function(configs){
            var getInstance = function() {
              var curServiceEvents = {
                COMPLETE : beacon.createEvent("service response complete"),
                SUCCESS : beacon.createEvent("service response success"),
                ERROR : beacon.createEvent("service response error")
              }

              //serviceConfig[configKey]
              beacon.utility.blend(configs, baseCofig, {cover:false});
              var request = new Request();
              var api = {
                query : function(params, options){
                    options = options || {};
                    var defaultOptions = {
                      preserve : false,  // 保存历史数据
                      scope    : null
                    }
                    beacon.utility.blend(options, defaultOptions, {cover:false});
                    var resultData = {};
                    beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
                        var paseError = false;
                        try {
                            resultData.data = JSON.parse(data.data);
                        } catch (e) {
                            paseError = true;
                            resultData.data = data.data;
                            resultData.error = 'parse Error';
                            beacon.on(curServiceEvents.ERROR, resultData);
                            beacon.on(serviceEvents.ERROR, resultData);
                        }

                        if (!paseError) {
                          beacon.on(curServiceEvents.SUCCESS, resultData);
                          beacon.on(serviceEvents.SUCCESS, resultData);
                        }

                        beacon.on(curServiceEvents.COMPLETE, resultData);
                        beacon.on(serviceEvents.COMPLETE, resultData);
                        options.scope && beacon.on(EVENTS.DATA_CHANGE, options.scope);
                    });

                    request.request({
                          method: configs.method,
                          url   : getURL(configs),
                          data  : params && JSON.stringify(params) || null,
                          header: {
                            'Content-Type': 'application/json;charset=utf-8'
                          }
                    });
                    return resultData
                },
                on : beacon.on,
                off : beacon.off,
                once : beacon.once,
                EVENTS  : curServiceEvents
              }

              return api;
            };
            return {
              getInstance: getInstance
            };
        }
      }
      return serviceAPI;
  };

  service.EVENTS = serviceEvents;
  return service;
})
