Air.Module('B.service.Request', function(require:any) {
    var HTTP = require('B.network.HTTP');
    var EVENTS =  require('B.event.events');
    var storage = require('B.data.storage');
    var middleware = require('B.util.middleware');

    class Request {
        private timer:number; 
        private request:Dictionary;
        private http:any = new HTTP();
        private options:Dictionary = {};
        private scope:any;

        public EVENTS = {
            SUCCESS : beacon.createEvent("service response success"),
            TIMEOUT : beacon.createEvent("service request timout"),
            ERROR   : beacon.createEvent("service response error"),
            BIZERROR   : beacon.createEvent("business error"),
            NETWORKERROR: beacon.createEvent("network error")            
          }        

        static ERROR_CODE = {
            parse: 1, // JSON 解析出错
            timeout: 2, // 超时
            network: 3, // 网络错误
            business: 4 // 业务错误（由中间件控制）
        }

        constructor (request:Dictionary,options:Dictionary={}, scope:any){
            this.request = request;
            this.options = options;
            this.scope = scope;
        }

        // beforeQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件无返回值
        static callBeforeQueryMiddleware(request:Dictionary, next:Function) {
            var fnName = 'beforeQuery';
            middleware.run(fnName, request, next);
        }
    
        // afterQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件返回是否失败
        static callAfterQueryMiddleware(responseData:Dictionary, next:Function) {
            var fnName = 'afterQuery';
            middleware.run(fnName, responseData, next);
        }         

        public sendRequest(request:Dictionary=this.request) {
            Request.callBeforeQueryMiddleware(request, () =>{
                // 避免外部修改回调函数，所以在外部处理完成后再赋值
                request.successCallBack = (response:any) => {
                    this.httpSuccessCallback(response)
                };
                request.errorCallBack = (xhr:any) => {this.httpErrorCallback(xhr)};
                this.http.request(request);
                this.startTimeoutCount();
            });
        }
    
        private startTimeoutCount() {
            this.timer = setTimeout(() => {
                this.http.abort();
            }, this.options.timeout * 1000);
        }
    
        private clearTimeoutCount() {
            clearTimeout(this.timer);
        }        

        private parseResponseError(responseData:any){
            let options = {
                xhr: this.http.xhr,
                data: responseData, 
                requestParam: this.request, 
                errorCode: Request.ERROR_CODE.parse
            }
            Request.callAfterQueryMiddleware(options, (isError:boolean) => {
                this.options.errorCallBack && this.options.errorCallBack(Request.ERROR_CODE.parse);
                beacon(this).on(this.EVENTS.ERROR, {
                    error : Request.ERROR_CODE.parse,
                    errorType:'response parse error'
                    // response : responseText
                });

                beacon(this.scope).on(EVENTS.DATA_CHANGE);
            });            
        }

        private cacheResponse(responseText:string){
            // 记录缓存
            this.options.expiredSecond && storage.set(this.options.cacheKey, responseText, {
                expiredSecond: this.options.expiredSecond
            });
        }

        private responseComplate(responseData:any,responseText:string){
            let options = {
                xhr: this.http.xhr, 
                data: responseData, 
                requestParam: this.request
            }

            Request.callAfterQueryMiddleware(options, (isError:boolean) => {
                if (isError) {
                    this.options.errorCallBack && this.options.errorCallBack(Request.ERROR_CODE.business, responseData);
                    let eventData = {
                        error : Request.ERROR_CODE.business,
                        errorType:'business error',
                        response : responseData
                    }
                    beacon(this).on(this.EVENTS.ERROR, eventData);
                    beacon(this).on(this.EVENTS.BIZERROR, eventData);
                    return;                    
                } 
                this.cacheResponse(responseText);
                this.options.successCallBack && this.options.successCallBack(responseData);
                beacon(this).on(this.EVENTS.SUCCESS, responseData);
                beacon(this.scope).on(EVENTS.DATA_CHANGE);
            });
        }

        private httpSuccessCallback(response:any = {}) {
            this.clearTimeoutCount();
            let responseText = '';
            let responseData:any;
            
            if (response.readyState === 4) {
                responseText = response.responseText;
                try {
                    responseData = JSON.parse(responseText);
                    this.responseComplate(responseData,responseText);
                } catch(e) {
                    this.parseResponseError(responseData);
                    return;
                }
            }
        }
    
        private httpErrorCallback(xhr:any) {
            this.clearTimeoutCount();
        
            // status = 0 为abort后进入的，算做超时
            let errorCode = xhr.status ? Request.ERROR_CODE.network : Request.ERROR_CODE.timeout;
            let errorType = xhr.status ? "network Error" : "request timeout";
            let request = {
                errorCode: errorCode, 
                xhr: xhr, 
                requestParam: this.options
            };
            Request.callAfterQueryMiddleware(request, (errorInfo:any) => {
                this.options.errorCallBack && this.options.errorCallBack(errorCode, errorInfo);
                beacon(this).on(this.EVENTS.ERROR, {
                    error : errorCode,
                    response : errorInfo
                });
            });
            beacon(this.scope).on(EVENTS.DATA_CHANGE);
        }
    }
    return Request;
});