Air.Module('B.service.serviceFactory', function(require:any) {
  var Service = require('B.service.Service');
  var middleware = require('B.util.middleware');

  class serviceFactory{
    
    private configList:Dictionary = [];
    private serviceList:Dictionary = [];

    private getConfig(configName:string) {
      return this.configList[configName] || {};
    }

    public addMiddleware (middlewareName:string, fn:Function):void {
      middleware.add(middlewareName, fn);
    }

    public removeMiddleware(middlewareName:string, fn:Function):void {
      middleware.remove(middlewareName, fn);
    }

    public setConfig(configName:string, config:Dictionary) {
      if (configName) {
        this.configList[configName] = config;
      }
    }    


    public set(serviceName:string, config:Dictionary) {
      if (serviceName) {
        let newConfig = beacon.utility.merge({}, this.getConfig(config.extend), config);
        this.serviceList[serviceName] = newConfig;
      } else {
        throw new Error('serviceName is required');
      }
    }

    public get(serviceName:string, scope:Object) {
      var serviceConfig = this.serviceList[serviceName];
      if (serviceConfig) {
        serviceConfig.serviceName = serviceName;
        var service = new Service(serviceConfig, scope);
        return service;
      } else {
        throw new Error(serviceName + ' not found');
      }
    }  
    
    public abortAll() {
      for(let serviceName in this.serviceList){
        if(this.serviceList.hasOwnProperty(serviceName)){
          let service = this.serviceList[serviceName];
          service.abort(true);
        }
      };
    }    
    
  }
  return new serviceFactory()
});
