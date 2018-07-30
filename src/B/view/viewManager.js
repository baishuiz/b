Air.Module("B.view.viewManager", function (require) {
    var View = require("B.view.View");
    var router = require('B.router.router');
    var HTTP = require('B.network.HTTP');
    var memCache = require('B.data.memCache');
    var scopeManager = require('B.scope.scopeManager');
    var EVENTS = require('B.event.events');
    var middleware = require('B.util.middleware');
    var loading = {
        loadingHandle: null,
        showLoading: function () {
            loading.loadingHandle && loading.loadingHandle.show();
        },
        hideLoading: function () {
            loading.loadingHandle && loading.loadingHandle.hide();
        },
        setLoading: function (handle) {
            loading.loadingHandle = handle;
        },
        unsetLoading: function () {
            loading.loadingHandle = null;
        }
    };
    var ViewManager = (function () {
        function ViewManager() {
            this.loading = loading;
            this.loadingViewList = [];
        }
        ViewManager.prototype.setMainViewport = function (viewport) {
            this.mainViewport = viewport;
        };
        ViewManager.prototype.initLocalView = function (viewport) {
            var viewportElement = viewport.dom;
            var views = viewportElement.children;
            var viewCount = views.length;
            for (var viewIndex = 0; viewIndex < viewCount; viewIndex++) {
                var activeView = views[viewIndex];
                if (activeView.tagName.toLowerCase() === 'view') {
                    var activeViewName = activeView.getAttribute('name');
                    var view = new View(activeViewName, activeView);
                    viewport.views[activeViewName] = view;
                    scopeManager.parseScope(activeViewName, view.getDom());
                }
            }
        };
        ViewManager.prototype.getViewByViewName = function (viewName) {
            return this.mainViewport.views[viewName];
        };
        ViewManager.prototype.appendView = function (viewName, view) {
            this.mainViewport.dom.appendChild(view.getDom());
            this.mainViewport.views[viewName] = view;
        };
        ViewManager.prototype.changeURLParams = function (viewName, options) {
            if (options === void 0) { options = {}; }
            if (options.isComponent) {
                return;
            }
            var $scope = scopeManager.getScopeInstance(viewName);
            $scope['$request'] = $scope.$request || {};
            $scope.$request.params = options.params;
        };
        ViewManager.prototype.getURL = function (viewName, options) {
            var url = router.getURLPathByViewName(viewName, {
                params: options.params,
                query: options.query,
                hash: options.hash
            });
            return url;
        };
        ViewManager.prototype.switchURL = function (viewName, options) {
            if (options === void 0) { options = {}; }
            if (options.isComponent) {
                return;
            }
            var url = this.getURL(viewName, options);
            var isReplace = options.replace;
            if (history.pushState && history.replaceState) {
                var changeURLState = isReplace ? history.replaceState : history.pushState;
                changeURLState && changeURLState.call(history, {
                    viewName: viewName,
                    params: options.params,
                    hash: options.hash
                }, viewName, url);
            }
            else {
                if (isReplace) {
                    !options.init && location.replace(url);
                }
                else {
                    location.href = url;
                }
            }
            this.runURLChangeMiddleWare();
        };
        ViewManager.prototype.runURLChangeMiddleWare = function () {
            var fnName = 'afterURLChange';
            middleware.run(fnName);
        };
        ViewManager.prototype.listenURLChange = function () {
            var _this = this;
            beacon(window).on('popstate', function (e) {
                var state = e.state || {};
                _this.saveLastView();
                if (state.viewName) {
                    var hasView = _this.getViewByViewName(state.viewName);
                    if (hasView) {
                        _this.changeURLParams(state.viewName, state);
                        _this.show(state.viewName);
                        _this.runURLChangeMiddleWare();
                    }
                    else {
                        var URLPath = location.pathname;
                        var activeRouter = router.getMatchedRouter(URLPath);
                        if (activeRouter) {
                            _this.goTo(activeRouter.viewName, {
                                replace: true,
                                params: activeRouter.params,
                                query: location.search,
                                hash: location.hash
                            });
                        }
                        else {
                            _this.throw404();
                        }
                    }
                }
            });
        };
        ViewManager.prototype.show = function (viewName) {
            var view = this.getViewByViewName(viewName);
            if (view) {
                view.parseSrc();
                this.switchView(view);
            }
            else {
                this.throw404();
            }
        };
        ViewManager.prototype.throw404 = function () {
            var fnName = 'viewNotFound';
            middleware.run(fnName);
        };
        ;
        ViewManager.prototype.saveLastView = function () {
            this.lastView = this.getActive();
        };
        ViewManager.prototype.setActive = function (view) {
            this.activeView = view;
        };
        ViewManager.prototype.switchView = function (view) {
            var lastViewName = '';
            if (this.lastView) {
                lastViewName = this.lastView.getViewName();
                this.triggerOnHide(this.lastView, view);
            }
            this.setActive(view);
            this.activeView.show();
            this.triggerOnShow(this.activeView, lastViewName);
            loading.hideLoading();
        };
        ViewManager.prototype.triggerOnHide = function (curView, toView) {
            var viewName = curView.getViewName();
            curView && curView.hide();
            beacon(curView).on(curView.events.onHide, {
                to: toView
            });
            var $scope = scopeManager.getScopeInstance(viewName);
            beacon($scope).on(EVENTS.DATA_CHANGE);
        };
        ViewManager.prototype.triggerOnShow = function (curView, lastViewName) {
            var viewName = curView.getViewName();
            if (viewName !== lastViewName) {
                beacon(curView).on(curView.events.onShow, {
                    from: lastViewName
                });
            }
            var $scope = scopeManager.getScopeInstance(viewName);
            beacon($scope).on(EVENTS.DATA_CHANGE);
        };
        ViewManager.prototype.initLocalViewport = function () {
            var viewportList = [];
            var viewports = document.querySelectorAll('viewport');
            var viewportCount = viewports.length;
            for (var viewportIndex = 0; viewportIndex < viewportCount; viewportIndex++) {
                var activeViewportElement = viewports[viewportIndex];
                var isMainViewport = (activeViewportElement.getAttribute('main') === 'true');
                var activeViewport = {
                    'dom': activeViewportElement,
                    'views': {}
                };
                viewportList.push(activeViewport);
                isMainViewport && this.setMainViewport(activeViewport);
                this.initLocalView(activeViewport);
            }
        };
        ViewManager.prototype.loadView = function (viewName, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            loading.showLoading();
            var env = memCache.get('env');
            var curRouter = router.get(viewName);
            var sign = curRouter.sign || '';
            var extPath = sign ? '_' + sign : '';
            var templateBasePath = options.templatePath || env.$templatePath;
            var templatePath = templateBasePath + viewName + extPath + '.html';
            var http = new HTTP();
            var successCallBack = function (xhr) {
                var responseText = xhr.responseText;
                var view = new View(viewName, responseText, {
                    initCallback: function () {
                    }
                });
                var scope = scopeManager.parseScope(viewName, view.getDom());
                _this.changeURLParams(viewName, options);
                _this.appendView(viewName, view);
                _this.saveLastView();
                _this.setActive(view);
                beacon(scope).once(EVENTS.RUN_COMPLETE, function () {
                    _this.switchURL(viewName, options);
                    _this.show(viewName);
                    _this.removeLoadingView(viewName);
                });
            };
            var errorCallBack = function () {
                _this.throw404();
            };
            http.get(templatePath, {
                successCallBack: successCallBack,
                errorCallBack: errorCallBack
            });
        };
        ViewManager.prototype.viewIsLoading = function (viewName) {
            return !this.loadingViewList.indexOf(viewName);
        };
        ViewManager.prototype.addLoadingView = function (viewName) {
            var idx = beacon.utility.arrayIndexOf(this.loadingViewList, viewName);
            if (idx === -1) {
                this.loadingViewList.push(viewName);
            }
        };
        ViewManager.prototype.removeLoadingView = function (viewName) {
            var idx = beacon.utility.arrayIndexOf(this.loadingViewList, viewName);
            if (idx !== -1) {
                this.loadingViewList.splice(idx, 1);
            }
        };
        ViewManager.prototype.goTo = function (viewName, options) {
            var _this = this;
            var fnName = 'beforeGoTo';
            var paramObj = { viewName: viewName, options: options };
            var next = function () {
                var hasView = _this.getViewByViewName(viewName);
                if (!_this.viewIsLoading(viewName)) {
                    if (hasView) {
                        _this.saveLastView();
                        _this.switchURL(viewName, options);
                        _this.changeURLParams(viewName, options);
                        _this.show(viewName);
                    }
                    else {
                        _this.addLoadingView(viewName);
                        _this.loadView(viewName, options);
                    }
                }
            };
            middleware.run(fnName, paramObj, next);
        };
        ViewManager.prototype.jump = function (options) {
            var url = options.url || '';
            var projectPath = options.project || '';
            var urlPath = options.urlPath || '';
            var query = options.query || '';
            projectPath = projectPath.replace(/^\//, '');
            var reg = new RegExp('^(\/)?(' + projectPath + '[\/|$])?');
            urlPath = urlPath.replace(reg, '');
            if (url) {
                location.href = url;
            }
            else {
                location.href = '/' + (projectPath || '') + '/' + (urlPath || '') + (query || '');
            }
        };
        ViewManager.prototype.back = function () {
            window.history.back();
        };
        ViewManager.prototype.addMiddleware = function (middlewareName, fn) {
            middleware.add(middlewareName, fn);
        };
        ViewManager.prototype.removeMiddleware = function (middlewareName, fn) {
            middleware.remove(middlewareName, fn);
        };
        ViewManager.prototype.getActive = function () {
            return this.activeView;
        };
        ViewManager.prototype.getScopeKeyByViewName = function (viewName) {
            var dom = this.activeView.getDom();
            var subViewDom = dom.querySelector('view[name="' + viewName + '"]');
            return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
        };
        ViewManager.prototype.getTemplate = function (viewName, options) {
            if (options === void 0) { options = {}; }
            var env = memCache.get('env');
            var path = options.path || env.$templatePath;
            var templatePath = path + options.templatePath.replace(/\./g, '/') + '.html';
            var errorCallBack = options.errorCallBack || function () { };
            var template = this.templateCache[viewName];
            if (template) {
                return template;
            }
            ;
            var http = new HTTP();
            http.get(templatePath, {
                successCallBack: function (xhr) {
                    var responseText = xhr.responseText;
                    this.templateCache[viewName] = responseText;
                    options.onSuccess && options.onSuccess(responseText);
                },
                errorCallBack: errorCallBack
            });
        };
        ViewManager.prototype.init = function (env) {
            scopeManager.setRoot(env);
            this.initLocalViewport();
            var URLPath = location.pathname;
            var activeRouter = router.getMatchedRouter(URLPath);
            var hash = location.hash;
            if (activeRouter) {
                this.goTo(activeRouter.viewName, {
                    replace: true,
                    init: true,
                    params: activeRouter.params,
                    query: location.search,
                    hash: hash
                });
            }
            else {
                this.throw404();
            }
            this.listenURLChange();
        };
        return ViewManager;
    }());
    return new ViewManager();
});
