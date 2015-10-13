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
    COMPLETE : beacon.createEvent("service response complete")
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
                      result.data = data.data
                      beacon.on(serviceEvents.COMPLETE, data);
                  });

                  request.request({
                        method: configs.method,
                        url   : getURL(configs),
                        data  : params
                  });
                  return result
              }
            }
            return api;
        }
      }
      return serviceAPI;
  };

  service.EVENTS = serviceEvents;
  return service;
})
