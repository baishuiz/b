Air.Module('B.service.Service', function(require:any) {
  var HTTP = require('B.network.HTTP');
  // var EVENTS =  require('B.event.events');
  var storage = require('B.data.storage');
  var Request = require('B.service.Request');

  class Service{
    private requestQueue:Dictionary =[];
    static serviceQueue:Dictionary = {};
    private config:Dictionary;
    private scope:Object
    private header:Dictionary;
    
    public EVENTS = {
      SUCCESS : beacon.createEvent("service response success"),
      TIMEOUT : beacon.createEvent("service request timout"),
      ERROR   : beacon.createEvent("service response error"),
      BIZERROR: beacon.createEvent("business error"),
      NETWORKERROR: beacon.createEvent("network error")
    }

    constructor(config:Dictionary={}, scope:Object){
      this.config = config;
      this.scope = scope;
      this.config.header = this.config.header || {};
      this.config.header['Content-Type'] = this.config.header['Content-Type'] || 'application/json;charset=utf-8';
    }


    public on  (event:any, handle:Function){
      beacon(this).on(event, handle);
    }

    public off (event:any, handle:Function){
      beacon(this).off(event, handle);
    }

    public getConfig () {
      return this.config;
    }

    private responseCacheData (cachedData:any, requestOptions:Dictionary) {
      if (cachedData) {
        let fromCache = true;
        // setTimeout(function(){ // 否则在有缓存时，事件会等服务回来后才执行完毕
        requestOptions.successCallBack && requestOptions.successCallBack(cachedData, fromCache);
        beacon(this).on(this.EVENTS.SUCCESS, cachedData);
        // beacon(this.scope).on(EVENTS.DATA_CHANGE);
        // }, 0);
        return;
      }
    }

    private getCacheData(requestParams:Dictionary){
      let url:string = this.config.protocol + '://' + this.config.host + this.config.path;
      let cacheKey = url + JSON.stringify(requestParams);
      let cachedData:any;
      // storage.get(cacheKey, (cachedDataText:string) => {
      //   try {
      //     cachedData = JSON.parse(cachedDataText);
      //   } catch(e) {return cachedData;}
      //   return cachedData;
      // });
      let cachedDataText:string = storage.get(cacheKey)
       
        try {
          cachedData = JSON.parse(cachedDataText);
        } catch(e) {}
        return cachedData;
      
    }

    public query (requestParams:Dictionary, options:Dictionary={}){
      let url:string = this.config.protocol + '://' + this.config.host + this.config.path;
      let cacheKey = url + JSON.stringify(requestParams);
      let cachedData = this.getCacheData(requestParams);
      if(!options.noCache && cachedData){
        this.responseCacheData(cachedData, options);
      } else {
        let request = {
          url: url,
          method: this.config.method,
          header: this.config.header,
          data: JSON.stringify(requestParams),
          serviceName: this.config.serviceName
        };
        options.timeout = options.timeout || this.config.timeout;
        options.expiredSecond = options.expiredSecond || this.config.expiredSecond;
        options.cacheKey = cacheKey;
        let serviceRequest = new Request(request, options, this.scope);
        this.bindRequestEvent(serviceRequest);
        this.requestQueue.push(serviceRequest);
        serviceRequest.sendRequest();
      }
    };

    private bindRequestEvent(request:any) {
      beacon(request).on(request.EVENTS.SUCCESS,(e:any,data:any)=>{beacon(this).on(this.EVENTS.SUCCESS, data)});
      beacon(request).on(request.EVENTS.TIMEOUT,(e:any,data:any)=>{beacon(this).on(this.EVENTS.TIMEOUT, data)});
      beacon(request).on(request.EVENTS.BIZERROR,(e:any,data:any)=>{beacon(this).on(this.EVENTS.BIZERROR, data)});
      beacon(request).on(request.EVENTS.NETWORKERROR,(e:any,data:any)=>{beacon(this).on(this.EVENTS.NETWORKERROR, data)});
      beacon(request).on(request.EVENTS.ERROR,(e:any,data:any)=>{beacon(this).on(this.EVENTS.ERROR, data)});
    }

    public abort(noTriggerEvent:boolean){
      // this.noTriggerEvent = noTriggerEvent;
      // this.http.abort();
      for(let requestIndex=0; requestIndex<this.requestQueue.length; requestIndex++) {
        let request = this.requestQueue[requestIndex];
        request.abort();
      }
    }    
  }
  return Service;
});
