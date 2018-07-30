Air.Module("B.view.View", function (require) {
    var scopeManager = require('B.scope.scopeManager');
    var EVENTS = require('B.event.events');
    var View = (function () {
        function View(viewName, dom, options) {
            if (options === void 0) { options = {}; }
            this.initQueue = [];
            this.showBeforeQueue = [];
            this.showAfterQueue = [];
            this.hideQueue = [];
            this.events = {
                onShow: beacon.createEvent('view onShow'),
                onHide: beacon.createEvent('view onHide')
            };
            this.show = function () {
                this.dom.setAttribute('active', 'true');
            };
            this.hide = function () {
                this.dom.removeAttribute('active');
            };
            this.getDom = function () {
                return this.dom;
            };
            this.viewName = viewName;
            if (beacon.isType(dom, 'String')) {
                var domWrapper = View.createDomByString(dom);
                this.dom = domWrapper.querySelector("view[name=\"" + viewName + "\"]");
                View.parseTag('style', viewName, domWrapper, function (tagList) {
                    View.loadStyle(tagList, dom);
                });
                View.parseTag('script', viewName, domWrapper, function (tagList) {
                    View.loadScript(tagList, dom, options.initCallback);
                });
            }
            else {
                this.dom = dom;
            }
        }
        ;
        View.createDomByString = function (templateString) {
            var div = document.createElement('div');
            if (typeof DOMParser === 'undefined') {
                div.innerHTML = 'X<div></div>' + templateString;
            }
            else {
                div.innerHTML = templateString;
            }
            return div;
        };
        View.loadStyle = function (styleList, dom) {
            for (var i = 0, len = styleList.length; i < len; i++) {
                var style = styleList[i];
                dom.appendChild(style);
            }
        };
        View.loadScript = function (scriptList, dom, fn) {
            setTimeout(function () {
                View.runJS(scriptList, dom);
            }, 0);
            fn && fn();
        };
        View.runJS = function (scripts, dom) {
            for (var scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
                var activeScript = scripts[scriptIndex];
                var tmpScript = document.createElement('script');
                var src = activeScript.src;
                activeScript.parentNode && activeScript.parentNode.removeChild(activeScript);
                if (src) {
                    Air.loadJS(src);
                }
                else {
                    tmpScript.text = activeScript.text;
                    dom.appendChild(tmpScript);
                }
            }
            ;
        };
        View.splitDom = function (domWrapper, cssSelector) {
            var elements = domWrapper.getElementsByTagName(cssSelector);
            elements = [].concat.apply([], elements);
            return elements;
        };
        View.parseTag = function (tagName, viewName, domWrapper, fn) {
            var domList = View.splitDom(domWrapper, tagName);
            domList = [].concat.apply([], domList);
            for (var i = 0; i < domList.length; i++) {
                var needScope = true;
                var tagScope = scopeManager.parseScope(viewName + tagName, domList[i], needScope);
                fn && fn(domList);
            }
        };
        View.prototype.getViewName = function () {
            return this.viewName;
        };
        ;
        View.prototype.parseSrc = function () {
            var els = this.dom.querySelectorAll('[b-src]');
            if (!els) {
                return;
            }
            for (var i = 0, len = els.length; i < len; i++) {
                var el = els[i];
                var src = el.getAttribute('b-src');
                if (src) {
                    el.setAttribute('src', src);
                }
            }
        };
        ;
        return View;
    }());
    return View;
});
