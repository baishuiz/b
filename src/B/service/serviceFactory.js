Air.Module('B.service.serviceFactory', function(require) {
  var configList = [];
  var serviceList = [];
  var Service = require('B.service.Service');
  var middleware = require('B.util.middleware');

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
      return new Service(serviceConfig, scope);
    } else {
      throw new Error(serviceName + ' not found');
    }
  }

  return {
    setConfig: setConfig,
    set: set,
    get : get,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove
  }
});
