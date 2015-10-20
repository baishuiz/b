Air.Module('core.service', function(require){
  var Request = require('core.network.request');
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
              var curServiceEvents = {
                COMPLETE : beacon.createEvent("service response complete"),
                SUCCESS : beacon.createEvent("service response success"),
                ERROR : beacon.createEvent("service response error")
              }

              //serviceConfig[configKey]
              beacon.utility.blend(configs, baseCofig, {cover:false});
              var request = new Request();
              var api = {
                query : function(params){
                    var resultData = {};
                    beacon(request).on(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
                        try {
                            resultData = JSON.parse(data.data);
                            beacon.on(curServiceEvents.SUCCESS, resultData);
                            beacon.on(serviceEvents.SUCCESS, resultData);
                        } catch (e) {
                            resultData = data.data;
                            resultData.error = 'parse Error';
                            beacon.on(curServiceEvents.ERROR, resultData);
                            beacon.on(serviceEvents.ERROR, resultData);
                        }
                        beacon.on(curServiceEvents.COMPLETE, resultData);
                        beacon.on(serviceEvents.COMPLETE, resultData);
                    });

                    request.request({
                          method: configs.method,
                          url   : getURL(configs),
                          data  : params && JSON.stringify(params) || null
                    });
                    return resultData
                },
                on : beacon.on,
                off : beacon.off,
                EVENTS  : curServiceEvents
            }
            return api;
        }
      }
      return serviceAPI;
  };

  service.EVENTS = serviceEvents;
  return service;
})
