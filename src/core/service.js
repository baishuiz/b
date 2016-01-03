Air.Module('core.service',
function(require) {
    var Request = require('core.network.request');
    var EVENTS = require("core.event");
    var config = require('core.config');

    var serviceConfigs = {

}

    function getURL(configs) {
        var url = configs.protocol + "://" + configs.host + configs.path;
        return url;
    }

    var serviceEvents = {
        COMPLETE: beacon.createEvent("service response complete"),
        SUCCESS: beacon.createEvent("service response success"),
        ERROR: beacon.createEvent("service response error"),
        BEFORE_QUERY: beacon.createEvent("service before query")
    }

    var service = function(configKey) {
        var baseConfigs = b.config.get("service");
        var baseCofig = baseConfigs[configKey];

        serviceAPI = {
            set: function(configs) {
                var getInstance = function() {
                    var curServiceEvents = {
                        COMPLETE: beacon.createEvent("service response complete"),
                        SUCCESS: beacon.createEvent("service response success"),
                        ERROR: beacon.createEvent("service response error")
                    }

                    //serviceConfig[configKey]
                    beacon.utility.blend(configs, baseCofig, {
                        cover: false
                    });
                    var request = new Request();
                    var api = {
                        query: function(params, options) {
                            options = options || {};
                            var defaultOptions = {
                                preserve: false,
                                // 保存历史数据
                                scope: null
                            }
                            beacon.utility.blend(options, defaultOptions, {
                                cover: false
                            });
                            var resultData = {};
                            beacon(request).once(Request.EVENTS.REQUEST_COMPLETE,
                            function(e, data) {
                                var triggerSuccess = function() {
                                    beacon.on(curServiceEvents.SUCCESS, resultData);
                                    beacon.on(serviceEvents.SUCCESS, resultData);
                                };
                                var triggerError = function() {
                                    beacon.on(curServiceEvents.ERROR, resultData);
                                    beacon.on(serviceEvents.ERROR, resultData);
                                }

                                var paseError = false;
                                if (!data.err) {
                                    try {
                                        resultData.data = JSON.parse(data.data);
                                    } catch(e) {
                                        paseError = true;
                                        resultData.data = data.data;
                                        resultData.error = 'parseError';
                                    }
                                }

                                if (paseError) {
                                    data.err = 'parseError';
                                }

                                if (configs.afterQuery && configs.afterQuery.length) {
                                    var next = function(isSuccess, noTrigger) {
                                        if (!noTrigger) {
                                            if (isSuccess) {
                                                triggerSuccess();
                                            } else {
                                                triggerError();
                                            }
                                        }
                                    }
                                    var queryIndex = 0;
                                    var queryLength = configs.afterQuery.length;
                                    var handle = function(isSuccess, noTrigger) {
                                        var cb = configs.afterQuery[queryIndex];
                                        if (queryIndex < queryLength && cb) {
                                            cb(data,
                                            function(isSuccess, noTrigger) {
                                                queryIndex++;
                                                handle(isSuccess, noTrigger);
                                            });
                                            return;
                                        }
                                        next(isSuccess, noTrigger);
                                    }
                                    handle();
                                } else {
                                    triggerSuccess();
                                }

                                beacon.on(curServiceEvents.COMPLETE, resultData);
                                beacon.on(serviceEvents.COMPLETE, resultData);
                                options.scope && beacon.on(EVENTS.DATA_CHANGE, options.scope);
                            });

                            var header = configs.header || {};
                            header['Content-Type'] = 'application/json;charset=utf-8';

                            var requestParam = {
                                method: configs.method,
                                url: getURL(configs),
                                data: params && JSON.stringify(params) || null,
                                header: header
                            };

                            var next = function() {
                                request.request(requestParam);
                            }

                            if (configs.beforeQuery && configs.beforeQuery.length) {
                                var queryIndex = 0;
                                var queryLength = configs.beforeQuery.length;
                                var handle = function() {
                                    var cb = configs.beforeQuery[queryIndex];
                                    if (queryIndex < queryLength && cb) {
                                        cb(requestParam,
                                        function() {
                                            queryIndex++;
                                            handle();
                                        });
                                        return;
                                    }
                                    next();
                                }
                                handle();
                            } else {
                                next();
                            }

                            return resultData
                        },
                        on: beacon.on,
                        off: beacon.off,
                        once: beacon.once,
                        EVENTS: curServiceEvents
                    }

                    return api;
                };
                return {
                    getInstance: getInstance
                };
            }
        }
        return serviceAPI;
    };

    service.EVENTS = serviceEvents;
    return service;
})
