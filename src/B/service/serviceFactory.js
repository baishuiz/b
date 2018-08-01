Air.Module('B.service.serviceFactory', function (require) {
    var Service = require('B.service.Service');
    var middleware = require('B.util.middleware');
    var serviceFactory = (function () {
        function serviceFactory() {
            this.configList = [];
            this.serviceList = [];
        }
        serviceFactory.prototype.getConfig = function (configName) {
            return this.configList[configName] || {};
        };
        serviceFactory.prototype.addMiddleware = function (middlewareName, fn) {
            middleware.add(middlewareName, fn);
        };
        serviceFactory.prototype.removeMiddleware = function (middlewareName, fn) {
            middleware.remove(middlewareName, fn);
        };
        serviceFactory.prototype.setConfig = function (configName, config) {
            if (configName) {
                this.configList[configName] = config;
            }
        };
        serviceFactory.prototype.set = function (serviceName, config) {
            if (serviceName) {
                var newConfig = beacon.utility.merge({}, this.getConfig(config.extend), config);
                this.serviceList[serviceName] = newConfig;
            }
            else {
                throw new Error('serviceName is required');
            }
        };
        serviceFactory.prototype.get = function (serviceName, scope) {
            var serviceConfig = this.serviceList[serviceName];
            if (serviceConfig) {
                serviceConfig.serviceName = serviceName;
                var service = new Service(serviceConfig, scope);
                return service;
            }
            else {
                throw new Error(serviceName + ' not found');
            }
        };
        serviceFactory.prototype.abortAll = function () {
            for (var serviceName in this.serviceList) {
                if (this.serviceList.hasOwnProperty(serviceName)) {
                    var service = this.serviceList[serviceName];
                    service.abort(true);
                }
            }
            ;
        };
        return serviceFactory;
    }());
    return new serviceFactory();
});
