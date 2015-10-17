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
              //serviceConfig[configKey]
              beacon.utility.blend(configs, baseCofig, {cover:false});
              var request = new Request();
              var api = {
                query : function(params){
                    var result = {}
                    beacon(request).on(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
                        try {
                            result.data = JSON.parse(data.data);
                            beacon.on(serviceEvents.SUCCESS, result.data);
                        } catch (e) {
                            beacon.on(serviceEvents.ERROR, {
                              error: 'parse Error',
                              data: data.data
                            });
                        }
                        beacon.on(serviceEvents.COMPLETE, result.data);
                    });

                    request.request({
                          method: configs.method,
                          url   : getURL(configs),
                          data  : params && JSON.stringify(params) || null
                    });
                    return result
                },
                on : beacon.on,
                off : beacon.off,
                EVENTS  : serviceEvents
            }
            return api;
        }
      }
      return serviceAPI;
  };

  service.EVENTS = serviceEvents;
  return service;
})
