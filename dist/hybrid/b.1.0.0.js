!function(a){function b(a){this.target=a}var c=a.beacon,d=function(c){return this!==a&&d.blend(this,d),new b(c)};d.toString=function(){return"baishuiz@gmail.com"};var e={base:f,avatarCore:b.prototype,self:f,init:function(){var b=Object.freeze;a.beacon=d,e.merge(d,f),delete a.beacon.base,b&&b(d)},login:function(){a.beacon=d},logoff:function(){a.beacon=c}},f={base:e};a.beacon=f}(this),function(a){var b=a.base||{},c={merge:function(a){for(var b=arguments.length,c=1;b>c;c++){var d=arguments[c];for(var e in d)a[e]!==d[e]&&(a[e]=d[e])}return a},blend:function(a,b,d){var e={cover:!0,mergePrototype:!1,reset:!1};if(d=d?c.merge(e,d):e,b=[].concat(b),d.reset)for(var f in a)b[0][f]||(b[0][f]=void 0);for(var g=b.length,h=0;g>h;h++){var i=b[h];for(var j in i){var k=d.mergePrototype||i.hasOwnProperty(j),l=d.cover||!a[j];k&&l&&(a[j]=i[j])}}return a},isType:function(a,b){return"Null"===b&&null===a||"Undefined"===b&&void 0===a||"Number"===b&&isFinite(a)||Object.prototype.toString.call(a).slice(8,-1)===b},arrayIndexOf:function(a,b){return c.arrayIndexOf=Array.prototype.indexOf?function(a,b){return a=[].slice.call(a,0),a.indexOf(b)}:function(a,b){a=[].slice.call(a,0);for(var c=a.length;c>=0;c--)if(a[c]===b)return c;return c},c.arrayIndexOf(a,b)},each:function(a,b){if(a){a=[].concat(a);for(var c=0;c<a.length;c++)b.call(a[c],c,a[c])}}};c.blend(b,c)}(beacon),function(a){var b=a.base,c=function(a){function c(a){var b=e(f,a);0>b&&(b=f.push(a)-1);var c="event_"+b,d=a.toString()===a,g=d?a:c;return g}function d(a){var b=e(f,a);return 0>b?null:c(a)}var e=b.arrayIndexOf,f=[],g={dom:a,target:a,attachEvent:function(a,b){var d=c(a);f[d]=f[d]||[],f[d].push(b)},removeEvent:function(a,b){var d,e=a&&c(a),g=e&&f[e];if(a&&b)for(var h=g.length-1;h>=0;h--){var i=g[h];i===b&&(d=f[e].splice(h,1))}else a&&!b?(d=f[e],f[e]=[]):a||b||(d=f,f=[]);return d},getEventList:function(a){var b;if(!a)return f.slice(0);var c=d(a);return c&&(b=a?f[c]:f.slice(0)),b}};return g};b.EventStructure=c}(beacon),function(a){function b(a){var b=new j(a);return h.push(b),b}function c(a,c,d){var e=g(a)||b(a);e.attachEvent(c,d)}function d(a,b,d){var e=b.registEvent(d),f=b.getEventList();i.each(f,function(b){c(a,f[b],e)})}function e(a,b,c){var d=h.slice(0),e=a?g(a)||[]:h.slice(0);i.each(e,function(a,e){if(e.removeEvent(b,c),!b&&!c||0==e.getEventList().length){var a=i.arrayIndexOf(h,e);d.splice(a,1)}}),h=d}function f(a,b,c){var d=b.removeEvent(c);i.each(d,function(c){var f=d[c],g=b.getEventList();i.each(g,function(b,c){e(a,c,f)})})}function g(a){if(!a)return h.slice(0);for(var b=0;b<h.length;b++){var c=h[b];if(c.target===a)return c}}var h=[],i=a.base,j=i.EventStructure,k={registEvent:c,registCombinationEvent:d,removeEvent:e,removeCombinationEvent:f,getEventList:g};i.eventStore=k}(beacon),function(a){function b(){if(this instanceof b)return this;var a=[],d=[],e=[].slice.call(arguments,0),f=e.slice(0),g=function(){function b(){return f=e.slice(0)}var g=function(b,e){var f=c.arrayIndexOf(a,b);0>f&&(a.push(b),d.push(e))},h=function(b){var e=c.arrayIndexOf(a,b),f=d[e];return b?f:d.slice(0)};this.resetEventList=b,this.getEventList=function(){return e.slice(0)},this.registEvent=function(a){var d=c.arrayIndexOf,f=e.slice(0),h=function(c,e){var g=this,h=d(f,c.eventType);h>=0&&f.splice(h,1),0===f.length&&(a.call(g,e),f=b())};return g(a,h),h},this.removeEvent=function(a){var b=[].concat(h(a));return b}};return g.prototype=new b,new g}var c=a.base;c.combinationalEvent=b}(beacon),function(a){var b=a.base,c=b.eventStore,d=c.registCombinationEvent,e=c.registEvent,f=c.removeCombinationEvent,g=c.removeEvent,h=c.getEventList,i={hostProxy:{},attachActionEvent:function(a,c,d){var e=a.desc,f=b.isType(a.desc,"Function");f&&e(c,d);var g=["touchmove","mousemove"];b.each(g,function(b,c){f&&window.beacon(document).on(c,function(b){i.publicDispatchEvent(a,b)})})},attachEvent:function(a,c){var f=this,g=a instanceof b.combinationalEvent?d:e;i.attachActionEvent(a,f,c),g(f,a,c)},fireEvent:function(a,c){var d=this,e=h(d);if(e){var f=e.getEventList(a),g=b.isType(a.desc,"Function"),i=g&&a.desc(c);!!i==!!g&&b.each(f,function(b,e){var f={eventType:a};e.call(d,f,c)})}},publicDispatchEvent:function(a,c){var d=h(),e=b.isType(a.desc,"Function");e&&a.desc(c),b.each(d,function(b){var e=d[b].dom;i.fireEvent.call(e,a,c)})},removeEvent:function(a,c){var d=this,e=a instanceof b.combinationalEvent?f:g;e(d,a,c)}},j=function(){var a=function(){};return a.prototype=i,b.blend(a,i),a}();b.Event=j}(beacon),function(a){var b=a.base,c=function(){return this}(),d=b.EventStructure,e={structures:[],getStructure:function(a){for(var b,c,d=0;d<e.structures.length;d++){b=e.structures[d];try{c=b.dom===a}catch(f){b.dom=window.document,c=b.dom===a}if(c)return b}},add:function(a,b,c){var f=e.getStructure(a);f||(f=new d(a),e.structures.push(f)),f.attachEvent(b,c)},remove:function(a,b,c){var d=e.getStructure(a);return d&&d.removeEvent(b,c)}},f={attachEvent:function(a,b){var d,e=this,g=function(a,b){var c=this;c.addEventListener(a,b,!1)},h=function(a,b){var c=this;c.attachEvent("on"+a,b)},i=function(a,b){var c=this,d=c["on"+a];c["on"+a]=function(){d.call(c),b.call(c)}};return c.addEventListener?(g.call(e,a,b),d=g):c.attachEvent?(h.call(e,a,b),d=h):(i.call(e,a,b),d=i),f.attachEvent=d},fireEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style;var d=document.createEvent("Event");d.initEvent(a,b.bubbles,b.cancelable),b.state&&(d.state=b.state),c.dispatchEvent(d)},f=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style,a="on"+a;var d=document.createEventObject();d.cancelBubble=b.cancelable,c.fireEvent(a,d)};return document.createEvent&&d.dispatchEvent?(e.call(d,a,b),c=e):document.createEventObject&&d.fireEvent&&(f.call(d,a,b),c=f),c},removeEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;c.removeEventListener(a,b,!1)},g=function(a,b){var c=this;c.detachEvent("on"+a,b)};return d.removeEventListener?(e.call(d,a,b),c=e):d.detachEvent&&(g.call(d,a,b),c=g),f.removeEvent=c}},g={attachEvent:function(a,b){var c=this;e.add(c,a,b),f.attachEvent.call(c,a,b)},fireEvent:function(a,b){var c=this;g.fireEVent=f.fireEvent.call(c,a,b)},removeEvent:function(a,c){var d=this;if(a&&c)f.removeEvent.call(d,a,c);else if(a&&!c){var h=e.remove(d,a);h&&b.each(h,function(){var b=this;g.removeEvent.call(d,a,b)})}else if(!a&&!c){var i=e.remove(d);i&&b.each(i,function(){var a=this;a&&b.each(i[a],function(){var b=this;g.removeEvent.call(d,a,b)})})}},isHTMLElement:function(a){var b=a==document||a==window,c=function(a){var b=a&&a.nodeName;return b&&a.nodeType};return b||c(a)},isEventSupported:function(a,c){if(!g.isHTMLElement(a)||!b.isType(c,"String"))return!1;var d=!1;if(a===window||a===document){d="on"+c in a;var e=!!window.ActiveXObject,f=e&&!!document.documentMode;if(!d&&f)return!1;if(d)return!0;var h=document.createElement("iframe");h.style.display="none",document.body.appendChild(h);var i=a===window?h.contentWindow:h.contentDocument;g.attachEvent.call(i,c,function(){d=!0}),g.fireEvent.call(i,c),h.parentNode.removeChild(h)}else{var j=a.tagName,c="on"+c;a=document.createElement(j),d=c in a,d||(a.setAttribute(c,"return;"),d="function"==typeof a[c]),a=null}return d}};b.DOMEvent=g}(beacon),function(a){var b=a.base,c={on:function(){var b=a.base,c=b.isType,d=b.Event.hostProxy,e=b.Event.publicDispatchEvent,f=b.Event.attachEvent,g=function(a,b){var g=[].slice.call(arguments,0);b&&c(b,"Function")?f.apply(d,g):e.apply(d,g)};return g}(a),once:function(a,b){var d=function(e,f){c.off(a,d),b.call({},e,f)};c.on(a,d)},off:function(){var b=a.base,c=b.Event.hostProxy,d=function(){var a=[].slice.call(arguments,0);b.Event.removeEvent.apply(c,a)};return d}(),blend:b.blend,NS:b.NS,arrayIndexOf:b.ArrayIndexOf,isType:b.isType,Enum:b.Enum,loginGlobal:b.login,logoffGlobal:b.logoff,utility:b,createEvent:function(){var a,c=[].slice.call(arguments,0);return a=arguments.length>1?b.combinationalEvent.apply(this,c):{desc:c[0]}}},d={on:function(b,c){var d=[].slice.call(arguments,0),e=this.target,f=a.base,g=f.DOMEvent.isHTMLElement(e),h=f.DOMEvent.isEventSupported(e,b),i=g&&h?f.DOMEvent.fireEvent:f.Event.fireEvent,j=g&&h?f.DOMEvent.attachEvent:f.Event.attachEvent;c&&f.isType(c,"Function")?f.each(e,function(a,b){j.apply(b,d)}):f.each(e,function(a,b){i.apply(b,d)})},once:function(a,b){var c=this,e=function(f,g){d.off.call(c,a,e),b.call(c,f,g)};d.on.call(c,a,e)},off:function(a,c,d){var e=this.target,f=b.DOMEvent.isHTMLElement(e),g=a&&b.DOMEvent.isEventSupported(e,a);f&&g?b.DOMEvent.removeEvent:b.Event.removeEvent,b.each(e,function(e,g){var h=a&&b.DOMEvent.isEventSupported(g,a);f&&b.DOMEvent.removeEvent.call(g,a,c,d),h||b.Event.removeEvent.call(g,a,c,d)})}};b.blend(b.avatarCore,d),b.blend(a,c),b.init()}(beacon),function(a){function b(a){this.target=a}var c=function(a){return new b(a)};c.toString=function(){return"baishuiz@gmail.com"};var d=document.getElementsByTagName("script"),e=d[d.length-1],f={avatarCore:b.prototype,plugins:{},attach:function(a,b){f.plugins[a]=b},baseURL:e.src.replace(/\/[^\/]+$/,"/"),URLMap:{},CDNTimestamp:e.getAttribute("data-CDNTimestamp")||"",isDebug:!1,init:function(b){a.Air=f.plugins.merge(c,b)}},g={base:f};a.Air=g}(this),function(a){var b={NS:function(a,b){for(var c=a.split("."),d=b||window||{},b=d,e=0,f=c.length;f>e;e++)d[c[e]]=void 0===d[c[e]]?{}:d[c[e]],d=d[c[e]];return d},beacon:beacon,merge:beacon.utility.merge,setBaseURL:function(b){return beacon.isType(b,"Object")?(a.base.URLMap=b,a.base.baseURL=b.base||a.base.baseURL):a.base.baseURL=b||a.base.baseURL}};b.merge(a.base.plugins,b)}(Air),function(a){function b(){try{document.documentElement.doScroll("left")}catch(a){return void setTimeout(b,1)}g()}function c(a){return 1==d?void a():void e.push(a)}var d=!1,e=[],f=a.base.plugins.beacon,g=(a.base.plugins,function(){f(document).off("readystatechange",h),f(document).off("DOMContentLoaded",g),f(window).off("load",g);for(var a;a=e.shift();)d||a();d=!0}),h=function(){(/loaded|complete/.test(document.readyState)||1==d)&&g()};f(document).on("readystatechange",h),f(document).on("DOMContentLoaded",g),f(window).on("load",g),document.documentElement.doScroll&&b(),a.base.attach("DOMReady",c)}(Air),function(a,b){function c(a,b){var c=1;this.loadJS=function(){if(/\bArray\b/.test(Object.prototype.toString.call(a))){c=a.length;for(var d=c-1;d>=0;d--)e(a[d],function(){--c||b()})}else e(a,b)}}function d(){function a(){b.currentJs||(b.currentJs=b.shift(),b.currentJs&&b.currentJs.loadJS())}var b=[];b.currentJs=null,this.loadJS=function(d,e){var f=function(){b.currentJs=null,e&&e(),a()};return b.push(new c(d,f)),a(),this}}function e(a,c){var d,e=document.getElementsByTagName("head")[0],f=document.createElement("script"),g=!1,h=b.base.plugins.beacon,i=function(){g=!0,h(f).off("load"),h(f).off("readystatechange"),i=function(){},c&&c()},j=function(){/loaded|complete/.test(f.readyState)&&0==g&&i()};f.async=!0,f.setAttribute("type","text/javascript"),f.src=a,h(f).on("load",i),h(f).on("readystatechange",j),h(f).on("error",i);for(var k=document.getElementsByTagName("script"),l=0,m=k.length;!d&&m>l;l++)d=a==k[l].getAttribute("src");d||e.appendChild(f)}function f(a,b){var c=new d;return c.loadJS(a,b),c}b.base.attach(a,f)}("loadJS",Air),function(a){function b(b,d){"use strict";function e(){var e=i.toLowerCase(),f=h.toLowerCase(),g=a.base,j=g.plugins.beacon,k=g.plugins.NS,l=g.plugins.NS(h.toLowerCase(),g)[e],m=d(g.Require,g.run);l?"function"==typeof m?k(f,g)[e]=g.plugins.merge(m,l):g.plugins.merge(l,m):k(f,g)[e]=m,c[b.toLowerCase()]=!0,j.on(a.base.Require.Event.LOADED,{moduleName:b})}var f=a.base.plugins;f.beacon.on(a.base.Require.Event.REQUIREING,{moduleName:b});var g=b.match(/(^.*)\.(\w*)$/),h=g[1],i=g[2],j=d.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");j=j.replace(/(['"\/])[\w\W]*?\1|((['"\/])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var k=j.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(j,""),l=k&&new RegExp("\\b"+k+"\\s*\\(([^\\)]+)\\)","gm"),m=[];l&&j.replace(l,function(b,d){var e,f,g=/['" ]/g,h=d.split(",");h.length>1?(e=h[0].replace(g,""),f=h[1].replace(g,"")):e=d.replace(g,"");var i=e.toLowerCase();c[i]||(m[i]=m.push(i)-1),a.base.Require(e,f)});var n=new String(b);m.length&&beacon(n).on(a.base.Require.Event.LOADED,function(b,c){var d=c.moduleName.toLowerCase();m.hasOwnProperty(d)&&(delete m[d],m.splice(m[d],1)),m.length<=0&&(beacon(n).off(a.base.Require.Event.LOADED),e())}),m.length||e()}var c={};a.base.Module=b}(Air),function(a){function b(a){if(a)return g.moduleLoaded[a];for(var b=0,c=g.requireQueue.length;c>b;b++){var d=g.requireQueue[b];if(!g.moduleLoaded[d])return!1}return!0}function c(){d.on(f.COMPLETE),d(document).on("readystatechange"),c=function(){d.on(f.COMPLETE)}}var d=a.base.plugins.beacon,e=d.createEvent,f={COMPLETE:e("require_complete"),LOADED:e("require_loaded"),REQUIREING:e("require_requireing")},g={requiring:{},required:{},moduleLoaded:{},requireQueue:[]};d(g).on(f.REQUIREING,function(a,b){var c=b.moduleName.toLowerCase();g.requireQueue[c]||g.requireQueue.push(c),g.required[c]=!0});var h=function(d,e){function f(b){var c=b.match(/(^.*)(\.\w*)$/),d=(c[1],c[2],a.base.CDNTimestamp||"");return d=d&&"?"+d,a.base.baseURL+b.replace(/\./gi,"/")+".js"+d}function h(d){i(d)||(g.requiring[d]=!0,a.base.plugins.loadJS(e,function(){if(!g.required[d])throw new Error("module ["+d+"] is undefined! @"+e);b()&&c()}))}function i(a){return g.required[a]||g.requiring[a]||g.moduleLoaded[a]}var j=d;if(d=d.toLowerCase(),g.required[d]||g.requiring[d]||g.moduleLoaded[d])return a.base.plugins.NS(d,a.base);if(e){var k=a.base.URLMap||{};e=e.replace(/{{(.+)}}/g,function(b,c){return k[c]||a.base.baseURL})}return e=e||f(j),d=d.toLowerCase(),g.requireQueue[d]=!0,g.requireQueue.push(d),h(d),a.base.plugins.NS(d,a.base)};d.on(f.LOADED,function(a,d){var e=d.moduleName.toLowerCase();g.required[e]=!0,g.moduleLoaded[e]=!0,b()&&c()}),h.Event=f,h.isRequireComplete=b,a.base.Require=h}(Air),function(a){function b(){for(;function(){var a=c.shift();return a&&a(),c.length}(););}var c=[],d=a.base.plugins.beacon,e=a.base.Require.Event;d.on(e.COMPLETE,b);var f=function(){function f(){for(var b=0;b<h.length;b++){var c=h[b];if(!h[c]&&!a.base.Require.isRequireComplete(c))return!1}return!0}var g,h=[];this.runNow&&d.on(e.LOADED,function(a,b){var c=b.moduleName.toLowerCase();h[c]=!0,beacon.utility.arrayIndexOf(h,c)>=0&&f()&&g&&g()}),this.run=function(d){g=d,this.runNow?f()&&d():(c.push(d),a.base.Require.isRequireComplete()&&b())},this.require=function(b,c){if(a.base.Require(b,c),b=b.toLowerCase(),h.push(b),!c){var d=b.match(/(^.*)\.(\w*)$/),e=d[1],f=d[2];a.base.plugins.NS(e,a.base)[f]}var g=a.base.plugins.NS(b,a.base);return g}},g=function(a,b){"use strict";var c=g;if(!(this instanceof c))return new c(a,b,arguments);var d=[].slice.call(arguments[2]).slice(2),e=this;e.runNow=b,f.call(e);var h=a.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");h=h.replace(/(['"\/])[\w\W]*?\1|((['"\/])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var i=h.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(h,""),j=i&&new RegExp("\\b"+i+"\\s*\\(([^\\)]+)\\)","gm");j&&h.replace(j,function(a,b){var c,d,f=/['" ]/g,g=b.split(",");g.length>1?(c=g[0].replace(f,""),d=g[1].replace(f,"")):c=b.replace(f,""),e.require(c,d)}),e.run(function(){var b=[e.require].concat(d);a.apply(this,b)})};a.base.attach("run",g)}(Air),function(a){var b=a.base.plugins,c={run:b.run,iRun:function(a){b.run(a,!0)},loadJS:b.loadJS,Module:a.base.Module,merge:a.base.merge,NS:b.NS,Enum:a.base.Enum,domReady:b.DOMReady,moduleURL:b.setBaseURL,setCDNTimestamp:a.base.setCDNTimestamp};a.base.init(c)}(Air);;Air.Module('B.util.middleware', function () {
    var middlewares = {};
    function add(fnName, fn) {
        if (fnName && fn) {
            middlewares[fnName] = middlewares[fnName] || [];
            middlewares[fnName].push(fn);
        }
    }
    function remove(fnName, fn) {
        if (fnName && fn) {
            var list = middlewares[fnName] || [];
            var index = list.indexOf(fn);
            if (index !== -1) {
                list.splice(index, 1);
            }
        }
    }
    function run(fnName, paramObj, next) {
        var fns = middlewares[fnName];
        var fnLength = fns && fns.length;
        next = next || function () { };
        if (fnLength) {
            var fnIndex_1 = 0;
            var handle_1 = function () {
                var fn = fns[fnIndex_1];
                if (fnIndex_1 < fnLength && fn) {
                    fn(paramObj, function () {
                        fnIndex_1++;
                        handle_1.apply(handle_1, arguments);
                    });
                    return;
                }
                next.apply(next, arguments);
            };
            handle_1();
        }
        else {
            next();
        }
    }
    return {
        add: add,
        run: run,
        remove: remove
    };
});
;Air.Module("B.util.node", function () {
    var node = function (node) {
        var api = {
            hasAttribute: function (attributeName) {
                return node.attributes.getNamedItem(attributeName);
            }
        };
        return api;
    };
    node.type = {
        TEXT: 3,
        HTML: 1,
        ATTR: 2
    };
    return node;
});
;Air.Module('B.util.util', function (require) {
    var nodeUtil = require('B.util.node');
    var Util = (function () {
        function Util() {
        }
        Util.isEmpty = function (obj) {
            if (obj == null) {
                return true;
            }
            var isObject = beacon.utility.isType(obj, 'Object');
            var isArray = beacon.utility.isType(obj, 'Array');
            if (!isObject && !isArray) {
                return false;
            }
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        };
        ;
        Util.enums = function (keys) {
            var result = {};
            for (var i = keys.length - 1; i >= 0; i--) {
                result[keys[i]] = keys[i];
            }
            ;
            return result;
        };
        ;
        Util.getData = function (pathString, root) {
            var rootParent = root.parent;
            var nsPath = pathString.split("."), ns = root || window || {}, root = ns;
            for (var i = 0, len = nsPath.length; i < len; i++) {
                if (!ns || (ns[nsPath[i]] === undefined)) {
                    return rootParent && Util.getData(pathString, rootParent);
                }
                else {
                    ns = ns[nsPath[i]];
                }
            }
            ;
            return ns;
        };
        Util.trim = function (str) {
            str = str || '';
            return str.trim ? str.trim() : str.replace(/^\s+|\s+^/, '');
        };
        ;
        Util.isHTML = function (node) {
            return node ? node.nodeType === nodeUtil.type.HTML : false;
        };
        return Util;
    }());
    ;
    return Util;
});
;Air.Module("B.bridge", function() {
  var PROTOCOL_KEY = 'cjiahybrid';

  /**
   * 执行 Hybrid 方法
   * @param {String} fnName 方法名
   * @param {Object} param  传入参数对象
   */
  function run(fnName, param, options) {
    if (!fnName) {
      return;
    }
    options = options || {};

    var url = generateUrl(fnName, param, options);

    var iframe = document.createElement('iframe');
    var cont = document.body || document.documentElement;

    iframe.style.display = 'none';
    iframe.setAttribute('src', url);
    cont.appendChild(iframe);

    setTimeout(function(){
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 200);
  }

  /**
   * 生成访问的Url
   * @param {String} fnName       方法名
   * @param {Object} param        传入参数对象
   * @param {Object} options      选项
   *   @options {boolean} unified 使用统一回调，默认 true
   * @return {String} url
   */
  function generateUrl(fnName, param, options) {
    param = param || {};
    var url = PROTOCOL_KEY + '://' + fnName + '?jsparams=';
    var unified = typeof options.unified === 'boolean' ? options.unified : true;

    if (unified) {
      param.success = register(fnName, param.success);
      param.failed = register(fnName, param.failed);
    }

    url += encodeURIComponent(JSON.stringify(param));

    return url;
  }

  /**
   * 注册全局回调
   * @param {String} fnName 方法名
   * @param {Function} fn 回调方法
   * @return {String} callbackName 方法名（PROTOCOL_KEY + GUID + 毫秒数）
   */
  function register(fnName, fn, options) {
    var callbackName = PROTOCOL_KEY + getGUID() + new Date().getTime();
    options = options || {};
    var keepCallback = typeof options.keepCallback === 'boolean' ? options.keepCallback : false;
    console.log(fnName, callbackName);

    window[callbackName] = function() {
      if (typeof fn === 'function') {
        fn.apply(window, arguments);
      }
      if (!keepCallback) {
        destroyCallback(callbackName);
      }
    }

    return callbackName;
  }
  /**
   * 销毁全局回调
   * @param {String} callbackName 方法名
   */
  function destroyCallback(callbackName) {
    delete window[callbackName];
  }

  /**
   * 获取不带连接符的GUID
   * @return {String} guid
   */
  function getGUID() {
    var lut = [];
    for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }

    function generater() {
      var d0 = Math.random() * 0xffffffff | 0;
      var d1 = Math.random() * 0xffffffff | 0;
      var d2 = Math.random() * 0xffffffff | 0;
      var d3 = Math.random() * 0xffffffff | 0;
      return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    return generater();
  }

  var isHybrid = /^file:/.test(location.protocol);

  return {
    run: run,
    register: register,
    isHybrid: isHybrid,
    isInApp: true
  };
});
;Air.Module('B.data.memCache', function () {
    var MEMORY_CACHE = {};
    var EXPIRED_LIST = {};
    function set(key, value, options) {
        if (!key) {
            return;
        }
        MEMORY_CACHE[key] = value;
        if (options && typeof options.expiredSecond === 'number') {
            var now = new Date();
            now.setSeconds(now.getSeconds() + options.expiredSecond);
            EXPIRED_LIST[key] = now;
        }
    }
    function get(key) {
        if (!key) {
            return;
        }
        var value = MEMORY_CACHE[key];
        var expiredTime = EXPIRED_LIST[key];
        if (expiredTime) {
            var now = new Date();
            if (now.getTime() > expiredTime.getTime()) {
                delete MEMORY_CACHE[key];
                delete EXPIRED_LIST[key];
                return undefined;
            }
        }
        return value;
    }
    return {
        get: get,
        set: set
    };
});
;Air.Module('B.data.storage', function(require){
  var bridge = require('B.bridge');
  var two = function(str) {
    str = (str || '') + '';
    if (str.length === 1) {
      str = '0' + str;
    }
    return str;
  }

  var set = function(key, value, options) {
    if (!key) {
      return;
    }
    options = options || {};
    var expiredSecond = typeof options.expiredSecond === 'number' ? options.expiredSecond : 0;
    var expireTime = 0;

    if (expiredSecond) {
      expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + expiredSecond);
      expireTime = expireTime.getFullYear() + two(expireTime.getMonth() + 1) + two(expireTime.getDate()) +
                   two(expireTime.getHours()) + two(expireTime.getMinutes()) + two(expireTime.getSeconds());
    }

    var param = {
      key: key,
      value: JSON.stringify(value)
    };

    if (expireTime) {
      param['expireTime'] = expireTime;
    }

    bridge.run('setdata', param);
  };

  var get = function(key, callback){
    if (!key) {
      callback && callback();
      return;
    }
    var param = {
      key: key,
      success: function(res) {
        var result = res && res.result;
        try {
          result = JSON.parse(result);
        } catch (e) {
          result = null;
        }
        callback && callback(result);
      },
      failed: function() {
        callback && callback(null);
      }
    };

    bridge.run('getdata', param);
  }

  return {
    get: get,
    set: set
  }
});
;Air.Module("B.event.events", function () {
    var events = {
        DATA_CHANGE: beacon.createEvent("data change"),
        RUN_COMPLETE: beacon.createEvent("run complete"),
        URL_CHANGE: beacon.createEvent("url change"),
        USER_ACTION: beacon.createEvent("user action"),
        PAGE_SHOW: beacon.createEvent("page show"),
        PAGE_HIDE: beacon.createEvent("page hide"),
        PAGE404: beacon.createEvent("")
    };
    return events;
});
;Air.Module('B.directive.event', function (require) {
    var node = require('B.util.node'), EVENTS = require('B.event.events');
    var attribute = 'b-event';
    var reg = /\((.*)\)/;
    var api = function (target, $scope) {
        if (!node(target).hasAttribute(attribute)) {
            return;
        }
        var cmd = target.getAttribute(attribute);
        var cmdList = cmd.split(";");
        for (var i = 0; i < cmdList.length; i++) {
            bind(cmdList[i], i);
        }
        ;
        function getParentScope($scope) {
            return $scope;
        }
        function bind(cmd, eventIndex) {
            var eventName = cmd.match(/^\s*(\w+)\s+/)[1];
            beacon(target).on(eventName, function (e) {
                var cmd = target.getAttribute(attribute);
                var cmdList = cmd.split(";");
                var handleStr = cmdList[eventIndex].replace(eventName, '');
                var eventHandleName = handleStr.replace(reg, '').replace(/\s/g, '');
                var eventParam = handleStr.match(reg)[1];
                var params = eval("[" + eventParam + "]");
                params.unshift(e);
                this.$index = $scope.$index;
                var scope = getParentScope($scope);
                var eventHandle = ($scope.$event && $scope.$event[eventHandleName]) ||
                    (scope.$event && scope.$event[eventHandleName]);
                eventHandle && eventHandle.apply(this, params);
                beacon(scope).on(EVENTS.DATA_CHANGE, scope);
            });
        }
    };
    return api;
});
;Air.Module('B.directive.show', function (require) {
    var node = require('B.util.node'), EVENTS = require('B.event.events'), util = require('B.util.util');
    var attribute = 'b-show';
    var api = function (target, scopeStructure, watchData) {
        var isShowElement = node(target).hasAttribute(attribute);
        isShowElement && processShowElement(target, scopeStructure, watchData);
    };
    api.key = attribute;
    function processShowElement(target, scopeStructure, watchData) {
        var $scope = scopeStructure.scope;
        var scopeIndex = scopeStructure.name;
        var attrNode = target.getAttributeNode(attribute);
        attrNode.nodeValue = '{{(' + attrNode.nodeValue + ')}}';
        var callbackNow = true;
        watchData(attrNode.nodeValue, attrNode, scopeIndex, watchElement, callbackNow);
        function watchElement(displayStatus) {
            displayStatus ? showHide(target, true) : showHide(target);
        }
    }
    function getData(target, key) {
        target.bData = target.bData || {};
        return target.bData[key];
    }
    function setData(target, key, value) {
        target.bData = target.bData || {};
        target.bData[key] = value;
        return value;
    }
    function getCSS(target, name) {
        var display = target.style.display;
        if (!display) {
            display = window.getComputedStyle ? window.getComputedStyle(target, null)[name] : target.currentStyle[name];
        }
        return display;
    }
    var elemdisplay = {};
    function actualDisplay(name) {
        var target = document.body.appendChild(document.createElement(name));
        var display = getCSS(target, 'display');
        document.body.removeChild(target);
        return display;
    }
    function defaultDisplay(nodeName) {
        var display = elemdisplay[nodeName];
        if (!display) {
            display = actualDisplay(nodeName);
            elemdisplay[nodeName] = display;
        }
        return display;
    }
    function showHide(target, show) {
        var display, hidden, olddisplay;
        if (!target || !target.style) {
            return;
        }
        olddisplay = getData(target, 'olddisplay');
        display = target.style.display;
        if (show) {
            if (!olddisplay && display === 'none') {
                target.style.display = '';
                display = '';
            }
            if (display === '') {
                olddisplay = setData(target, 'olddisplay', defaultDisplay(target.nodeName));
            }
        }
        else {
            if (display && display !== 'none') {
                setData(target, 'olddisplay', display);
            }
        }
        if (!show || display === 'none' || display === '') {
            target.style.display = show ? olddisplay || '' : 'none';
        }
    }
    return api;
});
;Air.Module('B.directive.exist', function (require) {
    var node = require('B.util.node'), EVENTS = require('B.event.events'), util = require('B.util.util');
    var attribute = 'b-exist';
    var api = function (target, scopeStructure, watchData) {
        var isShowElement = node(target).hasAttribute(attribute);
        isShowElement && processShowElement(target, scopeStructure, watchData);
    };
    api.key = attribute;
    function processShowElement(target, scopeStructure, watchData) {
        var $scope = scopeStructure.scope;
        var scopeIndex = scopeStructure.name;
        var attrNode = target.getAttributeNode(attribute);
        if (attrNode.nodeValue) {
            attrNode.nodeValue = '{{(' + attrNode.nodeValue + ')}}';
        }
        else {
            return;
        }
        var callbackNow = true;
        watchData(attrNode.nodeValue, attrNode, scopeIndex, watchElement, callbackNow);
        function watchElement(displayStatus) {
            displayStatus && removeDom(target);
        }
    }
    function removeDom(target) {
        if (!target) {
            return;
        }
        var parent = target.parentElement;
        parent && parent.removeChild(target);
    }
    return api;
});
;Air.Module('B.directive.style', function (require) {
    var node = require('B.util.node'), EVENTS = require('B.event.events'), util = require('B.util.util');
    var attribute = 'b-style';
    var api = function (target, scopeStructure, watchData) {
        var isStyleElement = node(target).hasAttribute(attribute);
        isStyleElement && processStyleElement(target, scopeStructure, watchData);
    };
    function processStyleElement(target, scopeStructure, watchData) {
        var $scope = scopeStructure.scope;
        var scopeIndex = scopeStructure.name;
        var attrNode = target.getAttributeNode(attribute);
        var tags = attrNode.nodeValue.match(/{{.*?}}/g) || [];
        for (var i = 0; i < tags.length; i++) {
            var activeTag = tags[i];
            watchData(activeTag, attrNode, scopeIndex, watchElement);
        }
        function watchElement(displayStatus) {
            target.style.cssText = displayStatus;
        }
    }
    var elemdisplay = {};
    return api;
});
;Air.Module('B.directive.property', function (require) {
    var node = require('B.util.node'), EVENTS = require('B.event.events'), util = require('B.util.util');
    var attribute = 'b-property';
    var api = function (target, scopeStructure, watchData) {
        var hasPropertyAttr = node(target).hasAttribute(attribute);
        hasPropertyAttr && setProperty(target, scopeStructure, watchData);
    };
    function setProperty(target, scopeStructure, watchData) {
        var $scope = scopeStructure.scope;
        var scopeIndex = scopeStructure.name;
        var attrNode = target.getAttributeNode(attribute);
        var ruleStr = target.getAttribute(attribute);
        var propertyList = getPropertyList(ruleStr);
        for (var i = 0; i < propertyList.length; i++) {
            var activeProperty = propertyList[i];
            (function (dataPath, name) {
                var value = util.getData(dataPath, $scope);
                if (value !== undefined) {
                    target[name] = value;
                }
                var bindPath = '{{' + dataPath + '}}';
                watchData(bindPath, attrNode, scopeIndex, function () {
                    var value = util.getData(dataPath, $scope);
                    target[name] = value;
                });
            })(activeProperty.dataPath, activeProperty.name);
        }
    }
    function getPropertyList(ruleStr) {
        var reg = /(\w+)\s*:\s*([^,}\s]+)/g;
        var result = [];
        ruleStr.replace(reg, function (matchRule, propertyName, dataPath) {
            var item = {
                name: propertyName,
                dataPath: dataPath
            };
            result.push(item);
        });
        return result;
    }
    return api;
});
;Air.Module('B.directive.model', function (require) {
    var nodeUtil = require('B.util.node'), util = require('B.util.util'), EVENTS = require("B.event.events");
    var attrName = 'b-model';
    function getTargetIndex(checkedList, target, selector, context) {
        context = context || document;
        var targetGroup = context.querySelectorAll(selector);
        for (var i = 0; i < targetGroup.length; i++) {
            var activeTarget = targetGroup[i];
            if (beacon.utility.arrayIndexOf(checkedList, activeTarget.value) >= 0) {
                activeTarget.checked = true;
            }
            else {
                activeTarget.checked = false;
            }
        }
    }
    function setScopeData(dataPath, value, scope) {
        var nodeList = dataPath.split('.');
        var lastNode = nodeList.pop();
        var prefixPath = nodeList.join('.');
        if (prefixPath) {
            util.getData(prefixPath, scope)[lastNode] = value;
        }
        else {
            scope[lastNode] = value;
        }
        var result = {
            prefixPath: prefixPath,
            lastNode: lastNode
        };
        return result;
    }
    var api = function (target, scopeStructure, watchData) {
        var $scope = scopeStructure.scope;
        var scopeIndex = scopeStructure.name;
        var activeModel = null;
        if (!nodeUtil(target).hasAttribute(attrName)) {
            return;
        }
        var attrNode = target.getAttributeNode(attrName);
        var dataPath = target.getAttribute(attrName)
            .replace(/{{|}}/ig, '');
        var value = util.getData(dataPath, $scope);
        (typeof value !== 'undefined') && modelChangeHandle();
        function onInput(e) {
            var target = this;
            var value;
            if (target.type === 'checkbox') {
                var _dataPath = target.getAttribute('b-model');
                value = util.getData(_dataPath, $scope);
                if (beacon.utility.isType(value, 'Array')) {
                    var itemIndex = beacon.utility.arrayIndexOf(value, target.value);
                    if (target.checked) {
                        value.push(target.value);
                    }
                    else {
                        itemIndex >= 0 && value.splice(itemIndex, 1);
                    }
                    var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') + ']';
                    var context = b.views.getActive().getDom();
                }
                else {
                    value = target.checked;
                }
            }
            else {
                value = target.value;
            }
            var dataPathInfo = setScopeData(dataPath, value, $scope);
            var removedEvent = e.type === 'input' ? 'change' : 'input';
            beacon(target).off(removedEvent, onInput);
        }
        beacon(target).on('input', onInput);
        beacon(target).on('change', onInput);
        watchData('{{' + dataPath + '}}', attrNode, scopeIndex, modelChangeHandle);
        function modelChangeHandle() {
            var value = util.getData(dataPath, $scope);
            if (target.value === value && target.type !== "radio") {
                target.initValue = value;
                return;
            }
            ;
            var result = !util.isEmpty(value) ? value : "";
            if (beacon.utility.isType(value, 'Array')) {
                var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') + ']';
                var context = b.views.getActive().getDom();
                var targetIndex = getTargetIndex(result, target, selector, context);
                return;
            }
            if (target.value !== value || target.type == "radio") {
                target.initValue = result;
                if (target.type !== 'file') {
                    if (target.type == "radio") {
                        target.checked = target.value == result;
                    }
                    else {
                        target.checked = result;
                        target.value = result;
                    }
                }
            }
        }
    };
    api.key = attrName;
    return api;
});
;Air.Module('B.scope.Scope', function (require) {
    var EVENTS = require('B.event.events');
    var util = require('B.util.util');
    function createDescriptor(textNode, value, callback, scope, dataPath) {
        var descriptor = {
            enumerable: true,
            configurable: true,
            get: function () {
                return value;
            },
            set: function (val) {
                var hasChanged = value !== val;
                var isArray = beacon.utility.isType(val, 'Array');
                var isObject = beacon.utility.isType(val, 'Object');
                var isPathNode = beacon.utility.isType(value, 'Array') || beacon.utility.isType(value, 'Object');
                if (hasChanged) {
                    if (isPathNode) {
                        value = value || (isArray ? [] : {});
                        if (isObject) {
                            for (var aa in value) {
                                if (!(aa in val)) {
                                    val[aa] = undefined;
                                }
                            }
                        }
                        beacon.utility.merge(value, val);
                    }
                    else {
                        value = beacon.utility.isType(val, 'Undefined') ? '' : val;
                        callback && callback();
                    }
                }
            }
        };
        return descriptor;
    }
    var Scope = (function () {
        function Scope(parent) {
            this.parent = parent;
        }
        return Scope;
    }());
    var api = function (parent) {
        Scope.prototype = parent || {};
        Scope.prototype.constructor = Scope;
        return new Scope(parent);
    };
    return api;
});
;Air.Module('B.scope.ScopeTreeManager', function (require) {
    var Scope = require('B.scope.Scope');
    var ScopeTreeManager = (function () {
        function ScopeTreeManager(rootScope) {
            if (rootScope === void 0) { rootScope = {}; }
            this.scopeMap = {};
            var scopeStructure = ScopeTreeManager.getStructure();
            scopeStructure.scope = rootScope;
            this.rootScope = scopeStructure;
        }
        ScopeTreeManager.getStructure = function () {
            return {
                scope: null,
                pn: null,
                name: null
            };
        };
        ;
        ScopeTreeManager.prototype.getScope = function (scopeName) {
            return this.getScopeByName(scopeName);
        };
        ScopeTreeManager.prototype.getRoot = function () {
            return this.rootScope;
        };
        ScopeTreeManager.prototype.setRootScope = function (scope) {
            this.rootScope.scope = scope;
        };
        ScopeTreeManager.prototype.addScope = function (parentName, scopeName) {
            var parentScopeStructure = this.getScope(parentName) || this.rootScope;
            var newScope = ScopeTreeManager.getStructure();
            this.scopeMap[scopeName] = newScope;
            newScope.scope = new Scope(parentScopeStructure.scope);
            newScope.pn = parentName;
            newScope.name = scopeName;
            return scopeName;
        };
        ScopeTreeManager.prototype.getScopeByName = function (scopeName) {
            return this.scopeMap[scopeName];
        };
        ScopeTreeManager.prototype.getScopeInstanceByName = function (scopeName) {
            var scopeStructure = this.getScope(scopeName) || {};
            return scopeStructure.scope;
        };
        return ScopeTreeManager;
    }());
    return ScopeTreeManager;
});
;Air.Module('B.directive.Repeater', function (require) {
    var attrName = 'b-repeat';
    var util = require('B.util.util');
    Array.prototype.unshift = function (_unshift) {
        return function (item) {
            var lastValue = JSON.stringify(this[this.length - 1]);
            this[this.lenght] = {};
            var result = _unshift.call(this, item);
            if (lastValue) {
                this[this.length - 1] = JSON.parse(lastValue);
            }
            return this.length;
        };
    }(Array.prototype.unshift);
    function getTemplateStr(str, idx, dataPath, dataPrefix) {
        var reg = new RegExp("\\b\(" + dataPrefix + "\)\\b", 'g');
        var repeatIndexREG = new RegExp('\\b' + dataPath + '\\.\\d+\\.\\$index\\b', 'g');
        var repeatIndexREG2 = new RegExp('{{\\b' + dataPath + '\\.\\d+\\.\\$index\\b}}', 'g');
        var result = str.replace(/\{\{.*?\}\}|b-show\s*=\s*"[^"]*?"|b-exist\s*=\s*"[^"]*?"|b-model\s*=\s*"[^"]*?"|b-property\s*=\s*"[^"]*"|b-repeat\s*=\s*"[^"]*"/g, function (tag) {
            return tag.replace(reg, dataPath + '.' + idx);
        });
        result = result.replace(repeatIndexREG2, idx);
        result = result.replace(repeatIndexREG, idx);
        return result;
    }
    function fixSelectElement(placeholder, target) {
        if (target.nodeName.toLowerCase() == 'option') {
            setTimeout(function () {
                placeholder.parentNode.value = placeholder.parentNode.initValue;
            }, 0);
        }
    }
    function Repeater(template, currentScopeIndex, scopeStructure, parseTemplate) {
        var scope = scopeStructure.scope;
        var uiElementCount = 0;
        var tag = generatePlaceholder(template);
        var expressionStr = template.getAttribute('b-repeat');
        var expressionREG = /(\S+)\s+in\s+(\S+)/;
        var expression = expressionStr.match(expressionREG) || [];
        var dataPath = expression[2];
        var dataPrefix = expression[1];
        var templateStr = template.outerHTML;
        var parentNode = template.parentNode;
        var childsTemplate = template.innerHTML;
        var containerTagName = parentNode.tagName.toLowerCase();
        parentNode.removeChild(template);
        var obj = {};
        function generatePlaceholder(target) {
            if (target.placeholder) {
                return target.placeholder;
            }
            var placeholder = document.createComment('repeat placeholder ' + target.getAttribute(attrName));
            target.parentNode.insertBefore(placeholder, target);
            target.placeholder = placeholder;
            return placeholder;
        }
        var getCount = function (path) {
            var data = util.getData(path || dataPath, scope) || [];
            var count = data.length || 0;
            return count;
        };
        var getDataPrefix = function () {
            return dataPrefix;
        };
        var addUI = function (num) {
            var elementContent = '';
            var elementContainer = document.createDocumentFragment();
            var newFirstNode = null;
            var newNodeList = [];
            for (var i = 0; i < num; i++) {
                var uiIndex = uiElementCount + i;
                elementContent = getTemplateStr(templateStr, uiIndex, dataPath, dataPrefix);
                var docContainer = document.createElement(containerTagName);
                docContainer.innerHTML = elementContent;
                var targetNode = docContainer.firstChild;
                targetNode.removeAttribute('b-repeat');
                targetNode.$index = uiIndex;
                elementContainer.appendChild(targetNode);
                newNodeList.push(targetNode);
            }
            var isSelect = containerTagName === 'select';
            var initValue;
            var parentNode = tag.parentNode;
            if (isSelect) {
                initValue = parentNode.initValue;
            }
            parentNode.insertBefore(elementContainer, tag);
            if (isSelect) {
                setTimeout(function () {
                    parentNode.value = initValue;
                }, 0);
            }
            fixSelectElement(tag, targetNode);
            elementContainer = null;
            docContainer = null;
            uiElementCount += num;
            return newNodeList;
        };
        var getPreviousElement = function (elm) {
            var e = elm.previousSibling;
            while (e && 1 !== e.nodeType) {
                e = e.previousSibling;
            }
            return e;
        };
        var removeUI = function (num) {
            num = Math.abs(num);
            for (var i = 0; i < num; i++) {
                var previousSibling = getPreviousElement(tag);
                if (previousSibling) {
                    tag.parentNode.removeChild(previousSibling);
                }
            }
            uiElementCount -= num;
        };
        var updateUI = function (path) {
            var repeatCount = getCount(path);
            var num = repeatCount - uiElementCount;
            var isRemove = num < 0;
            var isAdd = num > 0;
            isRemove && removeUI(num);
            var newFirstNode = isAdd && addUI(num);
            return newFirstNode;
        };
        var descriptorList = [];
        function bindRepeatData(repeater, dataPath, isinit) {
            var activePath = '';
            var pathNodes = dataPath.split('.') || [];
            for (var i = 0; i < pathNodes.length; i++) {
                var nextPathNode = pathNodes[i];
                var activeObj = activePath ? util.getData(activePath, scope) : scope;
                activeObj = activeObj || Air.NS(activePath, scope);
                var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);
                var existDescriptor = Object.getOwnPropertyDescriptor(activeObj, nextPathNode);
                if (existDescriptor && existDescriptor.get && (descriptorList.indexOf(existDescriptor) < 0)) {
                    descriptorList.push(existDescriptor);
                }
                if (isinit) {
                    beacon(scope).on('updateRepeatData' + (pathNodes.slice(0, i + 1).join('')), function (e, args) {
                        bindRepeatData(api, args.dataPath);
                        args.callback && args.callback();
                    });
                }
                var descriptor = createRepeatDataDescriptor.call(activeObj, repeater, nextObj, pathNodes.slice(0, i + 1).join('.'));
                (typeof activeObj === 'object' && !(i !== pathNodes.length - 1 && existDescriptor && existDescriptor.get)) && Object.defineProperty(activeObj, nextPathNode, descriptor);
                activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
            }
        }
        function fixUnshift(val, value, descriptor) {
            value.unshift = function (item) {
                var result = [].concat(item, this);
                descriptor.set([]);
                descriptor.set([].concat(result));
                return result;
            };
        }
        function createRepeatDataDescriptor(repeater, value, dataPath) {
            var oldLength = 0;
            value = value || [];
            var descriptor = {
                enumerable: true,
                configurable: true,
                get: function () {
                    setTimeout(function () {
                        var length = value && value.length || 0;
                        if (oldLength !== length) {
                            var nodes = repeater.updateUI();
                            for (var i = 0; i < nodes.length; i++) {
                                var activeNode = nodes[i];
                                activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex);
                            }
                            for (var i = 0; i < descriptorList.length; i++) {
                                descriptorList[i] && descriptorList[i].get && descriptorList[i].get();
                            }
                        }
                        oldLength = length;
                    }, 0);
                    return value;
                },
                set: function (val, isSub) {
                    var hasChanged = value !== val;
                    if (!val) {
                        val = beacon.utility.isType(value, 'Array') ? [] : {};
                    }
                    var isArray = beacon.utility.isType(val, 'Array');
                    var isObject = beacon.utility.isType(val, 'Object');
                    if (!hasChanged) {
                        return;
                    }
                    if (isObject) {
                        value = value || {};
                        for (var key in value) {
                            if (!val[key]) {
                                val[key] = undefined;
                            }
                        }
                        for (var key in value) {
                            var existDescriptor = Object.getOwnPropertyDescriptor(value, key);
                            if (!(existDescriptor && existDescriptor.get)) {
                                if (beacon.utility.isType(value[key], 'Array')) {
                                    bindRepeatData(repeater, dataPath + '.' + key, true);
                                }
                                else if (beacon.utility.isType(value[key], 'Object')) {
                                    beacon.on('updateObjectData', {
                                        currentScopeIndex: currentScopeIndex,
                                        dataPath: dataPath + '.' + key
                                    });
                                }
                            }
                        }
                        if (!isSub) {
                            beacon.utility.merge(value, val);
                        }
                    }
                    else if (isArray) {
                        value = value || [];
                        fixUnshift(val, value, descriptor);
                        if (!isSub) {
                            var oldLen = value.length;
                            var newLen = val.length;
                            if (val.length === 0) {
                                value.splice(0);
                            }
                            else {
                                for (var key in value) {
                                    var keyNum = parseInt(key, 10);
                                    var isNumKey = beacon.utility.isType(keyNum, 'Number') && !isNaN(keyNum);
                                    if (!isNumKey && !val[key]) {
                                        val[key] = undefined;
                                    }
                                }
                            }
                            if (newLen < oldLen) {
                                value.splice(newLen - oldLen, oldLen - newLen);
                            }
                            oldLength = newLen;
                            beacon.utility.merge(value, val);
                        }
                        var nodes = repeater.updateUI();
                        for (var i = 0; i < nodes.length; i++) {
                            var activeNode = nodes[i];
                            activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex);
                        }
                    }
                    else {
                        value = val;
                    }
                }
            };
            return descriptor;
        }
        var api = {
            updateUI: updateUI,
            getDataPrefix: getDataPrefix
        };
        bindRepeatData(api, dataPath, true);
        return api;
    }
    return Repeater;
});
;Air.Module('B.scope.tagManager', function (require) {
    var util = require('B.util.util');
    var nodeMap = [];
    function addNode(scopeIndex, token, node, callback) {
        nodeMap[scopeIndex] = nodeMap[scopeIndex] || {};
        nodeMap[scopeIndex][token] = nodeMap[scopeIndex][token] || [];
        nodeMap[scopeIndex][token].push({
            element: node,
            template: node.$template,
            callback: callback
        });
    }
    function getNodes(scopeIndex, token) {
        var node = nodeMap[scopeIndex];
        var nodeList = node && node[token] || [];
        return nodeList;
    }
    function updateNodeValue(scopeIndex, scope, token, callback) {
        var nodes = getNodes(scopeIndex, token);
        var _loop_1 = function (i) {
            var activeNode = nodes[i];
            var newValue = activeNode.element.$template.replace(/{{(.*?)}}/g, function (tag, expression) {
                return eval(expression) || '';
            });
            var ownerElement = activeNode.element.ownerElement;
            if (ownerElement && ownerElement.nodeName.toLowerCase() === 'option' && ownerElement.parentNode) {
                setTimeout(function () {
                    if (ownerElement.parentNode) {
                        ownerElement.parentNode.value = ownerElement.parentNode.initValue;
                    }
                }, 0);
            }
            activeNode.element.nodeValue = newValue;
            activeNode.callback && activeNode.callback(newValue);
        };
        for (var i = 0; i < nodes.length; i++) {
            _loop_1(i);
        }
    }
    var api = {
        addNode: addNode,
        getNodes: getNodes,
        updateNodeValue: updateNodeValue
    };
    return api;
});
;Air.Module('B.scope.scopeManager', function (require) {
    var rootScope = {};
    var ScopeTreeManager = require('B.scope.ScopeTreeManager');
    var initModel = require('B.directive.model');
    var eventDirective = require('B.directive.event');
    var showDirective = require('B.directive.show');
    var existDirective = require('B.directive.exist');
    var styleDirective = require('B.directive.style');
    var propertyDirective = require('B.directive.property');
    var Repeater = require('B.directive.Repeater');
    var tagManager = require('B.scope.tagManager');
    var util = require('B.util.util');
    var nodeUtil = require('B.util.node');
    var memCache = require('B.data.memCache');
    var scopeTreeManager = new ScopeTreeManager();
    function isView(node) {
        var isHTMLElement = util.isHTML(node);
        return isHTMLElement && (node.nodeName.toUpperCase() == 'VIEW');
    }
    function isRepeat(node) {
        var isHTMLElement = util.isHTML(node);
        return isHTMLElement && (node.hasAttribute('b-repeat'));
    }
    var backtrackingPoints = [];
    function bindObjectData(dataPath, currentScopeIndex, callback) {
        var scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
        var scope = scopeStructure.scope;
        var activePath = '';
        var pathNodes = dataPath.split('.') || [];
        for (var i = 0; i < pathNodes.length; i++) {
            var nextPathNode = pathNodes[i];
            var activeObj = activePath ? util.getData(activePath, scope) : scope;
            activeObj = activeObj || Air.NS(activePath, scope);
            var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);
            nextPathNode && (!(Object.getOwnPropertyDescriptor(activeObj, nextPathNode) && Object.getOwnPropertyDescriptor(activeObj, nextPathNode).set) || /^\d+$/.test(nextPathNode) || (i === pathNodes.length - 1)) &&
                Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex, callback));
            activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
        }
    }
    function getTokens(tag, node, scopeIndex) {
        node.$template = node.$template || node.nodeValue;
        var scope = scopeTreeManager.getScope(scopeIndex);
        var tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
        var result = [];
        var _loop_1 = function (i) {
            var token = util.trim(tokens[i]);
            if (!(/^\d+$/.test(token) || /^['"]/.test(token) || token == '' || token === 'true' || token === 'false')) {
                var tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')', 'g');
                var lastTagStr = (node.$tag || tag);
                var tagStr = lastTagStr.replace(tokenReg, function ($0, $1, $2) {
                    if ($0.indexOf('util.getData("' + token) >= 0) {
                        return $0;
                    }
                    else {
                        return $0.replace($2, 'util.getData("' + token + '", scope)');
                    }
                });
                node.$template = node.$template.replace(lastTagStr, tagStr);
                node.$tag = tagStr;
                result.push(token);
            }
        };
        for (var i = 0; i < tokens.length; i++) {
            _loop_1(i);
        }
        if (result.length === 0) {
            node.$tag = tag;
        }
        return result;
    }
    function tryGenerateSubViewScope(node, scopeStructure) {
        if (node.tagName.toLowerCase() === 'view') {
            var scopeKey = node.getAttribute('b-scope-key');
            var viewName_1 = node.getAttribute('name');
            var subScopeName = scopeKey || viewName_1;
            var subScope = scopeStructure.scope;
            var currentScopeName = scopeStructure.name;
            if (!subScope) {
                var subScopeIndex = scopeTreeManager.addScope(currentScopeName, subScopeName);
                subScope = scopeTreeManager.getScope(subScopeIndex);
            }
            if (scopeKey) {
                var controllerMap = memCache.get('controllerMap') || {};
                var controller_1 = controllerMap[viewName_1];
                if (controller_1) {
                    setTimeout(function () {
                        b.run(viewName_1, controller_1);
                    }, 0);
                }
            }
        }
        return scopeStructure;
    }
    function createDescriptor(value, dataPath, scopeIndex, callBack) {
        var scope = scopeTreeManager.getScope(scopeIndex);
        var oldLength = 0;
        var descriptor = {
            enumerable: true,
            configurable: true,
            get: function () {
                var isArray = beacon.utility.isType(value, 'Array');
                if (isArray) {
                    setTimeout(function () {
                        if (oldLength !== value.length) {
                            callBack && callBack();
                        }
                        oldLength = value.length;
                    }, 0);
                }
                return value;
            },
            set: function (val) {
                var hasChanged = value !== val;
                var isArray = beacon.utility.isType(val, 'Array');
                var isObject = beacon.utility.isType(val, 'Object');
                var isPathNode = isArray || isObject;
                if (hasChanged && isPathNode) {
                    value = value || (isArray ? [] : {});
                    if (isArray) {
                        var oldLen = value.length;
                        var newLen = val.length;
                        if (newLen < oldLen) {
                            value.splice(newLen - oldLen, oldLen - newLen);
                        }
                    }
                    if (isObject) {
                        for (var aa in value) {
                            if (!(aa in val)) {
                                val[aa] = undefined;
                            }
                        }
                    }
                    beacon.utility.merge(value, val);
                    isArray && callBack && callBack();
                }
                else {
                    if (value !== val) {
                        value = val;
                        tagManager.updateNodeValue(scopeIndex, scope.scope, dataPath);
                    }
                }
            }
        };
        return descriptor;
    }
    beacon.on('updateObjectData', function (e, args) {
        bindObjectData(args.dataPath, args.currentScopeIndex);
    });
    var ScopeManager = (function () {
        function ScopeManager() {
            this.getScope = function (scopeName) {
                return scopeTreeManager.getScopeByName(scopeName);
            };
            this.setRoot = function (scope) {
                return scopeTreeManager.setRootScope(scope);
            };
            this.getScopeInstance = function (scopeName) {
                return scopeTreeManager.getScopeInstanceByName(scopeName);
            };
        }
        ScopeManager.prototype.parseScope = function (viewName, viewElement, needScope) {
            var scopeStructure = scopeTreeManager.getScopeByName(viewName);
            if (!scopeStructure) {
                this.parseTemplate(viewElement, viewName);
                scopeStructure = scopeTreeManager.getScopeByName(viewName) || {};
            }
            return scopeStructure.scope;
        };
        ScopeManager.prototype.watchData = function (tag, node, scopeIndex, callback, callbackNow) {
            var scope = scopeTreeManager.getScope(scopeIndex);
            var tokens = getTokens(tag, node, scopeIndex);
            for (var i = 0; i < tokens.length; i++) {
                var activeToken = tokens[i];
                callback && callbackNow && callback(util.getData(activeToken, scope.scope));
                tagManager.addNode(scopeIndex, activeToken, node, callback);
                bindObjectData(activeToken, scopeIndex, callback);
            }
        };
        ScopeManager.prototype.parseTEXT = function (node, currentScopeIndex) {
            var tags = node.nodeValue.match(/{{.*?}}/g) || [];
            var scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
            var scope = scopeStructure.scope;
            for (var i = 0; i < tags.length; i++) {
                var activeTag = tags[i];
                this.watchData(activeTag, node, currentScopeIndex);
                if (node.$tag) {
                    var val = eval(node.$tag.replace(/(^{{)|(}}$)/g, '')) || '';
                    node.nodeValue = node.nodeValue.replace(activeTag, val);
                    node.$tag = '';
                }
            }
        };
        ScopeManager.prototype.parseHTML = function (node, currentScopeName) {
            var scopeStructure = scopeTreeManager.getScope(currentScopeName) || scopeTreeManager.getRoot();
            ;
            tryGenerateSubViewScope(node, scopeStructure);
            var scope = scopeStructure.scope;
            existDirective(node, scopeStructure, this.watchData);
            if (!node.parentElement) {
                return;
            }
            initModel(node, scopeStructure, this.watchData);
            eventDirective(node, scope);
            showDirective(node, scopeStructure, this.watchData);
            styleDirective(node, scopeStructure, this.watchData);
            propertyDirective(node, scopeStructure, this.watchData);
            var attributes = [].concat.apply([], node.attributes);
            for (var i = 0; i < attributes.length; i++) {
                var activeAttribute = attributes[i];
                if ([initModel.key, showDirective.key].indexOf(activeAttribute.name) !== -1) {
                    continue;
                }
                this.parseTEXT(activeAttribute, currentScopeName);
            }
        };
        ScopeManager.prototype.parseViewElement = function (view) {
            return view.lastChild;
        };
        ScopeManager.prototype.parseTemplate = function (rootElement, currentScopeName) {
            if (currentScopeName === void 0) { currentScopeName = 'root'; }
            var other = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                other[_i - 2] = arguments[_i];
            }
            var nodeIterator = document.createNodeIterator(rootElement, NodeFilter.SHOW_ALL);
            var scopeList = [];
            var lastViewEndElement = [];
            var currentNode = rootElement;
            do {
                if (isView(currentNode)) {
                    scopeList.push(currentScopeName);
                    var lastChildElement = currentNode.lastChild;
                    lastChildElement && lastViewEndElement.push(lastChildElement);
                    currentScopeName = currentNode.getAttribute('b-scope-key') || currentNode.getAttribute('name');
                    var parentScopName = scopeList[scopeList.length - 2];
                    scopeTreeManager.addScope(parentScopName, currentScopeName);
                }
                else if (isRepeat(currentNode)) {
                    var nextSibling = currentNode.nextSibling;
                    var repeatNode = this.createRepeatNodes(currentNode, currentScopeName);
                    if (repeatNode) {
                        for (var nodeIndex = 0; nodeIndex < repeatNode.length; nodeIndex++) {
                            var element = repeatNode[nodeIndex];
                            this.parseTemplate(element, currentScopeName);
                        }
                    }
                }
                switch (currentNode.nodeType) {
                    case nodeUtil.type.HTML:
                        this.parseHTML(currentNode, currentScopeName);
                        break;
                    case nodeUtil.type.TEXT:
                    case nodeUtil.type.ATTR:
                        this.parseTEXT(currentNode, currentScopeName);
                        break;
                    default:
                }
                if (lastViewEndElement[lastViewEndElement.length - 1] === currentNode) {
                    lastViewEndElement.pop();
                    currentScopeName = scopeList.pop();
                }
            } while (currentNode = nodeIterator.nextNode());
        };
        ScopeManager.prototype.createRepeatNodes = function (template, currentScopeIndex) {
            var _this = this;
            var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
            var parseTemplateProxy = function (node, scopeName, currentScopeIndex, isSub, needScope) {
                _this.parseTemplate(node, scopeName, currentScopeIndex, isSub, needScope);
            };
            var repeater = new Repeater(template, currentScopeIndex, scopeStructure, parseTemplateProxy);
            var newNodes = repeater.updateUI();
            return newNodes;
        };
        return ScopeManager;
    }());
    return new ScopeManager();
});
;Air.Module('B.network.HTTP', function () {
    var state = {
        unInit: 0,
        opend: 1,
        sended: 2,
        receiving: 3,
        complete: 4
    };
    function XHR() {
        var xhr = new XMLHttpRequest();
        var request = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === state.complete) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || (xhr.status == 0 && request.requestURL.match(/^file:/))) {
                    request.successCallBack && request.successCallBack(xhr);
                }
                else {
                    request.errorCallBack && request.errorCallBack(xhr);
                }
            }
        };
        this.xhr = xhr;
    }
    XHR.prototype = {
        request: function (options) {
            this.requestURL = options.url;
            this.successCallBack = options.successCallBack;
            this.errorCallBack = options.errorCallBack;
            this.xhr.open(options.method, options.url, true);
            for (var key in options.header) {
                this.xhr.setRequestHeader(key, options.header[key]);
            }
            this.xhr.send(options.data);
        },
        get: function (url, options) {
            options = options || {};
            this.request({
                method: 'GET',
                url: url,
                successCallBack: options.successCallBack,
                errorCallBack: options.errorCallBack
            });
        },
        abort: function () {
            this.xhr.abort();
        }
    };
    return XHR;
});
;Air.Module('B.service.Request', function (require) {
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
;Air.Module('B.service.Service', function (require) {
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
;Air.Module('B.service.serviceFactory', function (require) {
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
;Air.Module("B.router.router", function () {
    var Router = (function () {
        function Router() {
            this.routers = [];
        }
        Router.getURLByRule = function (rule, params, query, noOrigin) {
            var url = rule.replace(/:(\w+)/ig, function (param, key) {
                return params[key] || "";
            });
            var defaultOrigin;
            if (!location.origin) {
                defaultOrigin = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '');
            }
            url = (noOrigin ? '' : location.origin || defaultOrigin) + url + query;
            return url;
        };
        Router.tryMatchParams = function (activeRouter, urlPath) {
            var matchedRouter;
            var matchedParam = urlPath.match(activeRouter.reg);
            if (matchedParam) {
                matchedRouter = {
                    rule: activeRouter.rule,
                    viewName: activeRouter.viewName,
                    params: {}
                };
                var matchedParamCount = matchedParam.length;
                var marchedParamIndex = 1;
                for (marchedParamIndex; marchedParamIndex < matchedParamCount; marchedParamIndex++) {
                    var paramName = activeRouter.params[marchedParamIndex - 1];
                    matchedRouter.params[paramName] = matchedParam[marchedParamIndex];
                }
            }
            return matchedRouter;
        };
        Router.parseRule = function (ruleString) {
            var paramRule = /:[\w-]+/ig;
            var params = [];
            var matchRuleStr = ruleString.replace(paramRule, function (param) {
                params.push(param.replace(":", ""));
                return "([\\w-]+)";
            });
            var reg = new RegExp("^" + matchRuleStr + "\/*$", "i");
            return {
                reg: reg,
                params: params
            };
        };
        Router.prototype.set = function (routerConfig) {
            var ruleObj = Router.parseRule(routerConfig.rule);
            var router = {
                rule: routerConfig.rule,
                viewName: routerConfig.viewName,
                sign: routerConfig.sign,
                reg: ruleObj.reg,
                params: ruleObj.params
            };
            this.routers.push(router);
            this.routers[routerConfig.viewName] = router;
        };
        Router.prototype.getMatchedRouter = function (urlPath) {
            var rulesCount = this.routers.length;
            var ruleIndex = 0;
            for (ruleIndex; ruleIndex < rulesCount; ruleIndex++) {
                var activeRouter = this.routers[ruleIndex];
                var matchedRouter = Router.tryMatchParams(activeRouter, urlPath);
                if (matchedRouter) {
                    return matchedRouter;
                }
            }
            return null;
        };
        Router.prototype.getURLPathByViewName = function (viewName, options) {
            options = options || {};
            var params = options.params || {};
            var query = options.query || "";
            query = options.hash ? query + options.hash : query;
            var router = this.routers[viewName];
            var rule = router && router.rule || "";
            var url = Router.getURLByRule(rule, params, query, options.noOrigin);
            return url;
        };
        Router.prototype.get = function (viewName) {
            return this.routers[viewName] || {};
        };
        return Router;
    }());
    return new Router();
});
;Air.Module("B.view.View", function (require) {
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
;Air.Module("B.view.viewManager", function(require){
  var View = require("B.view.View");
  var router = require('B.router.router');
  var HTTP   = require('B.network.HTTP');
  var memCache = require('B.data.memCache');
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');
  var middleware = require('B.util.middleware');
  var bridge = require('B.bridge');
  var viewList = [],
      viewportList = [],
      loadingViewList = [], // 记载中的view
      activeView = null,
      mainViewport = null;
  var lastView = null;

  /**
   * 初始化首屏 View
   */
  function init(env){
    scopeManager.setRoot(env);
    initLocalViewport();
    var URLPath, query;
    if (bridge.isHybrid) {
      URLPath = location.hash.replace(/^#/, '') || '/';
      var URLPathAry = URLPath.split('?');
      URLPath = URLPathAry[0];
      query = URLPathAry[1] ? '?' + URLPathAry[1] : '';
    } else {
      URLPath = location.pathname;
      query = location.search;
    }
    var activeRouter = router.getMatchedRouter(URLPath);
    if (activeRouter) {
      goTo(activeRouter.viewName, {
        replace: true,
        init: true,
        params: activeRouter.params,
        query: query
      });
    } else {
      throw404();
    }
    listenURLChange();
    listenNativeAppear();
  }

  function initLocalViewport(){
    var viewports = document.querySelectorAll('viewport');
    var viewportIndex = 0;
    var viewportCount = viewports.length;
    for(; viewportIndex < viewportCount; viewportIndex++){
      var activeViewport = viewports[viewportIndex];
      var isMainViewport = (activeViewport.getAttribute('main')==='true');
      var activeViewportInfo = {
        dom : activeViewport,
        views : []
      };
      viewportList.push(activeViewportInfo);
      isMainViewport && setMainViewport(activeViewportInfo);
      initLocalView(activeViewportInfo);
    }
  }

  function appendView(viewName, view) {
    mainViewport.dom.appendChild(view.getDom());
    mainViewport.views[viewName] = view;
  }

  function setMainViewport(viewport){
    mainViewport = viewport;
  }

  function initLocalView(viewContainer){
    var viewport = viewContainer.dom;
    var views = viewport.children;
    var viewIndex = 0;
    var viewCount = views.length;
    for(; viewIndex < viewCount; viewIndex++){
      var activeView = views[viewIndex];

      if (activeView.tagName.toLowerCase() === 'view') {
        var activeViewName = activeView.getAttribute('name');
        var view = new View(activeViewName, activeView)
        viewContainer['views'][activeViewName] = view;
        scopeManager.parseScope(activeViewName, view.getDom());
      }
    }
  }



  function goTo (viewName, options){
    var fnName = 'beforeGoTo';
    var url = getURL(viewName, options);
    var paramObj = { viewName: viewName, options: options, url: url };
    var next = function(){
      var hasView = getViewByViewName(viewName);
      if (!viewIsLoading(viewName)) {
        if (hasView) {
          saveLastView();
          switchURL(viewName, options);
          changeURLParams(viewName, options);
          show(viewName);
        } else {
          addLoadingView(viewName);
          loadView(viewName, options);
        }
      }
    }

    // goTo 方法对外支持中间件，中间件参数为 paramObj
    middleware.run(fnName, paramObj, next);
  }

  function viewIsLoading(viewName) {
    return loadingViewList.indexOf(viewName) === -1 ? false : true;
  }

  function addLoadingView(viewName) {
    var idx = loadingViewList.indexOf(viewName);
    if (idx === -1) {
      loadingViewList.push(viewName);
    }
  }

  function removeLoadingView(viewName) {
    var idx = loadingViewList.indexOf(viewName);
    if (idx !== -1) {
      loadingViewList.splice(idx, 1);
    }
  }

  function changeURLParams(viewName, options) {
    options = options || {};
    if(options.isComponent){return;} // 全屏组件不切换 URL，也不需要更新URL参数
    var $scope = scopeManager.getScopeInstance(viewName);
    $scope['$request'] = $scope.$request || {};
    $scope.$request.params = options.params;
  }

  function getURL (viewName, options) {
    options = options || {}
    var url = router.getURLPathByViewName(viewName, {
      params: options.params,
      query: options.query,
      noOrigin: true
    });

    return url;
  }

  function switchURL (viewName, options) {
    options = options || {};
    if(options.isComponent){return;} // 全屏组件不切换 URL
    var url = getURL(viewName, options);

    // 不支持pushState则跳转。后续是否考虑锚点方案？
    var isReplace = options.replace;
    if (history.pushState && history.replaceState){
      var changeURLState = isReplace ? history.replaceState : history.pushState;
      changeURLState && changeURLState.call(history, {
        viewName: viewName,
        params: options.params
      }, viewName, url);
    } else {
      if (isReplace) { // 初始化不进行跳转，否则会循环跳转
        !options.init && location.replace(url);
      } else {
        location.href = url;
      }
    }

    runURLChangeMiddleWare();
  }

  function runURLChangeMiddleWare() {
    var fnName = 'afterURLChange';
    middleware.run(fnName);
  }

  function listenURLChange() {
    beacon(window).on('popstate', function(e){
      var state  = e.state || {};
      saveLastView();
      if (state.viewName) {
        var hasView = getViewByViewName(state.viewName);
        if (hasView) {
          changeURLParams(state.viewName, state);
          show(state.viewName);
          runURLChangeMiddleWare();
        } else {
          var URLPath = location.pathname;
          var activeRouter = router.getMatchedRouter(URLPath);
          if (activeRouter) {
            goTo(activeRouter.viewName, {
              replace: true,
              params: activeRouter.params,
              query: location.search
            });
          } else {
            throw404();
          }
        }
      }
    });
  }

  function show (viewName){
    var view = getViewByViewName(viewName);
    if (view) {
      view.parseSrc();
      switchView(view);
    } else {
      throw404();
    }
  }

  function hideNativeLoading() {
    bridge.run('hideloading');
  }


  function throw404(){
    var fnName = 'viewNotFound';
    middleware.run(fnName);
    hideNativeLoading();
  };

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function getScopeKeyByViewName(viewName) {
    var dom = activeView.getDom();
    var subViewDom = dom.querySelector('view[name="' + viewName + '"]');
    return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
  }

  //加载模板信息
  var templateCache = {};
  function getTemplate(viewName, options){
    options = options || {};
    var env = memCache.get('env');
    var path = options.path || env.$templatePath;
    var templatePath = path + options.templatePath.replace(/\./g, '/') + '.html';
    var errorCallBack =  options.errorCallBack || function(){};
    if(templateCache[viewName]) { return templateCache[viewName]};
    var http = new HTTP();
    http.get(templatePath, {
      successCallBack : function(xhr){
        var responseText = xhr.responseText;
        templateCache[viewName] = responseText;
        options.onSuccess && options.onSuccess(responseText);
      },
      errorCallBack : errorCallBack
    });
  }

  function loadView(viewName, options){
    options = options || {};
    loading.showLoading();
    var env = memCache.get('env');
    var curRouter = router.get(viewName);
    var sign = curRouter.sign || '';
    var extPath = sign ? '_' + sign : '';
    var templateBasePath = options.templatePath || env.$templatePath;
    var templatePath = templateBasePath + viewName + extPath + '.html';
    var http = new HTTP();

    http.get(templatePath, {
      successCallBack : successCallBack,
      errorCallBack : errorCallBack
    });

    function successCallBack(xhr){
      var responseText = xhr.responseText;
      // 2
      var view = new View(viewName, responseText, {
        initCallback: function(){
          // hideLoading();
        }
      });
      var scope = scopeManager.parseScope(viewName, view.getDom());
      changeURLParams(viewName, options);
      appendView(viewName, view);

      saveLastView();
      setActive(view);

      // 3
      beacon(scope).once(EVENTS.RUN_COMPLETE, function(){
        // 6
        switchURL(viewName, options);
        show(viewName);

        removeLoadingView(viewName);
        // hideNativeLoading();
      });
    }

    function errorCallBack(){
      throw404();
    }
  }

  function saveLastView() {
    lastView = getActive();
  }

  function setActive(view) {
    activeView = view;
  }

  function switchView(view){
    var lastViewName = '';
    // 7
    if (lastView) {
      lastViewName = lastView.getViewName();
      triggerOnHide(lastView, view);
    }

    setActive(view);

    activeView.show();
    triggerOnShow(activeView, lastViewName);
    hideNativeLoading();
  }

  /**
  * 监听Native appear
  */
  function listenNativeAppear() {
    bridge.run('appear', {
      callback: bridge.register('appear', viewAppear, { keepCallback: true })
    }, {
      unified: false
    });
  }

  /**
  * Native appear 后执行 view onShow
  */
  function viewAppear() {
    if(!activeView){
      runOnAppear();
      return;
    }
    var params = {
      viewName: activeView.getViewName()
    };
    runOnAppear(params, function() {
      activeView.show();
      triggerOnShow(activeView);
    });
  }

  function triggerOnHide(curView, toView, noHide) {
    var viewName = curView.getViewName();
    !noHide && curView && curView.hide();
    beacon(curView).on(curView.events.onHide, {
      to: toView
    });

    var $scope = scopeManager.getScopeInstance(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function triggerOnShow(curView, lastViewName) {
    var viewName = curView.getViewName();
    if (viewName !== lastViewName) {
      beacon(curView).on(curView.events.onShow, {
        from: lastViewName
      });
    }

    var $scope = scopeManager.getScopeInstance(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function getActive(){
    return activeView;
  }

  function goToHybrid(viewName, options) {
    options = options || {};
    if (options.replace) {
      goTo(viewName, options);
    } else {
      var fnName = 'beforeGoTo';
      var url = getURL(viewName, options);
      var paramObj = { viewName: viewName, options: options, url: url };
      var next = function(paramObj){
        activeView && triggerOnHide(activeView, null ,true);

        bridge.run('gotopage', {
          vc: paramObj.vc,
          url: paramObj.url
        });
      }

      // goTo 方法对外支持中间件，中间件参数为 paramObj
      middleware.run(fnName, paramObj, next);
    }
  }

  function jump (options) {
    var url = options.url || '';
    var projectPath = options.project || '';
    var urlPath = options.urlPath || '';
    var query = options.query || '';
    var title = options.title || '';
    projectPath = projectPath.replace(/^\//, '');
    var reg = new RegExp('^(\/)?(' + projectPath + '[\/|$])?');
    urlPath = urlPath.replace(reg, '');
    if (!url) {
      url = getHybridPageUrl(projectPath, urlPath, query);
    }
    bridge.run('gotopage', {
      vc: 'CjiaHybrid',
      url: url,
      data: {
        title: title
      }
    });
  }

  function getHybridPageUrl(projectPath, urlPath, query) {
    return (projectPath || '') + '/index.html#/' + (projectPath || '') + '/' + (urlPath || '') + (query || '');
  }

  function goToNative(key, data) {
    key = key || 'CjiaHybrid';
    bridge.run('gotopage', {
      vc: key,
      data: data
    })
  }

  function back () {
    activeView && triggerOnHide(activeView, null ,true);
    bridge.run('goback');
  }

  /**
  * show 之前对外提供中间件 onAppear
  */
  function runOnAppear(params, next) {
    var fnName = 'onAppear';
    middleware.run(fnName, params, next);
  }

  var loading = {
    loadingHandle : null, // handle 须实现接口【Iloading】 show() & hide()

    showLoading : function (){
                    loading.loadingHandle && loading.loadingHandle.show();
                  },

    hideLoading :function (){
                   loading.loadingHandle && loading.loadingHandle.hide();
                  },

    setLoading : function(handle){
                   loading.loadingHandle = handle
                 },

    unsetLoading : function(){
                  loading.loadingHandle = null
                }
  }

  api = {
    init : init,
    goTo : goToHybrid,
    jump : jump,
    goToNative : goToNative,
    back : back,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    // showLoading : loading.showLoading,
    // hideLoading : loading.hideLoading,
    loading : loading,
    getActive : getActive,
    getScopeKeyByViewName: getScopeKeyByViewName,
    getTemplate : getTemplate

  }

  return api;
});
;Air.Module("B.controller.run", function (require) {
    var memCache = require('B.data.memCache');
    var run = function (controllerName, controller) {
        var scopeManager = require("B.scope.scopeManager");
        var viewManager = require("B.view.viewManager");
        var EVENTS = require('B.event.EVENTS');
        var scopeKey = viewManager.getScopeKeyByViewName(controllerName);
        var scope = scopeManager.getScopeInstance(scopeKey || controllerName);
        if (scopeKey) {
            var controllerMap = memCache.get('controllerMap');
            if (!controllerMap) {
                controllerMap = {};
                memCache.set('controllerMap', controllerMap);
            }
            controllerMap[controllerName] = controller;
            memCache.set('controllerMap', controllerMap);
        }
        Air.run(controller, false, scope);
        Air.run(function () {
            beacon(scope).on(EVENTS.DATA_CHANGE, scope);
            beacon(scope).on(EVENTS.RUN_COMPLETE);
        });
    };
    return run;
});
;Air.Module("B.TDK.TDK", function () {
    var docHead = document.head || document.getElementsByTagName('head')[0];
    function setTitle(title) {
        document.title = title || document.title;
        return document.title;
    }
    function setDescription(description) {
        var descElement = getMetaElement('description');
        descElement.content = description || descElement.content;
        return descElement.content;
    }
    function setKeywords(keywords) {
        var keywordElement = getMetaElement('keywords');
        keywordElement.content = keywords || keywordElement.content;
        return keywordElement.content;
    }
    function getMetaElement(metaName) {
        var element = docHead.querySelector('meta[name=' + metaName + ']');
        element = element || createMetaElement(metaName);
        return element;
    }
    function createMetaElement(metaName) {
        var element = document.createElement('meta');
        element.setAttribute('name', metaName);
        docHead.appendChild(element);
        return element;
    }
    var api = {
        setTitle: setTitle,
        setDescription: setDescription,
        setKeywords: setKeywords
    };
    return api;
});
;/**
 * @author baishuiz@gmail.com, xuemengfei@gmail.com
 * @version v0.2.0
 */
Air.run(function(require){
  var viewManager   = require("B.view.viewManager"),
      scopeManager = require('B.scope.scopeManager'),
      router = require("B.router.router"),
      memCache = require('B.data.memCache'),
      run = require('B.controller.run'),
      serviceFactory = require('B.service.serviceFactory'),
      HTTP = require('B.network.HTTP'),
      storage = require('B.data.storage'),
      TDK = require('B.TDK.TDK'),
      bridge = require('B.bridge');
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : viewManager, // ViewManager
      router   : router, // Router
      scopeManager　:　scopeManager,
      service  : serviceFactory,
      utility  : {
        storage  : storage,
        HTTP: HTTP
      },

      /**
       * [环境初始化]
       * @param  {Environment} env [环境配置对象]
       * @return void
       */
      init     : function(env){
        env = env || {};
        memCache.set('env', env);
        Air.moduleURL(env.$moduleURL);
        viewManager.init(env);
      },
      run      : run,
      Module   : Air.Module,
      TDK      : TDK,
      bridge   : bridge,
      ready    : function(callback){
        callback = typeof callback === 'function' ? callback : function(){};
        var handle = function(res) {
          res = res || { resultCode: 1 };
          callback(res);
        };

        bridge.run('getdeviceinfo', {
          success: handle,
          failed: handle
        });
      },
      setModuleURL: function(url) {
        Air.moduleURL(url);
      }
    };
    window[FRAMEWORK_NAME] = api;
  }()
});