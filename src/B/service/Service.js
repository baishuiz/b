Air.Module('B.service.Service', function (require) {
    var HTTP = require('B.network.HTTP');
    var storage = require('B.data.storage');
    var Request = require('B.service.Request');
    var Service = (function () {
        function Service(config, scope) {
            if (config === void 0) { config = {}; }
            this.requestQueue = [];
            this.EVENTS = {
                SUCCESS: beacon.createEvent("service response success"),
                TIMEOUT: beacon.createEvent("service request timout"),
                ERROR: beacon.createEvent("service response error"),
                BIZERROR: beacon.createEvent("business error"),
                NETWORKERROR: beacon.createEvent("network error")
            };
            this.config = config;
            this.scope = scope;
            this.config.header = this.config.header || {};
            this.config.header['Content-Type'] = this.config.header['Content-Type'] || 'application/json;charset=utf-8';
        }
        Service.prototype.on = function (event, handle) {
            beacon(this).on(event, handle);
        };
        Service.prototype.off = function (event, handle) {
            beacon(this).off(event, handle);
        };
        Service.prototype.getConfig = function () {
            return this.config;
        };
        Service.prototype.responseCacheData = function (cachedData, requestOptions) {
            if (cachedData) {
                var fromCache = true;
                requestOptions.successCallBack && requestOptions.successCallBack(cachedData, fromCache);
                beacon(this).on(this.EVENTS.SUCCESS, cachedData);
                return;
            }
        };
        Service.prototype.getCacheData = function (requestParams) {
            var url = this.config.protocol + '://' + this.config.host + this.config.path;
            var cacheKey = url + JSON.stringify(requestParams);
            var cachedData;
            var cachedDataText = storage.get(cacheKey);
            try {
                cachedData = JSON.parse(cachedDataText);
            }
            catch (e) { }
            return cachedData;
        };
        Service.prototype.query = function (requestParams, options) {
            if (options === void 0) { options = {}; }
            var url = this.config.protocol + '://' + this.config.host + this.config.path;
            var cacheKey = url + JSON.stringify(requestParams);
            var cachedData = this.getCacheData(requestParams);
            if (!options.noCache && cachedData) {
                this.responseCacheData(cachedData, options);
            }
            else {
                var request = {
                    url: url,
                    method: this.config.method,
                    header: this.config.header,
                    data: JSON.stringify(requestParams),
                    serviceName: this.config.serviceName
                };
                options.timeout = options.timeout || this.config.timeout;
                options.expiredSecond = options.expiredSecond || this.config.expiredSecond;
                options.cacheKey = cacheKey;
                var serviceRequest = new Request(request, options, this.scope);
                this.bindRequestEvent(serviceRequest);
                this.requestQueue.push(serviceRequest);
                serviceRequest.sendRequest();
            }
        };
        ;
        Service.prototype.bindRequestEvent = function (request) {
            var _this = this;
            beacon(request).on(request.EVENTS.SUCCESS, function (e, data) { beacon(_this).on(_this.EVENTS.SUCCESS, data); });
            beacon(request).on(request.EVENTS.TIMEOUT, function (e, data) { beacon(_this).on(_this.EVENTS.TIMEOUT, data); });
            beacon(request).on(request.EVENTS.BIZERROR, function (e, data) { beacon(_this).on(_this.EVENTS.BIZERROR, data); });
            beacon(request).on(request.EVENTS.NETWORKERROR, function (e, data) { beacon(_this).on(_this.EVENTS.NETWORKERROR, data); });
            beacon(request).on(request.EVENTS.ERROR, function (e, data) { beacon(_this).on(_this.EVENTS.ERROR, data); });
        };
        Service.prototype.abort = function (noTriggerEvent) {
            for (var requestIndex = 0; requestIndex < this.requestQueue.length; requestIndex++) {
                var request = this.requestQueue[requestIndex];
                request.abort();
            }
        };
        Service.serviceQueue = {};
        return Service;
    }());
    return Service;
});
