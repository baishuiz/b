Air.Module('B.service.Request', function (require) {
    var HTTP = require('B.network.HTTP');
    var EVENTS = require('B.event.events');
    var storage = require('B.data.storage');
    var middleware = require('B.util.middleware');
    var Request = (function () {
        function Request(request, options, scope) {
            if (options === void 0) { options = {}; }
            this.http = new HTTP();
            this.options = {};
            this.EVENTS = {
                SUCCESS: beacon.createEvent("service response success"),
                TIMEOUT: beacon.createEvent("service request timout"),
                ERROR: beacon.createEvent("service response error"),
                BIZERROR: beacon.createEvent("business error"),
                NETWORKERROR: beacon.createEvent("network error")
            };
            this.request = request;
            this.options = options;
            this.scope = scope;
        }
        Request.callBeforeQueryMiddleware = function (request, next) {
            var fnName = 'beforeQuery';
            middleware.run(fnName, request, next);
        };
        Request.callAfterQueryMiddleware = function (responseData, next) {
            var fnName = 'afterQuery';
            middleware.run(fnName, responseData, next);
        };
        Request.prototype.sendRequest = function (request) {
            var _this = this;
            if (request === void 0) { request = this.request; }
            Request.callBeforeQueryMiddleware(request, function () {
                request.successCallBack = function (response) {
                    _this.httpSuccessCallback(response);
                };
                request.errorCallBack = function (xhr) { _this.httpErrorCallback(xhr); };
                _this.http.request(request);
                _this.startTimeoutCount();
            });
        };
        Request.prototype.startTimeoutCount = function () {
            var _this = this;
            this.timer = setTimeout(function () {
                _this.http.abort();
            }, this.options.timeout * 1000);
        };
        Request.prototype.clearTimeoutCount = function () {
            clearTimeout(this.timer);
        };
        Request.prototype.parseResponseError = function (responseData) {
            var _this = this;
            var options = {
                xhr: this.http.xhr,
                data: responseData,
                requestParam: this.request,
                errorCode: Request.ERROR_CODE.parse
            };
            Request.callAfterQueryMiddleware(options, function (isError) {
                _this.options.errorCallBack && _this.options.errorCallBack(Request.ERROR_CODE.parse);
                beacon(_this).on(_this.EVENTS.ERROR, {
                    error: Request.ERROR_CODE.parse,
                    errorType: 'response parse error'
                });
                beacon(_this.scope).on(EVENTS.DATA_CHANGE);
            });
        };
        Request.prototype.cacheResponse = function (responseText) {
            this.options.expiredSecond && storage.set(this.options.cacheKey, responseText, {
                expiredSecond: this.options.expiredSecond
            });
        };
        Request.prototype.responseComplate = function (responseData, responseText) {
            var _this = this;
            var options = {
                xhr: this.http.xhr,
                data: responseData,
                requestParam: this.request
            };
            Request.callAfterQueryMiddleware(options, function (isError) {
                if (isError) {
                    _this.options.errorCallBack && _this.options.errorCallBack(Request.ERROR_CODE.business, responseData);
                    var eventData = {
                        error: Request.ERROR_CODE.business,
                        errorType: 'business error',
                        response: responseData
                    };
                    beacon(_this).on(_this.EVENTS.ERROR, eventData);
                    beacon(_this).on(_this.EVENTS.BIZERROR, eventData);
                    return;
                }
                _this.cacheResponse(responseText);
                _this.options.successCallBack && _this.options.successCallBack(responseData);
                beacon(_this).on(_this.EVENTS.SUCCESS, responseData);
                beacon(_this.scope).on(EVENTS.DATA_CHANGE);
            });
        };
        Request.prototype.httpSuccessCallback = function (response) {
            if (response === void 0) { response = {}; }
            this.clearTimeoutCount();
            var responseText = '';
            var responseData;
            if (response.readyState === 4) {
                responseText = response.responseText;
                try {
                    responseData = JSON.parse(responseText);
                    this.responseComplate(responseData, responseText);
                }
                catch (e) {
                    this.parseResponseError(responseData);
                    return;
                }
            }
        };
        Request.prototype.httpErrorCallback = function (xhr) {
            var _this = this;
            this.clearTimeoutCount();
            var errorCode = xhr.status ? Request.ERROR_CODE.network : Request.ERROR_CODE.timeout;
            var errorType = xhr.status ? "network Error" : "request timeout";
            var request = {
                errorCode: errorCode,
                xhr: xhr,
                requestParam: this.options
            };
            Request.callAfterQueryMiddleware(request, function (errorInfo) {
                _this.options.errorCallBack && _this.options.errorCallBack(errorCode, errorInfo);
                beacon(_this).on(_this.EVENTS.ERROR, {
                    error: errorCode,
                    response: errorInfo
                });
            });
            beacon(this.scope).on(EVENTS.DATA_CHANGE);
        };
        Request.ERROR_CODE = {
            parse: 1,
            timeout: 2,
            network: 3,
            business: 4
        };
        return Request;
    }());
    return Request;
});
