Air.Module('B.service.serviceFactory', function(require) {
  var configList = [];
  var serviceList = [];
  var Service = require('B.service.Service');
  var middleware = require('B.util.middleware');
  var serviceInstanceList = [];

  function setConfig(configName, config) {
    if (configName) {
      configList[configName] = config;
    }
  }

  function getConfig(configName) {
    return configList[configName] || {};
  }



  function set(serviceName, config) {
    if (serviceName) {
      var newConfig = beacon.utility.merge({}, getConfig(config.extend), config);
      serviceList[serviceName] = newConfig;
    } else {
      throw new Error('serviceName is required');
    }
  }

  function get(serviceName, scope) {
    var serviceConfig = serviceList[serviceName];
    if (serviceConfig) {
      serviceConfig.serviceName = serviceName;
      var service = new Service(serviceConfig, scope, {
        onQuery: function() {
          serviceInstanceList.push(service);
        },
        onComplete: function() {
          var index = beacon.utility.arrayIndexOf(serviceInstanceList, service);
          if (index !== -1) {
            serviceInstanceList.splice(index, 1);
          }
        }
      });
      return service;
    } else {
      throw new Error(serviceName + ' not found');
    }
  }

  function abortAll() {
    for (var i = 0, len = serviceInstanceList.length, service; i < len; i++) {
      service = serviceInstanceList[i];
      service && service.abort(true);
    }
  }

  return {
    setConfig: setConfig,
    set: set,
    get : get,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    abortAll: abortAll
  }
});
