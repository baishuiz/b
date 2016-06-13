!function(a){function b(a){this.target=a}var c=a.beacon,d=function(c){return this!==a&&d.blend(this,d),new b(c)};d.toString=function(){return"baishuiz@gmail.com"};var e={base:f,avatarCore:b.prototype,self:f,init:function(){var b=Object.freeze;a.beacon=d,e.merge(d,f),delete a.beacon.base,b&&b(d)},login:function(){a.beacon=d},logoff:function(){a.beacon=c}},f={base:e};a.beacon=f}(this),function(a){var b=a.base||{},c={merge:function(a){for(var b=arguments.length,c=0;b>c;c++){var d=arguments[c];for(var e in d)a[e]=d[e]}return a},blend:function(a,b,d){var e={cover:!0,mergePrototype:!1};d=d?c.merge(e,d):e,b=[].concat(b);for(var f=b.length,g=0;f>g;g++){var h=b[g];for(var i in h){var j=d.mergePrototype||h.hasOwnProperty(i),k=d.cover||!a[i];j&&k&&(a[i]=h[i])}}return a},isType:function(a,b){return"Null"===b&&null===a||"Undefined"===b&&void 0===a||"Number"===b&&isFinite(a)||Object.prototype.toString.call(a).slice(8,-1)===b},arrayIndexOf:function(a,b){return c.arrayIndexOf=Array.prototype.indexOf?function(a,b){return a=[].slice.call(a,0),a.indexOf(b)}:function(a,b){a=[].slice.call(a,0);for(var c=a.length;c>=0;c--)if(a[c]===b)return c;return c},c.arrayIndexOf(a,b)},each:function(a,b){if(a){a=[].concat(a);for(var c=0;c<a.length;c++)b.call(a[c],c,a[c])}}};c.blend(b,c)}(beacon),function(a){var b=a.base,c=function(a){function c(a){var b=e(f,a);0>b&&(b=f.push(a)-1);var c="event_"+b,d=a.toString()===a,g=d?a:c;return g}function d(a){var b=e(f,a);return 0>b?null:c(a)}var e=b.arrayIndexOf,f=[],g={dom:a,target:a,attachEvent:function(a,b){var d=c(a);f[d]=f[d]||[],f[d].push(b)},removeEvent:function(a,b){var d,e=a&&c(a),g=e&&f[e];if(a&&b)for(var h=g.length-1;h>=0;h--){var i=g[h];i===b&&(d=f[e].splice(h,1))}else a&&!b?(d=f[e],f[e]=[]):a||b||(d=f,f=[]);return d},getEventList:function(a){var b;if(!a)return f.slice(0);var c=d(a);return c&&(b=a?f[c]:f.slice(0)),b}};return g};b.EventStructure=c}(beacon),function(a){function b(a){var b=new j(a);return h.push(b),b}function c(a,c,d){var e=g(a)||b(a);e.attachEvent(c,d)}function d(a,b,d){var e=b.registEvent(d),f=b.getEventList();i.each(f,function(b){c(a,f[b],e)})}function e(a,b,c){var d=h.slice(0),e=a?g(a)||[]:h.slice(0);i.each(e,function(a,e){if(e.removeEvent(b,c),!b&&!c||0==e.getEventList().length){var a=i.arrayIndexOf(h,e);d.splice(a,1)}}),h=d}function f(a,b,c){var d=b.removeEvent(c);i.each(d,function(c){var f=d[c],g=b.getEventList();i.each(g,function(b,c){e(a,c,f)})})}function g(a){if(!a)return h.slice(0);for(var b=0;b<h.length;b++){var c=h[b];if(c.target===a)return c}}var h=[],i=a.base,j=i.EventStructure,k={registEvent:c,registCombinationEvent:d,removeEvent:e,removeCombinationEvent:f,getEventList:g};i.eventStore=k}(beacon),function(a){function b(){if(this instanceof b)return this;var a=[],d=[],e=[].slice.call(arguments,0),f=e.slice(0),g=function(){function b(){return f=e.slice(0)}var g=function(b,e){var f=c.arrayIndexOf(a,b);0>f&&(a.push(b),d.push(e))},h=function(b){var e=c.arrayIndexOf(a,b),f=d[e];return b?f:d.slice(0)};this.resetEventList=b,this.getEventList=function(){return e.slice(0)},this.registEvent=function(a){var d=c.arrayIndexOf,f=e.slice(0),h=function(c,e){var g=this,h=d(f,c.eventType);h>=0&&f.splice(h,1),0===f.length&&(a.call(g,e),f=b())};return g(a,h),h},this.removeEvent=function(a){var b=[].concat(h(a));return b}};return g.prototype=new b,new g}var c=a.base;c.combinationalEvent=b}(beacon),function(a){var b=a.base,c=b.eventStore,d=c.registCombinationEvent,e=c.registEvent,f=c.removeCombinationEvent,g=c.removeEvent,h=c.getEventList,i={hostProxy:{},attachActionEvent:function(a,c,d){var e=a.desc,f=b.isType(a.desc,"Function");f&&e(c,d);var g=["touchmove","mousemove"];b.each(g,function(b,c){f&&window.beacon(document).on(c,function(b){i.publicDispatchEvent(a,b)})})},attachEvent:function(a,c){var f=this,g=a instanceof b.combinationalEvent?d:e;i.attachActionEvent(a,f,c),g(f,a,c)},fireEvent:function(a,c){var d=this,e=h(d);if(e){var f=e.getEventList(a),g=b.isType(a.desc,"Function"),i=g&&a.desc(c);!!i==!!g&&b.each(f,function(b,e){var f={eventType:a};e.call(d,f,c)})}},publicDispatchEvent:function(a,c){var d=h(),e=b.isType(a.desc,"Function");e&&a.desc(c),b.each(d,function(b){var e=d[b].dom;i.fireEvent.call(e,a,c)})},removeEvent:function(a,c){var d=this,e=a instanceof b.combinationalEvent?f:g;e(d,a,c)}},j=function(){var a=function(){};return a.prototype=i,b.blend(a,i),a}();b.Event=j}(beacon),function(a){var b=a.base,c=function(){return this}(),d=b.EventStructure,e={structures:[],getStructure:function(a){for(var b,c,d=0;d<e.structures.length;d++){b=e.structures[d];try{c=b.dom===a}catch(f){b.dom=window.document,c=b.dom===a}if(c)return b}},add:function(a,b,c){var f=e.getStructure(a);f||(f=new d(a),e.structures.push(f)),f.attachEvent(b,c)},remove:function(a,b,c){var d=e.getStructure(a);return d&&d.removeEvent(b,c)}},f={attachEvent:function(a,b){var d,e=this,g=function(a,b){var c=this;c.addEventListener(a,b,!1)},h=function(a,b){var c=this;c.attachEvent("on"+a,b)},i=function(a,b){var c=this,d=c["on"+a];c["on"+a]=function(){d.call(c),b.call(c)}};return c.addEventListener?(g.call(e,a,b),d=g):c.attachEvent?(h.call(e,a,b),d=h):(i.call(e,a,b),d=i),f.attachEvent=d},fireEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style;var d=document.createEvent("Event");d.initEvent(a,b.bubbles,b.cancelable),b.state&&(d.state=b.state),c.dispatchEvent(d)},f=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style,a="on"+a;var d=document.createEventObject();d.cancelBubble=b.cancelable,c.fireEvent(a,d)};return document.createEvent&&d.dispatchEvent?(e.call(d,a,b),c=e):document.createEventObject&&d.fireEvent&&(f.call(d,a,b),c=f),c},removeEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;c.removeEventListener(a,b,!1)},g=function(a,b){var c=this;c.detachEvent("on"+a,b)};return d.removeEventListener?(e.call(d,a,b),c=e):d.detachEvent&&(g.call(d,a,b),c=g),f.removeEvent=c}},g={attachEvent:function(a,b){var c=this;e.add(c,a,b),f.attachEvent.call(c,a,b)},fireEvent:function(a,b){var c=this;g.fireEVent=f.fireEvent.call(c,a,b)},removeEvent:function(a,c){var d=this;if(a&&c)f.removeEvent.call(d,a,c);else if(a&&!c){var h=e.remove(d,a);h&&b.each(h,function(){var b=this;g.removeEvent.call(d,a,b)})}else if(!a&&!c){var i=e.remove(d);i&&b.each(i,function(){var a=this;a&&b.each(i[a],function(){var b=this;g.removeEvent.call(d,a,b)})})}},isHTMLElement:function(a){var b=a==document||a==window,c=function(a){var b=a&&a.nodeName;return b&&a.nodeType};return b||c(a)},isEventSupported:function(a,c){if(!g.isHTMLElement(a)||!b.isType(c,"String"))return!1;var d=!1;if(a===window||a===document){d="on"+c in a;var e=!!window.ActiveXObject,f=e&&!!document.documentMode;if(!d&&f)return!1;if(d)return!0;var h=document.createElement("iframe");h.style.display="none",document.body.appendChild(h);var i=a===window?h.contentWindow:h.contentDocument;g.attachEvent.call(i,c,function(){d=!0}),g.fireEvent.call(i,c),h.parentNode.removeChild(h)}else{var j=a.tagName,c="on"+c;a=document.createElement(j),d=c in a,d||(a.setAttribute(c,"return;"),d="function"==typeof a[c]),a=null}return d}};b.DOMEvent=g}(beacon),function(a){var b=a.base,c={on:function(){var b=a.base,c=b.isType,d=b.Event.hostProxy,e=b.Event.publicDispatchEvent,f=b.Event.attachEvent,g=function(a,b){var g=[].slice.call(arguments,0);b&&c(b,"Function")?f.apply(d,g):e.apply(d,g)};return g}(a),once:function(a,b){var d=function(e,f){c.off(a,d),b.call({},e,f)};c.on(a,d)},off:function(){var b=a.base,c=b.Event.hostProxy,d=function(){var a=[].slice.call(arguments,0);b.Event.removeEvent.apply(c,a)};return d}(),blend:b.blend,NS:b.NS,arrayIndexOf:b.ArrayIndexOf,isType:b.isType,Enum:b.Enum,loginGlobal:b.login,logoffGlobal:b.logoff,utility:b,createEvent:function(){var a,c=[].slice.call(arguments,0);return a=arguments.length>1?b.combinationalEvent.apply(this,c):{desc:c[0]}}},d={on:function(b,c){var d=[].slice.call(arguments,0),e=this.target,f=a.base,g=f.DOMEvent.isHTMLElement(e),h=f.DOMEvent.isEventSupported(e,b),i=g&&h?f.DOMEvent.fireEvent:f.Event.fireEvent,j=g&&h?f.DOMEvent.attachEvent:f.Event.attachEvent;c&&f.isType(c,"Function")?f.each(e,function(a,b){j.apply(b,d)}):f.each(e,function(a,b){i.apply(b,d)})},once:function(a,b){var c=this,e=function(f,g){d.off.call(c,a,e),b.call(c,f,g)};d.on.call(c,a,e)},off:function(a,c,d){var e=this.target,f=b.DOMEvent.isHTMLElement(e),g=a&&b.DOMEvent.isEventSupported(e,a);f&&g?b.DOMEvent.removeEvent:b.Event.removeEvent,b.each(e,function(e,g){var h=a&&b.DOMEvent.isEventSupported(g,a);f&&b.DOMEvent.removeEvent.call(g,a,c,d),h||b.Event.removeEvent.call(g,a,c,d)})}};b.blend(b.avatarCore,d),b.blend(a,c),b.init()}(beacon),function(a){function b(a){this.target=a}var c=function(a){return new b(a)};c.toString=function(){return"baishuiz@gmail.com"};var d=document.getElementsByTagName("script"),e=d[d.length-1],f={avatarCore:b.prototype,plugins:{},attach:function(a,b){f.plugins[a]=b},baseURL:e.src.replace(/\/[^\/]+$/,"/"),CDNTimestamp:e.getAttribute("data-CDNTimestamp")||"",isDebug:!1,init:function(b){a.Air=f.plugins.merge(c,b)}},g={base:f};a.Air=g}(this),function(a){var b={NS:function(a,b){for(var c=a.split("."),d=b||window||{},b=d,e=0,f=c.length;f>e;e++)d[c[e]]=void 0===d[c[e]]?{}:d[c[e]],d=d[c[e]];return d},beacon:beacon,merge:beacon.utility.merge,setBaseURL:function(b){return a.base.baseURL=b||a.base.baseURL}};b.merge(a.base.plugins,b)}(Air),function(a){function b(){try{document.documentElement.doScroll("left")}catch(a){return void setTimeout(b,1)}g()}function c(a){return 1==d?void a():void e.push(a)}var d=!1,e=[],f=a.base.plugins.beacon,g=(a.base.plugins,function(){f(document).off("readystatechange",h),f(document).off("DOMContentLoaded",g),f(window).off("load",g);for(var a;a=e.shift();)d||a();d=!0}),h=function(){(/loaded|complete/.test(document.readyState)||1==d)&&g()};f(document).on("readystatechange",h),f(document).on("DOMContentLoaded",g),f(window).on("load",g),document.documentElement.doScroll&&b(),a.base.attach("DOMReady",c)}(Air),function(a,b){function c(a,b){var c=1;this.loadJS=function(){if(/\bArray\b/.test(Object.prototype.toString.call(a))){c=a.length;for(var d=c-1;d>=0;d--)e(a[d],function(){--c||b()})}else e(a,b)}}function d(){function a(){b.currentJs||(b.currentJs=b.shift(),b.currentJs&&b.currentJs.loadJS())}var b=[];b.currentJs=null,this.loadJS=function(d,e){var f=function(){b.currentJs=null,e&&e(),a()};return b.push(new c(d,f)),a(),this}}function e(a,c){var d,e=document.getElementsByTagName("head")[0],f=document.createElement("script"),g=!1,h=b.base.plugins.beacon,i=function(){g=!0,h(f).off("load"),h(f).off("readystatechange"),i=function(){},c&&c()},j=function(){/loaded|complete/.test(f.readyState)&&0==g&&i()};f.async=!0,f.setAttribute("type","text/javascript"),f.src=a,h(f).on("load",i),h(f).on("readystatechange",j),h(f).on("error",i);for(var k=document.getElementsByTagName("script"),l=0,m=k.length;!d&&m>l;l++)d=a==k[l].getAttribute("src");d||e.appendChild(f)}function f(a,b){var c=new d;return c.loadJS(a,b),c}b.base.attach(a,f)}("loadJS",Air),function(a){function b(b,d){"use strict";function e(){var e=i.toLowerCase(),f=h.toLowerCase(),g=a.base,j=g.plugins.beacon,k=g.plugins.NS,l=g.plugins.NS(h.toLowerCase(),g)[e],m=d(g.Require,g.run);l?"function"==typeof m?k(f,g)[e]=g.plugins.merge(m,l):g.plugins.merge(l,m):k(f,g)[e]=m,c[b.toLowerCase()]=!0,j.on(a.base.Require.Event.LOADED,{moduleName:b})}var f=a.base.plugins;f.beacon.on(a.base.Require.Event.REQUIREING,{moduleName:b});var g=b.match(/(^.*)\.(\w*)$/),h=g[1],i=g[2],j=d.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");j=j.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var k=j.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(j,""),l=k&&new RegExp("\\b"+k+"\\s*\\(([^\\)]+)\\)","gm"),m=[];l&&j.replace(l,function(b,d){var e=d.replace(/['"]/g,""),f=e.toLowerCase();c[f]||(m[f]=m.push(f)-1),a.base.Require(e)});var n=new String(b);m.length&&beacon(n).on(a.base.Require.Event.LOADED,function(b,c){var d=c.moduleName.toLowerCase();m.hasOwnProperty(d)&&(delete m[d],m.splice(m[d],1)),m.length<=0&&(beacon(n).off(a.base.Require.Event.LOADED),e())}),m.length||e()}var c={};a.base.Module=b}(Air),function(a){function b(a){if(a)return g.moduleLoaded[a];for(var b=0,c=g.requireQueue.length;c>b;b++){var d=g.requireQueue[b];if(!g.moduleLoaded[d])return!1}return!0}function c(){d.on(f.COMPLETE),d(document).on("readystatechange"),c=function(){d.on(f.COMPLETE)}}var d=a.base.plugins.beacon,e=d.createEvent,f={COMPLETE:e("require_complete"),LOADED:e("require_loaded"),REQUIREING:e("require_requireing")},g={requiring:{},required:{},moduleLoaded:{},requireQueue:[]};d(g).on(f.REQUIREING,function(a,b){var c=b.moduleName.toLowerCase();g.requireQueue[c]||g.requireQueue.push(c),g.required[c]=!0});var h=function(d,e){function f(b){var c=b.match(/(^.*)(\.\w*)$/),d=(c[1],c[2],a.base.CDNTimestamp||"");return d=d&&"?"+d,a.base.baseURL+b.replace(/\./gi,"/")+".js"+d}function h(d){i(d)||(g.requiring[d]=!0,a.base.plugins.loadJS(e,function(){if(!g.required[d])throw new Error("module ["+d+"] is undefined! @"+e);b()&&c()}))}function i(a){return g.required[a]||g.requiring[a]||g.moduleLoaded[a]}var j=d;return d=d.toLowerCase(),g.required[d]||g.requiring[d]||g.moduleLoaded[d]?a.base.plugins.NS(d,a.base):(e=e||f(j),d=d.toLowerCase(),g.requireQueue[d]=!0,g.requireQueue.push(d),h(d),a.base.plugins.NS(d,a.base))};d.on(f.LOADED,function(a,d){var e=d.moduleName.toLowerCase();g.required[e]=!0,g.moduleLoaded[e]=!0,b()&&c()}),h.Event=f,h.isRequireComplete=b,a.base.Require=h}(Air),function(a){function b(){for(;function(){var a=c.shift();return a&&a(),c.length}(););}var c=[],d=a.base.plugins.beacon,e=a.base.Require.Event;d.on(e.COMPLETE,b);var f=function(){function f(){for(var b=0;b<h.length;b++){var c=h[b];if(!h[c]&&!a.base.Require.isRequireComplete(c))return!1}return!0}var g,h=[];this.runNow&&d.on(e.LOADED,function(a,b){var c=b.moduleName.toLowerCase();h[c]=!0,beacon.utility.arrayIndexOf(h,c)>=0&&f()&&g&&g()}),this.run=function(d){g=d,this.runNow?f()&&d():(c.push(d),a.base.Require.isRequireComplete()&&b())},this.require=function(b,c){if(a.base.Require(b,c),b=b.toLowerCase(),h.push(b),!c){var d=b.match(/(^.*)\.(\w*)$/),e=d[1],f=d[2];a.base.plugins.NS(e,a.base)[f]}var g=a.base.plugins.NS(b,a.base);return g}},g=function(a,b){"use strict";var c=g;if(!(this instanceof c))return new c(a,b,arguments);var d=[].slice.call(arguments[2]).slice(2),e=this;e.runNow=b,f.call(e);var h=a.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");h=h.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var i=h.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(h,""),j=i&&new RegExp("\\b"+i+"\\s*\\(([^\\)]+)\\)","gm");j&&h.replace(j,function(a,b){var c=b.replace(/['"]/g,"");e.require(c)}),e.run(function(){var b=[e.require].concat(d);a.apply(this,b)})};a.base.attach("run",g)}(Air),function(a){var b=a.base.plugins,c={run:b.run,iRun:function(a){b.run(a,!0)},loadJS:b.loadJS,Module:a.base.Module,merge:a.base.merge,NS:b.NS,Enum:a.base.Enum,domReady:b.DOMReady,moduleURL:b.setBaseURL,setCDNTimestamp:a.base.setCDNTimestamp};a.base.init(c)}(Air);;/*!
 * Object.observe polyfill - v0.2.4
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/object-observe
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */

// Some type definitions
/**
 * This represents the data relative to an observed object
 * @typedef  {Object}                     ObjectData
 * @property {Map<Handler, HandlerData>}  handlers
 * @property {String[]}                   properties
 * @property {*[]}                        values
 * @property {Descriptor[]}               descriptors
 * @property {Notifier}                   notifier
 * @property {Boolean}                    frozen
 * @property {Boolean}                    extensible
 * @property {Object}                     proto
 */
/**
 * Function definition of a handler
 * @callback Handler
 * @param {ChangeRecord[]}                changes
*/
/**
 * This represents the data relative to an observed object and one of its
 * handlers
 * @typedef  {Object}                     HandlerData
 * @property {Map<Object, ObservedData>}  observed
 * @property {ChangeRecord[]}             changeRecords
 */
/**
 * @typedef  {Object}                     ObservedData
 * @property {String[]}                   acceptList
 * @property {ObjectData}                 data
*/
/**
 * Type definition for a change. Any other property can be added using
 * the notify() or performChange() methods of the notifier.
 * @typedef  {Object}                     ChangeRecord
 * @property {String}                     type
 * @property {Object}                     object
 * @property {String}                     [name]
 * @property {*}                          [oldValue]
 * @property {Number}                     [index]
 */
/**
 * Type definition for a notifier (what Object.getNotifier returns)
 * @typedef  {Object}                     Notifier
 * @property {Function}                   notify
 * @property {Function}                   performChange
 */
/**
 * Function called with Notifier.performChange. It may optionally return a
 * ChangeRecord that gets automatically notified, but `type` and `object`
 * properties are overridden.
 * @callback Performer
 * @returns {ChangeRecord|undefined}
 */

Object.observe || (function(O, A, root, _undefined) {
    "use strict";

        /**
         * Relates observed objects and their data
         * @type {Map<Object, ObjectData}
         */
    var observed,
        /**
         * List of handlers and their data
         * @type {Map<Handler, Map<Object, HandlerData>>}
         */
        handlers,

        defaultAcceptList = [ "add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions" ];

    var getOwnPropertyNamesFN = function() {
        var func = O.getOwnPropertyNames;
        try {
            // arguments.callee; strict mode dosen't allow callee
            getOwnPropertyNamesFN();
        } catch (e) {
            // Strict mode is supported

            // In strict mode, we can't access to "arguments", "caller" and
            // "callee" properties of functions. Object.getOwnPropertyNames
            // returns [ "prototype", "length", "name" ] in Firefox; it returns
            // "caller" and "arguments" too in Chrome and in Internet
            // Explorer, so those values must be filtered.
            var avoid = (func(inArray).join(" ") + " ").replace(/prototype |length |name /g, "").slice(0, -1).split(" ");
            if (avoid.length) func = function(object) {
                var props = O.getOwnPropertyNames(object);
                if (typeof object === "function")
                    for (var i = 0, j; i < avoid.length;)
                        if ((j = inArray(props, avoid[i++])) > -1)
                            props.splice(j, 1);

                return props;
            };
        }
        return func;
    };

    // Functions for internal usage

        /**
         * Checks if the argument is an Array object. Polyfills Array.isArray.
         * @function isArray
         * @param {?*} object
         * @returns {Boolean}
         */
    var isArray = A.isArray || (function(toString) {
            return function (object) { return toString.call(object) === "[object Array]"; };
        })(O.prototype.toString),

        /**
         * Returns the index of an item in a collection, or -1 if not found.
         * Uses the generic Array.indexOf or Array.prototype.indexOf if available.
         * @function inArray
         * @param {Array} array
         * @param {*} pivot           Item to look for
         * @param {Number} [start=0]  Index to start from
         * @returns {Number}
         */
        inArray = A.prototype.indexOf ? A.indexOf || function(array, pivot, start) {
            return A.prototype.indexOf.call(array, pivot, start);
        } : function(array, pivot, start) {
            for (var i = start || 0; i < array.length; i++)
                if (array[i] === pivot)
                    return i;
            return -1;
        },

        /**
         * Returns an instance of Map, or a Map-like object is Map is not
         * supported or doesn't support forEach()
         * @function createMap
         * @returns {Map}
         */
        createMap = root.Map === _undefined || !Map.prototype.forEach ? function() {
            // Lightweight shim of Map. Lacks clear(), entries(), keys() and
            // values() (the last 3 not supported by IE11, so can't use them),
            // it doesn't handle the constructor's argument (like IE11) and of
            // course it doesn't support for...of.
            // Chrome 31-35 and Firefox 13-24 have a basic support of Map, but
            // they lack forEach(), so their native implementation is bad for
            // this polyfill. (Chrome 36+ supports Object.observe.)
            var keys = [], values = [];

            return {
                size: 0,
                has: function(key) { return inArray(keys, key) > -1; },
                get: function(key) { return values[inArray(keys, key)]; },
                set: function(key, value) {
                    var i = inArray(keys, key);
                    if (i === -1) {
                        keys.push(key);
                        values.push(value);
                        this.size++;
                    } else values[i] = value;
                },
                "delete": function(key) {
                    var i = inArray(keys, key);
                    if (i > -1) {
                        keys.splice(i, 1);
                        values.splice(i, 1);
                        this.size--;
                    }
                },
                forEach: function(callback/*, thisObj*/) {
                    for (var i = 0; i < keys.length; i++)
                        callback.call(arguments[1], values[i], keys[i], this);
                }
            };
        } : function() { return new Map(); },

        /**
         * Simple shim for Object.getOwnPropertyNames when is not available
         * Misses checks on object, don't use as a replacement of Object.keys/getOwnPropertyNames
         * @function getProps
         * @param {Object} object
         * @returns {String[]}
         */
        getProps = O.getOwnPropertyNames ? getOwnPropertyNamesFN() : function(object) {
            // Poor-mouth version with for...in (IE8-)
            var props = [], prop, hop;
            if ("hasOwnProperty" in object) {
                for (prop in object)
                    if (object.hasOwnProperty(prop))
                        props.push(prop);
            } else {
                hop = O.hasOwnProperty;
                for (prop in object)
                    if (hop.call(object, prop))
                        props.push(prop);
            }

            // Inserting a common non-enumerable property of arrays
            if (isArray(object))
                props.push("length");

            return props;
        },

        /**
         * Return the prototype of the object... if defined.
         * @function getPrototype
         * @param {Object} object
         * @returns {Object}
         */
        getPrototype = O.getPrototypeOf,

        /**
         * Return the descriptor of the object... if defined.
         * IE8 supports a (useless) Object.getOwnPropertyDescriptor for DOM
         * nodes only, so defineProperties is checked instead.
         * @function getDescriptor
         * @param {Object} object
         * @param {String} property
         * @returns {Descriptor}
         */
        getDescriptor = O.defineProperties && O.getOwnPropertyDescriptor,

        /**
         * Sets up the next check and delivering iteration, using
         * requestAnimationFrame or a (close) polyfill.
         * @function nextFrame
         * @param {function} func
         * @returns {number}
         */
        nextFrame = root.requestAnimationFrame || root.webkitRequestAnimationFrame || (function() {
            var initial = +new Date,
                last = initial;
            return function(func) {
                return setTimeout(function() {
                    func((last = +new Date) - initial);
                }, 17);
            };
        })(),

        /**
         * Sets up the observation of an object
         * @function doObserve
         * @param {Object} object
         * @param {Handler} handler
         * @param {String[]} [acceptList]
         */
        doObserve = function(object, handler, acceptList) {
            var data = observed.get(object);

            if (data) {
                performPropertyChecks(data, object);
                setHandler(object, data, handler, acceptList);
            } else {
                data = createObjectData(object);
                setHandler(object, data, handler, acceptList);

                if (observed.size === 1)
                    // Let the observation begin!
                    nextFrame(runGlobalLoop);
            }
        },

        /**
         * Creates the initial data for an observed object
         * @function createObjectData
         * @param {Object} object
         */
        createObjectData = function(object, data) {
            var props = getProps(object),
                values = [], descs, i = 0,
                data = {
                    handlers: createMap(),
                    frozen: O.isFrozen ? O.isFrozen(object) : false,
                    extensible: O.isExtensible ? O.isExtensible(object) : true,
                    proto: getPrototype && getPrototype(object),
                    properties: props,
                    values: values,
                    notifier: retrieveNotifier(object, data)
                };

            if (getDescriptor) {
                descs = data.descriptors = [];
                while (i < props.length) {
                    descs[i] = getDescriptor(object, props[i]);
                    values[i] = object[props[i++]];
                }
            } else while (i < props.length)
                values[i] = object[props[i++]];

            observed.set(object, data);

            return data;
        },

        /**
         * Performs basic property value change checks on an observed object
         * @function performPropertyChecks
         * @param {ObjectData} data
         * @param {Object} object
         * @param {String} [except]  Doesn't deliver the changes to the
         *                           handlers that accept this type
         */
        performPropertyChecks = (function() {
            var updateCheck = getDescriptor ? function(object, data, idx, except, descr) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx],
                    odesc = data.descriptors[idx];

                if ("value" in descr && (ovalue === value
                        ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
                if (odesc.configurable && (!descr.configurable
                        || descr.writable !== odesc.writable
                        || descr.enumerable !== odesc.enumerable
                        || descr.get !== odesc.get
                        || descr.set !== odesc.set)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "reconfigure",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.descriptors[idx] = descr;
                }
            } : function(object, data, idx, except) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx];

                if (ovalue === value ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
            };

            // Checks if some property has been deleted
            var deletionCheck = getDescriptor ? function(object, props, proplen, data, except) {
                var i = props.length, descr;
                while (proplen && i--) {
                    if (props[i] !== null) {
                        descr = getDescriptor(object, props[i]);
                        proplen--;

                        // If there's no descriptor, the property has really
                        // been deleted; otherwise, it's been reconfigured so
                        // that's not enumerable anymore
                        if (descr) updateCheck(object, data, i, except, descr);
                        else {
                            addChangeRecord(object, data, {
                                name: props[i],
                                type: "delete",
                                object: object,
                                oldValue: data.values[i]
                            }, except);
                            data.properties.splice(i, 1);
                            data.values.splice(i, 1);
                            data.descriptors.splice(i, 1);
                        }
                    }
                }
            } : function(object, props, proplen, data, except) {
                var i = props.length;
                while (proplen && i--)
                    if (props[i] !== null) {
                        addChangeRecord(object, data, {
                            name: props[i],
                            type: "delete",
                            object: object,
                            oldValue: data.values[i]
                        }, except);
                        data.properties.splice(i, 1);
                        data.values.splice(i, 1);
                        proplen--;
                    }
            };

            return function(data, object, except) {
                if (!data.handlers.size || data.frozen) return;

                var props, proplen, keys,
                    values = data.values,
                    descs = data.descriptors,
                    i = 0, idx,
                    key, value,
                    proto, descr;

                // If the object isn't extensible, we don't need to check for new
                // or deleted properties
                if (data.extensible) {

                    props = data.properties.slice();
                    proplen = props.length;
                    keys = getProps(object);

                    if (descs) {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            descr = getDescriptor(object, key);

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(object[key]);
                                descs.push(descr);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except, descr);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);

                        if (!O.isExtensible(object)) {
                            data.extensible = false;
                            addChangeRecord(object, data, {
                                type: "preventExtensions",
                                object: object
                            }, except);

                            data.frozen = O.isFrozen(object);
                        }
                    } else {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            value = object[key];

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(value);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);
                    }

                } else if (!data.frozen) {

                    // If the object is not extensible, but not frozen, we just have
                    // to check for value changes
                    for (; i < props.length; i++) {
                        key = props[i];
                        updateCheck(object, data, i, except, getDescriptor(object, key));
                    }

                    if (O.isFrozen(object))
                        data.frozen = true;
                }

                if (getPrototype) {
                    proto = getPrototype(object);
                    if (proto !== data.proto) {
                        addChangeRecord(object, data, {
                            type: "setPrototype",
                            name: "__proto__",
                            object: object,
                            oldValue: data.proto
                        });
                        data.proto = proto;
                    }
                }
            };
        })(),

        /**
         * Sets up the main loop for object observation and change notification
         * It stops if no object is observed.
         * @function runGlobalLoop
         */
        runGlobalLoop = function() {
            if (observed.size) {
                observed.forEach(performPropertyChecks);
                handlers.forEach(deliverHandlerRecords);
                nextFrame(runGlobalLoop);
            }
        },

        /**
         * Deliver the change records relative to a certain handler, and resets
         * the record list.
         * @param {HandlerData} hdata
         * @param {Handler} handler
         */
        deliverHandlerRecords = function(hdata, handler) {
            var records = hdata.changeRecords;
            if (records.length) {
                hdata.changeRecords = [];
                handler(records);
            }
        },

        /**
         * Returns the notifier for an object - whether it's observed or not
         * @function retrieveNotifier
         * @param {Object} object
         * @param {ObjectData} [data]
         * @returns {Notifier}
         */
        retrieveNotifier = function(object, data) {
            if (arguments.length < 2)
                data = observed.get(object);

            /** @type {Notifier} */
            return data && data.notifier || {
                /**
                 * @method notify
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype._notify
                 * @memberof Notifier
                 * @param {ChangeRecord} changeRecord
                 */
                notify: function(changeRecord) {
                    changeRecord.type; // Just to check the property is there...

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object);
                    if (data) {
                        var recordCopy = { object: object }, prop;
                        for (prop in changeRecord)
                            if (prop !== "object")
                                recordCopy[prop] = changeRecord[prop];
                        addChangeRecord(object, data, recordCopy);
                    }
                },

                /**
                 * @method performChange
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype_.performchange
                 * @memberof Notifier
                 * @param {String} changeType
                 * @param {Performer} func     The task performer
                 * @param {*} [thisObj]        Used to set `this` when calling func
                 */
                performChange: function(changeType, func/*, thisObj*/) {
                    if (typeof changeType !== "string")
                        throw new TypeError("Invalid non-string changeType");

                    if (typeof func !== "function")
                        throw new TypeError("Cannot perform non-function");

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object),
                        prop, changeRecord,
                        thisObj = arguments[2],
                        result = thisObj === _undefined ? func() : func.call(thisObj);

                    data && performPropertyChecks(data, object, changeType);

                    // If there's no data, the object has been unobserved
                    if (data && result && typeof result === "object") {
                        changeRecord = { object: object, type: changeType };
                        for (prop in result)
                            if (prop !== "object" && prop !== "type")
                                changeRecord[prop] = result[prop];
                        addChangeRecord(object, data, changeRecord);
                    }
                }
            };
        },

        /**
         * Register (or redefines) an handler in the collection for a given
         * object and a given type accept list.
         * @function setHandler
         * @param {Object} object
         * @param {ObjectData} data
         * @param {Handler} handler
         * @param {String[]} acceptList
         */
        setHandler = function(object, data, handler, acceptList) {
            var hdata = handlers.get(handler);
            if (!hdata)
                handlers.set(handler, hdata = {
                    observed: createMap(),
                    changeRecords: []
                });
            hdata.observed.set(object, {
                acceptList: acceptList.slice(),
                data: data
            });
            data.handlers.set(handler, hdata);
        },

        /**
         * Adds a change record in a given ObjectData
         * @function addChangeRecord
         * @param {Object} object
         * @param {ObjectData} data
         * @param {ChangeRecord} changeRecord
         * @param {String} [except]
         */
        addChangeRecord = function(object, data, changeRecord, except) {
            data.handlers.forEach(function(hdata) {
                var acceptList = hdata.observed.get(object).acceptList;
                // If except is defined, Notifier.performChange has been
                // called, with except as the type.
                // All the handlers that accepts that type are skipped.
                if ((typeof except !== "string"
                        || inArray(acceptList, except) === -1)
                        && inArray(acceptList, changeRecord.type) > -1)
                    hdata.changeRecords.push(changeRecord);
            });
        };

    observed = createMap();
    handlers = createMap();

    /**
     * @function Object.observe
     * @see http://arv.github.io/ecmascript-object-observe/#Object.observe
     * @param {Object} object
     * @param {Handler} handler
     * @param {String[]} [acceptList]
     * @throws {TypeError}
     * @returns {Object}               The observed object
     */
    O.observe = function observe(object, handler, acceptList) {
        if (!object || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.observe cannot observe non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.observe cannot deliver to non-function");

        if (O.isFrozen && O.isFrozen(handler))
            throw new TypeError("Object.observe cannot deliver to a frozen function object");

        if (acceptList === _undefined)
            acceptList = defaultAcceptList;
        else if (!acceptList || typeof acceptList !== "object")
            throw new TypeError("Third argument to Object.observe must be an array of strings.");

        doObserve(object, handler, acceptList);

        return object;
    };

    /**
     * @function Object.unobserve
     * @see http://arv.github.io/ecmascript-object-observe/#Object.unobserve
     * @param {Object} object
     * @param {Handler} handler
     * @throws {TypeError}
     * @returns {Object}         The given object
     */
    O.unobserve = function unobserve(object, handler) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.unobserve cannot unobserve non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.unobserve cannot deliver to non-function");

        var hdata = handlers.get(handler), odata;

        if (hdata && (odata = hdata.observed.get(object))) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            nextFrame(function() {
                deliverHandlerRecords(hdata, handler);
            });

            // In Firefox 13-18, size is a function, but createMap should fall
            // back to the shim for those versions
            if (hdata.observed.size === 1 && hdata.observed.has(object))
                handlers["delete"](handler);
            else hdata.observed["delete"](object);

            if (odata.data.handlers.size === 1)
                observed["delete"](object);
            else odata.data.handlers["delete"](handler);
        }

        return object;
    };

    /**
     * @function Object.getNotifier
     * @see http://arv.github.io/ecmascript-object-observe/#GetNotifier
     * @param {Object} object
     * @throws {TypeError}
     * @returns {Notifier}
     */
    O.getNotifier = function getNotifier(object) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.getNotifier cannot getNotifier non-object");

        if (O.isFrozen && O.isFrozen(object)) return null;

        return retrieveNotifier(object);
    };

    /**
     * @function Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#DeliverChangeRecords
     * @param {Handler} handler
     * @throws {TypeError}
     */
    O.deliverChangeRecords = function deliverChangeRecords(handler) {
        if (typeof handler !== "function")
            throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");

        var hdata = handlers.get(handler);
        if (hdata) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            deliverHandlerRecords(hdata, handler);
        }
    };

})(Object, Array, this);
;Air.Module('B.util.middleware', function(){
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
    next = next || function(){};

    if (fnLength) {
      var fnIndex = 0;
      var handle = function() {
        var fn = fns[fnIndex];
        if (fnIndex < fnLength && fn) {
          fn(paramObj, function() {
            fnIndex++;
            handle.apply(handle, arguments);
          });
          return;
        }
        next.apply(next, arguments);
      }
      handle();
    } else {
      next();
    }
  }

  return {
    add: add,
    run: run,
    remove: remove
  };
});
;Air.Module("B.util.node", function(){
  var node = function(node){
      var api = {
        hasAttribute : function(attributeName){
          return node.attributes.getNamedItem(attributeName);
        }
      };
      return api;
  };

  node.type = {
      TEXT : 3,
      HTML : 1,
      ATTR : 2
  }
  return node;
});
;Air.Module('B.util.util', function() {
  var util = {
    isEmpty: function(obj) {
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
    },

    enums: function(keys) {
      var result = {};
      for (var i = keys.length - 1; i >= 0; i--) {
        result[keys[i]] = keys[i];
      };
      return result;
    },

    getData : function(pathString, root){
      var nsPath = pathString.split("."),
          ns = root || window || {},
          root = ns;
      // 如果不是最后一个为undefined，则赋值为空数组，避免Observe绑定失败
      for (var i = 0, len = nsPath.length; i < len; i++) {
          if(ns[nsPath[i]] === undefined){
              return;
          } else {
              ns = ns[nsPath[i]];
          }
      };
      return ns;
    }
  };
  return util;
});
;Air.Module('B.data.memCache', function(){
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
  }
});
;Air.Module('B.data.storage', function(require){
  var memCache = require('B.data.memCache');

  var set = memCache.set;

  var get = function(key, callback){
    var value = memCache.get(key);
    callback && callback(value);
  }

  return {
    get: get,
    set: set
  }
});
;Air.Module("B.event.events", function(){
  var events = {
    DATA_CHANGE        : beacon.createEvent("data change"),
    RUN_COMPLETE       : beacon.createEvent("run complete"),
    URL_CHANGE         : beacon.createEvent("url change"),
    PAGE404            : beacon.createEvent("")
  }
  return events;
});
;Air.Module('B.directive.event', function(require){
  var node      = require('B.util.node'),
      EVENTS    = require('B.event.events');

  var attribute = 'b-event';
  var reg = /(\((.*?)\))/;
  var api = function(target, $scope){
    if(!node(target).hasAttribute(attribute)){
      return;
    }

    var cmd = target.getAttribute(attribute);
    var cmdList = cmd.split(";")

    for (var i = 0; i < cmdList.length; i++) {
      bind(cmdList[i], i);
    };

    function getParentScope($scope) {
      if ($scope.parent) {
        return getParentScope($scope.parent);
      }
      return $scope;
    }

    function bind(cmd, eventIndex){
      var eventName = cmd.match(/^\s*(\w+)\s+/)[1];

      beacon(target).on(eventName, function (e){
        var cmd = target.getAttribute(attribute);
        var cmdList = cmd.split(";")
        var handleStr = cmdList[eventIndex].replace(eventName,'')
        var eventHandleName = handleStr.replace(reg,'').replace(/\s/g,'');
        var eventParam = handleStr.match(reg)[2]
        var params = eval("["+eventParam+"]");
        params.unshift(e);
        this.$index = $scope.$index;

        var scope = getParentScope($scope);
        var eventHandle = ($scope.$event && $scope.$event[eventHandleName]) ||
                          (scope.$event && scope.$event[eventHandleName]);
        eventHandle && eventHandle.apply(this, params);
        beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      });
    }

  }

  return api;
})
;Air.Module('B.directive.show', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-show';
  var api = function(target, $scope) {
    var isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, $scope);
  }

  function processShowElement(target, $scope) {
    // beacon($scope).on(EVENTS.DATA_CHANGE, watchElement);
    var dataPath = target.getAttribute(attribute);
    $scope.listenDataChange(dataPath, watchElement)
    function watchElement() {
      var dataPath = target.getAttribute(attribute);
      var displayStatus = util.getData(dataPath, $scope);
      displayStatus = util.isEmpty(displayStatus) ? false : displayStatus;
      displayStatus ? showHide(target, true) : showHide(target);
    }
  }

  function getData(target, key, value) {
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

  // Called only from within defaultDisplay
  function actualDisplay(name) {
    var target = document.body.appendChild(document.createElement(name));
    var display = getCSS(target, 'display');

    document.body.removeChild(target);

    return display;
  }

  function defaultDisplay(nodeName) {
    var document = document,
      display = elemdisplay[nodeName];

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

      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if (!olddisplay && display === 'none') {
        target.style.display = '';
        display = '';
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if (display === '') {
        olddisplay = setData(target, 'olddisplay', defaultDisplay(target.nodeName));
      }
    } else {
      if (display && display !== 'none') {
        setData(target, 'olddisplay', display);
      }
    }

    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    if (!show || display === 'none' || display === '') {
      target.style.display = show ? olddisplay || '' : 'none';
    }

  }

  return api;
});
;Air.Module('B.directive.property', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-property';
  var api = function(target, $scope) {
    var hasPropertyAttr = node(target).hasAttribute(attribute);
    hasPropertyAttr && setProperty(target, $scope);
  }

  function setProperty(target, $scope){
    var ruleStr = target.getAttribute(attribute);
    var propertyList = getPropertyList(ruleStr);
    for (var i = 0; i < propertyList.length; i++) {
      var activeProperty = propertyList[i];
      bindValue(activeProperty, target, $scope);
    }
  }

  function bindValue(activeProperty, target, $scope){
    beacon($scope).on(EVENTS.DATA_CHANGE, function(){
      var value = util.getData(activeProperty.dataPath, $scope);
      target[activeProperty.name] = value;
    });
  }

   function getPropertyList(ruleStr){
     var reg = /(\w+)\s*:\s*(\S+?\b)/g
     var result = [];
     ruleStr.replace(reg, function(matchRule, propertyName, dataPath){
       var item = {
         name : propertyName,
         dataPath : dataPath
       }
       result.push(item);
     })
     return result;
   }



  return api;
});
;Air.Module('B.directive.model', function(require){
  var nodeUtil  = require('B.util.node'),
      util      = require('B.util.util'),
      EVENTS    = require("B.event.events");
  var attrName = 'b-model';
  var api = function(target, $scope){
      var activeModel = null;
      if(!nodeUtil(target).hasAttribute(attrName)){
        return;
      }
      var dataPath = target.getAttribute(attrName)
                     .replace(/{{|}}/ig,'');

      function onInput(e){
        var target = this;
        new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)
        // activeModel = true;
        // beacon($scope).on(EVENTS.DATA_CHANGE, {fromBModel:true});
        // activeModel = false;

        var removedEvent = e.type === 'input' ? 'change' : 'input';
        beacon(target).off(removedEvent, onInput);
      }

      beacon(target).on('input', onInput);
      beacon(target).on('change', onInput);

      // beacon($scope).on(EVENTS.DATA_CHANGE, modelChangeHandle);
      $scope.listenDataChange(dataPath, modelChangeHandle)
      function modelChangeHandle(){
        var value = util.getData(dataPath, $scope);
        if(target.value === value){return};
        var result = !util.isEmpty(value) ? value : "";

        if(target.value !== value) {
         target.defaultValue = result;
         if (target.type !== 'file') {
           target.value = result;
         }
        }
      }
  }
  return api;
})
;Air.Module('B.scope.Scope', function(require) {
  var EVENTS =  require('B.event.events');
  var util =  require('B.util.util');
  var Scope = function(parent){
    this.parent = parent
  }

  var proto = {};

  function listenDataChange (targetT, dataPath, callback) {
    targetT && beacon.utility.isType(targetT, 'Object') && Object.observe(targetT, function(dataChanges){
      // TODO 重构
      for(var i = 0; i < dataChanges.length; i++){
        if(dataChanges[i].type == 'add'){
          var target = dataChanges[i];
          var attr = target.object[target.name];
          listenDataChange (attr, dataPath, callback);
        }
        beacon.utility.arrayIndexOf(dataPath.split('.'), dataChanges[i].name) >= 0 && callback()
      }
    });
  }

  // TODO: 重构
  proto.listenDataChange =  function (dataPath, callback){
      var self = this;
      var fn = function(){
        callback();

        var r = dataPath.split('.');
        var activeT = ""
        for(var i = 0; i < r.length-1; i++){
          if(activeT){
             activeT = activeT + '.' + r[i];
          } else {
            activeT = r[i]
          }

          var targetT = util.getData(activeT, self);
          listenDataChange(targetT, dataPath, callback);
        }
      }
      if (typeof self.$index === 'number') {
        setTimeout(fn, 0); // 否则会死循环
      } else {
        beacon(self).once(EVENTS.RUN_COMPLETE, fn);
      }

      Object.observe(self, function(dataChanges){
        for(var i=0;i<dataChanges.length;i++){
          if(dataChanges[i].type == 'add'){
            var target = dataChanges[i];
            var attr = target.object[target.name];
            listenDataChange (attr, dataPath, callback);
          }
          dataChanges[i].name === dataPath.split('.')[0] && callback()
        }
      });
    }

  var api = function(parent){
        Scope.prototype = parent || proto;
        return new Scope(parent);
  }
  return api;
});
;Air.Module('B.directive.repeat', function(require){
  var attrName = 'b-repeat';
  var nodeUtil = require('B.util.node');
  var Scope = require('B.scope.Scope');
  var EVENTS =  require('B.event.events');
  var util =  require('B.util.util');

  function init(target, scope) {
    var placeholder = generatePlaceholder(target);

    tryDeleteCachedNodes(target.cachedNodes);

    var template = getTemplate(target);

    var repeatData = getRepeatData(template, scope);
    var repeatItems = generateRepeatItems(template, scope, repeatData, placeholder);

    return repeatItems;
  }

  function getRepeatData(template, scope) {
    var condition = template.getAttribute(attrName);
    var dataPath  = condition.replace(/\S+\s+in\s+(\S+)/ig, '$1');
    var itemName  = condition.match(/(\S+)\s+in\s+(\S+)/i)[1];
    template.repeatDataPath = dataPath;

    var data = util.getData(dataPath, scope);

    return {
      data: data,
      itemName: itemName,
      dataPath : dataPath
    };
  }

  function generatePlaceholder(target) {
    if (target.placeholder) {
      return target.placeholder;
    }
    var placeholder = document.createComment('repeat placeholder ' + target.getAttribute(attrName));
    target.parentNode.insertBefore(placeholder, target);
    target.placeholder = placeholder;
    return placeholder;
  }

  function tryDeleteCachedNodes(cachedNodes) {
    cachedNodes = cachedNodes || [];
    for (var i = 0, len = cachedNodes.length, node; i < len; i++){
      node = cachedNodes[i];
      node.parentNode && node.parentNode.removeChild(node);
      unbind(node);
    }
  }

  function unbind(node){
    // for(var i=0; i<node.childNodes.length; i++){
    //   beacon(node.childNodes[i]).off();
    //   unbind(node.childNodes[i]);
    // }
  }

  function cacheNodes(template, node){
    template.cachedNodes = template.cachedNodes || [];
    template.cachedNodes.push(node);
  }

  function generateRepeatItems(template, parentScope, repeatData, placeholder) {
    var repeatItems = [];
    var nodes = [];
    var dataAry = repeatData.data;
    var itemName = repeatData.itemName;
    var tmpParent = document.createDocumentFragment();

    if (beacon.utility.isType(dataAry, 'Array')) {
      for (var i = 0, len = dataAry.length, data; i < len; i++) {
        var data = dataAry[i];
        var node = template.cloneNode(true);
        var scope = new Scope(parentScope);
        scope.$index = i;
        scope[itemName] = data;

        node.removeAttribute(attrName);
        tmpParent.appendChild(node);

        cacheNodes(template, node);

        repeatItems.push({
          node: node,
          $scope: scope
        });
      }
      placeholder.parentNode.insertBefore(tmpParent, placeholder);
      fixSelectElement(placeholder, template)
    }
    return repeatItems;
  }

  function getTemplate(target) {
    // fixSelectElement(target);
    target.parentNode && target.parentNode.removeChild(target);
    return target;
  }

  function fixSelectElement(placeholder, target){
    if(target.nodeName.toLowerCase()=='option'){
      setTimeout(function(){
        placeholder.parentNode.value = placeholder.parentNode.defaultValue;
      },0);
    }
  }

  function needRepeat(target, $scope) {
    var isRepeatDirective = nodeUtil(target).hasAttribute(attrName);
    var noRepeated = !target.repeatDataPath;
    target.cachedNodes = target.cachedNodes || [];
    var dataChange;
    if(target.repeatDataPath){
      dataChange = util.getData(target.repeatDataPath, $scope).length !== target.cachedNodes.length
    }
    // return isRepeatDirective;
    return (isRepeatDirective && noRepeated)  || dataChange
  }


  // TODO: 重构
  function listenDataChange(targetT, dataPath, callback){
    var isArray = targetT && beacon.utility.isType(targetT, 'Array');
    var isObject = targetT && beacon.utility.isType(targetT, 'Object');
     (isObject || isArray) && Object.observe(targetT, function(dataChanges){
      // var obj = getRepeatData(target, $scope)
      for(var i=0;i<dataChanges.length;i++){
        if(dataChanges[i].type == 'add'){
          var target = dataChanges[i];
          var attr = target.object[target.name];
          listenDataChange(attr, dataPath, callback);
        }
        dataChanges[i].name === 'length' && callback()
      }
    });
  }

  function tryListenDataChange(target, $scope, callback){
    beacon($scope).once(EVENTS.RUN_COMPLETE, function(){
      var obj = getRepeatData(target, $scope);
      callback();
      var r = obj.dataPath.split('.');
      var activeT = ""
      for(var i=0;i<r.length; i++){
        if(activeT){
           activeT = activeT + '.' + r[i];
        } else {
          activeT =  r[i]
        }

        var targetT = util.getData(activeT, $scope);
        listenDataChange(targetT, obj.dataPath, callback);
      }
    });

    Object.observe($scope, function(dataChanges){
      var obj = getRepeatData(target, $scope)
      for(var i=0,dataChange;i<dataChanges.length;i++){
        dataChange = dataChanges[i];
        var type = dataChange.type;
        if(type === 'add' || (type === 'update' && dataChange.oldValue !== dataChange.object[dataChange.name])){
          var target_ = dataChanges[i];
          var attr = target_.object[target_.name];
          listenDataChange(attr, obj.dataPath, callback);
        }
        dataChange.name === obj.dataPath.split('.')[0] && callback()
      }
    });
  }

  return {
    init: init,
    needRepeat: needRepeat,
    listenDataChange : tryListenDataChange
  };
});
;Air.Module('B.scope.scopeManager', function(require){
  var scopeList = [];
  var repeat = require('B.directive.repeat');
  var initModel =  require('B.directive.model');
  var EVENTS =  require('B.event.events');
  var util = require('B.util.util');
  var Scope =  require('B.scope.Scope');
  var nodeUtil = require('B.util.node');
  var eventDirective = require('B.directive.event');
  var showDirective = require('B.directive.show');
  var propertyDirective = require('B.directive.property');
  var memCache = require('B.data.memCache');
  var trim = function(str) {
    str = str || ''
    return str.trim ? str.trim() : str.replace(/^\s+|\s+^/,'');
  }

  var $rootScope = new Scope();

  function setRoot(params){
    beacon.utility.merge($rootScope, params);
  }

  function generateScopeTree(childNodes, $scope){
    for (var i = 0; i < childNodes.length; i++) {
      var activeChild = childNodes[i];
      tryParseNode(activeChild, $scope)
    }

  }

  function tryParseNode(target, $scope){
    switch (target.nodeType) {
      case nodeUtil.type.HTML:
        parseHTML(target, $scope);
        break;
      case nodeUtil.type.TEXT:
      case nodeUtil.type.ATTR:
        parseTextNode(target, $scope);
        break;
      default:

    }
  }

  function tryGenerateViewScope(target, $scope) {
    if (target.tagName.toLowerCase() === 'view') {
      var scopeKey = target.getAttribute('b-scope-key');
      var viewName = target.getAttribute('name');
      var subScopeName = scopeKey || viewName;
      if (scopeList[subScopeName]) {
        $scope = scopeList[subScopeName];
      } else {
        var $subScope = new Scope($scope);
        scopeList[subScopeName] = $subScope;
        $scope = $subScope;
      }

      if (scopeKey) {
        var controllerMap = memCache.get('controllerMap') || {};
        var controller = controllerMap[viewName];

        if (controller) {
          setTimeout(function(){
            b.run(viewName, controller);
          }, 0);
        }
      }
    }

    return $scope;
  }

  function generateRepeatScopeTree(target, $scope) {
    var repeatItems = repeat.init(target, $scope);
    for (var i = 0, len = repeatItems.length, repeatItem; i < len; i++) {
      repeatItem = repeatItems[i];
      generateScopeTree([repeatItem.node], repeatItem.$scope);
      generateScopeTree(repeatItem.node.attributes, repeatItem.$scope);
      beacon(repeatItem.$scope).on(EVENTS.DATA_CHANGE);
    }
  }

  function parseHTML(target, $scope){
    $scope = tryGenerateViewScope(target, $scope);
    initModel(target, $scope);
    eventDirective(target, $scope);
    showDirective(target, $scope);
    propertyDirective(target, $scope);


    if (repeat.needRepeat(target, $scope)) {
      // beacon($scope).on(EVENTS.DATA_CHANGE, function(){
      //
      //   var needRepeat = repeat.needRepeat(target, $scope)
      //   needRepeat && generateRepeatScopeTree(target, $scope);
      // });
      generateRepeatScopeTree(target, $scope);
      repeat.listenDataChange(target, $scope, function(){
        generateRepeatScopeTree(target, $scope);
      })
    } else {
      generateScopeTree(target.attributes, $scope);
      generateScopeTree([].concat.apply([], target.childNodes), $scope);
    }
  }

  function parseTextNode(node, $scope){
    var regMarkup = /{{.*?}}/ig;
    var text = node.nodeValue;
    if(text.match(regMarkup)){

      var txtNodeDataChange = (function(node, template){
        // 保持 template 的值，供后续替换使用
        var init = true;
        return function(){
          var text = template;
          var markups = text.match(regMarkup) || [];
          var isStyle = node.nodeName.toLowerCase() === 'b-style';
          for (var i = markups.length - 1; i >= 0; i--) {
            var markup   = markups[i];
            var dataPath = markup.replace(/{{|}}/ig,"");
            // TODO :  新增String.prototype.trim
            dataPath = trim(dataPath);
            // var data = util.getData(dataPath, $scope);
            var expression = getExpression(dataPath, init);
            var data = eval(expression) //new Function($scope, 'return ' + expression)($scope);
            data = util.isEmpty(data) ? '' : data;
            text = text.replace(markup, data);
          };

          init = false;

          if(node.nodeValue != text){
            var ownerElement = node.ownerElement;
            if(ownerElement && ownerElement.nodeName.toLowerCase() === 'option' && ownerElement.parentNode){
              setTimeout(function(){
                if (ownerElement.parentNode) {
                  ownerElement.parentNode.value = ownerElement.parentNode.defaultValue;
                }
              },0);
            }
            node.nodeValue = text;
            if (isStyle && ownerElement) {
                ownerElement.style.cssText = text;
            }
          }
        }
      })(node, node.nodeValue);

      function getExpression(dataPath, init){
        return dataPath.replace(/(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g, function(token){
           token = trim(token);
           if(/^\d+$/.test(token) || /^['"]/.test(token) || token=='' || token==='true' || token ==='false' ){
             return token
           } else {

             init && $scope.listenDataChange(token, function(){
               txtNodeDataChange();
             })

             var ancestorScope = getAncestorScope($scope);
             ancestorScope !== $scope && init && ancestorScope.listenDataChange(token, function(){
               txtNodeDataChange();
             })
             return 'util.getData("' + token + '", $scope)'
           }
        });
      }
      txtNodeDataChange();
      // var ancestorScope = getAncestorScope($scope);
      // beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
      //  ancestorScope !== $scope && beacon(ancestorScope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
    }

  }

  function parseScope(scopeName, dom){
    var scope = scopeList[scopeName];
    if (!scope) {
      scope = new Scope($rootScope);
      delete scope.parent;
      scopeList[scopeName] = scope;
    }
    generateScopeTree([].concat.apply([], dom.childNodes), scope);

    return scope;
  }

  function getScope(scopeName) {
    return scopeList[scopeName];
  }

  function getAncestorScope($scope) {
    if ($scope.parent) {
      return getAncestorScope($scope.parent);
    }
    return $scope;
  }

  return {
    parseScope : parseScope,
    getScope: getScope,
    setRoot: setRoot,
    getAncestorScope : getAncestorScope
  }
});;Air.Module('B.network.HTTP', function() {

  var state = {
    unInit: 0,
    opend: 1,
    sended: 2,
    receiving: 3,
    complete: 4
  }

  function XHR() {
    var xhr = new XMLHttpRequest();
    var request = this;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === state.complete) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || (xhr.status == 0 && request.requestURL.match(/^file:/))) {
          request.successCallBack && request.successCallBack(xhr);
        } else {
          request.errorCallBack && request.errorCallBack(xhr);
        }
      }
    };
    this.xhr = xhr;
  }

  XHR.prototype = {
    request: function(options) {
      this.requestURL = options.url;
      this.successCallBack = options.successCallBack;
      this.errorCallBack = options.errorCallBack;
      this.xhr.open(options.method, options.url, true);
      for (var key in options.header) {
        this.xhr.setRequestHeader(key, options.header[key]);
      }
      this.xhr.send(options.data);
    },

    get: function(url, options) {
      options = options || {};
      this.request({
        method: 'GET',
        url: url,
        successCallBack : options.successCallBack,
        errorCallBack : options.errorCallBack
      });
    },

    abort: function() {
      this.xhr.abort();
    }
  }
  return XHR;
});
;Air.Module('B.service.Service', function(require) {
  var HTTP = require('B.network.HTTP');
  var EVENTS =  require('B.event.events');
  var storage = require('B.data.storage');
  var middleware = require('B.util.middleware');

  var serviceQueue = {};

  var ERROR_CODE = {
    parse: 1, // JSON 解析出错
    timeout: 2, // 超时
    network: 3, // 网络错误
    business: 4 // 业务错误（由中间件控制）
  }

  function Service(config, scope, controlEvents){
    config = config || {};
    var header = config.header || {};
    header['Content-Type'] = 'application/json;charset=utf-8';

    var self = this;
    var requestParams = null;
    var http = new HTTP();
    this.noTriggerEvent = false; // 不触发事件

    var SERVICEEVENTS = {
      SUCCESS: beacon.createEvent("service response success"),
      ERROR: beacon.createEvent("service response error")
    }

    this.EVENTS = SERVICEEVENTS;

    this.on = function(event, handle){
      beacon(self).on(event, handle);
    }

    this.off = function(event, handle){
      beacon(self).off(event, handle);
    }

    this.getConfig = function() {
      var header = beacon.utility.merge({}, config.header);
      return beacon.utility.merge({}, config, {header: header});
    }

    this.query = function(requestParams, options){
      options = options || {};
      var timeoutSeconds = beacon.isType(config.timeout, 'Number') ? config.timeout : 30;
      var url = config.protocol + '://' + config.host + config.path;
      var cacheKey = url + JSON.stringify(requestParams);
      var finished = false;
      var timer = null;

      var requestOptions = {
        url: url,
        method: config.method,
        header: header,
        data: JSON.stringify(requestParams),
        serviceName: config.serviceName
      };

      var tryReturnCacheData = function(noCacheCallback) {
        storage.get(cacheKey, function(cachedDataText) {
          try {
            var cachedData = JSON.parse(cachedDataText);

            if (cachedData) {
              var fromCache = true;
              setTimeout(function(){ // 否则在有缓存时，事件会等服务回来后才执行完毕
                options.successCallBack && options.successCallBack(cachedData, fromCache);
                beacon(self).on(SERVICEEVENTS.SUCCESS, cachedData);
                beacon(scope).on(EVENTS.DATA_CHANGE);
              }, 0);

              return;
            }
          } catch(e) {}

          noCacheCallback && noCacheCallback();
        });
      }

      var curServiceQueue = serviceQueue[cacheKey];
      if (!options.noCache && !curServiceQueue) {
        tryReturnCacheData(startQuery);
      } else {
        startQuery();
      }

      function startQuery() {
        controlEvents.onQuery && controlEvents.onQuery();

        callBeforeQueryMiddleware(requestOptions, function(){
          curServiceQueue = serviceQueue[cacheKey];

          // 首次进入，队列不存在
          if (!curServiceQueue) {
            curServiceQueue = serviceQueue[cacheKey] = [];

            // 避免外部修改回调函数，所以在外部处理完成后再赋值
            requestOptions.successCallBack = httpSuccessCallback;
            requestOptions.errorCallBack = httpErrorCallback;

            http.request(requestOptions);
            startTimeoutCount();
          } else {
            curServiceQueue.push({
              httpSuccessCallback: httpSuccessCallback,
              httpErrorCallback: httpErrorCallback
            })
          }
        });
      }

      function startTimeoutCount() {
        timer = setTimeout(function(){
          http.abort();
        }, timeoutSeconds * 1000);
      }

      function clearTimeoutCount() {
        clearTimeout(timer);
      }

      function httpSuccessCallback(xhrOrResponseData, isQueue) {
        clearTimeoutCount();
        xhrOrResponseData = xhrOrResponseData || {};
        var responseText = '';
        var responseData = null;
        var parseError = false;

        controlEvents.onComplete && controlEvents.onComplete();

        // 不是队列进入的，并且readState为4，则解析json
        if (!isQueue && xhrOrResponseData.readyState === 4) {
          responseText = xhrOrResponseData.responseText;
          try {
            responseData = JSON.parse(responseText);
          } catch(e) {
            parseError = true;
          }
        } else { // 否则，为队列传入的responseData
          responseData = xhrOrResponseData;
        }

        if (parseError) {
          options.errorCallBack && options.errorCallBack(ERROR_CODE.parse, responseText);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : ERROR_CODE.parse,
            response : responseText
          });
          beacon(scope).on(EVENTS.DATA_CHANGE);
          if (!isQueue) {
            var isError = true;
            runQueue(isError, xhrOrResponseData);
          }

          tryClearQueue();

          return;
        } else {
          callAfterQueryMiddleware({xhr: http.xhr, data: responseData, requestParam: requestOptions}, function(isError) {
            if (isError) {
              options.errorCallBack && options.errorCallBack(ERROR_CODE.business, responseData);
              beacon(self).on(SERVICEEVENTS.ERROR, {
                error : ERROR_CODE.business,
                response : responseData
              });
              if (!isQueue) {
                var isError = true;
                runQueue(isError, xhrOrResponseData);
              }
            } else {
              var useCache = false;
              var noCacheRun = function() {
                // 记录缓存
                config.expiredSecond && storage.set(cacheKey, responseText, {
                  expiredSecond: config.expiredSecond
                });

                options.successCallBack && options.successCallBack(responseData);
                beacon(self).on(SERVICEEVENTS.SUCCESS, responseData);
                if (!isQueue) {
                  var isError = false;
                  runQueue(isError, responseData);
                }
              }

              if (!options.noCache) {
                useCache = tryReturnCacheData(noCacheRun);
              } else {
                noCacheRun();
              }
            }

            beacon(scope).on(EVENTS.DATA_CHANGE);

            tryClearQueue();

          });
        }
      }

      function httpErrorCallback(xhr, isQueue) {
        clearTimeoutCount();

        controlEvents.onComplete && controlEvents.onComplete();
        tryClearQueue();

        // abortAll时不触发事件
        if (self.noTriggerEvent) {
          self.noTriggerEvent = false;
          return;
        }

        // status = 0 为abort后进入的，算做超时
        var errorCode = xhr.status ? ERROR_CODE.network : ERROR_CODE.timeout;
        callAfterQueryMiddleware({errorCode: errorCode, xhr: xhr, requestParam: requestOptions}, function(errorInfo){
          options.errorCallBack && options.errorCallBack(errorCode, errorInfo);
          beacon(self).on(SERVICEEVENTS.ERROR, {
            error : errorCode,
            response : errorInfo
          });

          if (!isQueue) {
            var isError = true;
            runQueue(isError, xhr);
          }
        });

        beacon(scope).on(EVENTS.DATA_CHANGE);

      }

      function runQueue(isError, xhrOrResponseData) {
        var args = [].slice.call(arguments, 1);
        var isQueue = true;
        if (curServiceQueue && curServiceQueue.length) {
          for (var curService; curService = curServiceQueue.shift();) {
            if (curService) {
              if (isError) {
                curService.httpErrorCallback && curService.httpErrorCallback.call(self, xhrOrResponseData, isQueue);
              } else {
                curService.httpSuccessCallback && curService.httpSuccessCallback.call(self, xhrOrResponseData, isQueue);
              }
            }
          }
          tryClearQueue();
        }
      }

      // 服务请求完，如果队列为空，则删除队列
      function tryClearQueue() {
        if (curServiceQueue && !curServiceQueue.length) {
          delete serviceQueue[cacheKey];
        }
      }
    };

    this.abort = function(noTriggerEvent){
      self.noTriggerEvent = noTriggerEvent;
      http.abort();
    };
  }

  // beforeQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件无返回值
  function callBeforeQueryMiddleware(requestOptions, next) {
    var fnName = 'beforeQuery';
    middleware.run(fnName, requestOptions, next);
  }

  // afterQuery 方法对外支持中间件，中间件参数为 requestOptions，中间件返回是否失败
  function callAfterQueryMiddleware(responseData, next) {
    var fnName = 'afterQuery';
    middleware.run(fnName, responseData, next);
  }

  return Service;

});
;Air.Module('B.service.serviceFactory', function(require) {
  var configList = [];
  var serviceList = [];
  var Service = require('B.service.Service');
  var middleware = require('B.util.middleware');
  var serviceInstanceList = [];

  function setConfig(configName, config) {
    if (configName) {
      configList[configName] = config;
    }
  }

  function getConfig(configName) {
    return configList[configName] || {};
  }



  function set(serviceName, config) {
    if (serviceName) {
      var newConfig = beacon.utility.merge({}, getConfig(config.extend), config);
      serviceList[serviceName] = newConfig;
    } else {
      throw new Error('serviceName is required');
    }
  }

  function get(serviceName, scope) {
    var serviceConfig = serviceList[serviceName];
    if (serviceConfig) {
      serviceConfig.serviceName = serviceName;
      var service = new Service(serviceConfig, scope, {
        onQuery: function() {
          serviceInstanceList.push(service);
        },
        onComplete: function() {
          var index = beacon.utility.arrayIndexOf(serviceInstanceList, service);
          if (index !== -1) {
            serviceInstanceList.splice(index, 1);
          }
        }
      });
      return service;
    } else {
      throw new Error(serviceName + ' not found');
    }
  }

  function abortAll() {
    var tmpList = serviceInstanceList.concat([]);
    for (var i = 0, len = tmpList.length, service; i < len; i++) {
      service = tmpList[i];
      service && service.abort(true);
    }
  }

  return {
    setConfig: setConfig,
    set: set,
    get : get,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    abortAll: abortAll
  }
});
;Air.Module("B.router.router", function(){

  var routers = [];


  function set(routerConfig){
    var ruleObj = parseRule(routerConfig.rule);
    var router  = {
                    rule     : routerConfig.rule,
                    viewName : routerConfig.viewName,
                    sign     : routerConfig.sign,
                    reg      : ruleObj.reg,
                    params   : ruleObj.params
                  }
    routers.push(router);
    routers[routerConfig.viewName] = router;
  }

  function parseRule(ruleString){
    var paramRule = /:[\w-]+/ig;
    var params = [];
    var matchRuleStr  = ruleString.replace(paramRule, function(param){
                          params.push(param.replace(":",""));
                          return "([\\w-]+)";
                        });
    var reg = new RegExp("^" + matchRuleStr + "\/*$","i");
    return {
      reg: reg,
      params: params
    };
  }

  function getMatchedRouter(urlPath){
    var rulesCount = routers.length;
    var ruleIndex  = 0
    for(ruleIndex; ruleIndex < rulesCount; ruleIndex++){
      var activeRouter = routers[ruleIndex];
      var matchedRouter = tryMatchParams(activeRouter, urlPath);
      if (matchedRouter) {
        return matchedRouter;
      }
    }
    return null;
  }

  function tryMatchParams(activeRouter, urlPath) {
    var matchedRouter = null;
    var matchedParam = urlPath.match(activeRouter.reg);

    if(matchedParam){
      matchedRouter = {
        rule: activeRouter.rule,
        viewName: activeRouter.viewName,
        params: {}
      };
      var matchedParamCount = matchedParam.length;
      var marchedParamIndex = 1;

      for (marchedParamIndex; marchedParamIndex < matchedParamCount; marchedParamIndex++) {
        var paramName = activeRouter.params[marchedParamIndex - 1];
        matchedRouter.params[paramName] = matchedParam[marchedParamIndex]
      }
    }

    return matchedRouter;
  }

  function getURLByRule(rule, params, query, noOrigin) {
    var url = rule.replace(/:(\w+)/ig, function(param, key){
      return params[key] || "";
    });
    if (!location.origin) {
      location.origin = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: '');
    }
    url = (noOrigin ? '' : location.origin) + url + query;
    return url;
  }

  function getURLPathByViewName(viewName, options) {
    options = options || {};
    var params = options.params || {};
    var query  = options.query || "";
    var router = routers[viewName];
    var rule = router && router.rule || "";
    var url = getURLByRule(rule, params, query, options.noOrigin);
    return url;
  }

  function get(viewName) {
    return routers[viewName] || {};
  }

  var api = {
    set : set,
    getMatchedRouter : getMatchedRouter,
    getURLPathByViewName : getURLPathByViewName,
    get: get
  }
  return api;
});
;Air.Module("B.view.View", function(require){
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');

  function createDomByString(templateString){
    var div = document.createElement('div');
    if(typeof DOMParser === 'undefined'){
      div.innerHTML = 'X<div></div>' + templateString; // 兼容 IE8
    } else {
      div.innerHTML = templateString;
    }
    return div;
  }

  function loadStyle(styleList, dom) {
    for (var i = 0, len = styleList.length, style; i < len; i++) {
      style = styleList[i];
      dom.appendChild(style);
    }
  }


  function loadScript(scopeList, dom, fn) {
    // var scripts= dom.querySelector('script');
    setTimeout(function(){ // 兼容IE8 本地缓存造成的执行顺序bug
      runJS(scopeList, dom);
    },0)
    // var scripts= dom.querySelector('script');
    // runJS(scopeList, dom);
    fn && fn();

  }

  function runJS(scripts, dom){
    for (var scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
      var activeScript = scripts[scriptIndex];
      var tmpScript = document.createElement('script');
      var src = activeScript.src;

      // TODO loadJS 会检查相同url的则不重新加载
      // 不知为什么 loadJS 的时候该 view 的 dom 已经被插入了页面
      // 所以先给移除掉，后续再排查
      activeScript.parentNode && activeScript.parentNode.removeChild(activeScript);

      if (src) {
        Air.loadJS(src);
      } else {
        tmpScript.text = activeScript.text;
        dom.appendChild(tmpScript);
      }
    };
  }

  function splitDom(domWrapper, selector){
    //var scripts = domWrapper.querySelectorAll(selector);
    var scripts = domWrapper.getElementsByTagName(selector);
    scripts = [].concat.apply([], scripts)//[].slice.call(scripts); //兼容 IE8
    return scripts
  }

  function parseTag(tagName, viewName, dom, domWrapper, fn) {
    var domList = splitDom(domWrapper, tagName);

    // TODO : scope 命名 修改为 viewName::tagname 以 避免与view命名冲突
    var tagScope = scopeManager.parseScope(viewName + tagName, { childNodes: domList });

    beacon(tagScope).once(EVENTS.DATA_CHANGE, function(){
      fn && fn(domList);
    })

    beacon(tagScope).on(EVENTS.DATA_CHANGE);
  }

  function View(viewName, dom, options){
    options = options || {};
    // TODO 本地模板需要解析script上的{{}}
    if (beacon.isType(dom, 'String')) {
      var domWrapper = createDomByString(dom);

      dom = domWrapper.querySelector('view[name="' + viewName + '"]');

      parseTag('style', viewName, dom, domWrapper, function(tagList){
        loadStyle(tagList, dom);
      });
      parseTag('script', viewName, dom, domWrapper, function(tagList){
        loadScript(tagList, dom, options.initCallback);
      });
    }

    var template = null,
        router = null,
        initQueue = [],
        showBeforeQueue = [],
        showAfterQueue = [],
        hideQueue =[],
        events = {
          onShow: beacon.createEvent('view onShow'),
          onHide: beacon.createEvent('view onHide')
        };

    this.show = function (){
      dom.setAttribute('active','true');

      // IE8 不渲染
      if(typeof DOMParser === 'undefined'){
        dom.style.borderBottom = '1px solid transparent';
        setTimeout(function(){
          dom.style.borderBottom = 'none';
        }, 0);
      }
    },

    this.hide = function(){
      dom.removeAttribute('active');
    },

    this.getDom = function (){
      return dom;
    }

    this.getViewName = function (){
      return viewName;
    }

    this.events = events;

    this.parseSrc = function (){
      var els = dom.querySelectorAll('[b-src]') || [];
      for (var i = 0, len = els.length, el; i < len; i++) {
        el = els[i];
        var src = el.getAttribute('b-src');
        if (src) {
          el.setAttribute('src', src);
        }
      }
    };

  }

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
    var URLPath = location.pathname;
    var activeRouter = router.getMatchedRouter(URLPath);
    if (activeRouter) {
      goTo(activeRouter.viewName, {
        replace: true,
        init: true,
        params: activeRouter.params,
        query: location.search
      });
    } else {
      throw404();
    }
    listenURLChange();
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
    var paramObj = { viewName: viewName };
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
    return beacon.utility.arrayIndexOf(loadingViewList, viewName) === -1 ? false : true;
  }

  function addLoadingView(viewName) {
    var idx = beacon.utility.arrayIndexOf(loadingViewList, viewName);
    if (idx === -1) {
      loadingViewList.push(viewName);
    }
  }

  function removeLoadingView(viewName) {
    var idx = beacon.utility.arrayIndexOf(loadingViewList, viewName);
    if (idx !== -1) {
      loadingViewList.splice(idx, 1);
    }
  }

  function changeURLParams(viewName, options) {
    options = options || {};
    var $scope = scopeManager.getScope(viewName);
    $scope['$request'] = $scope.$request || {};
    $scope.$request.params = options.params;
  }

  function getURL (viewName, options) {
    var url = router.getURLPathByViewName(viewName, {
      params: options.params,
      query: options.query
    });

    return url;
  }

  function switchURL (viewName, options) {
    options = options || {};
    var fromUrl = location.href;
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


    var fnName = 'afterURLChange';
    var paramObj = {
      from: fromUrl,
      to: url
    };
    // switchURL 方法对外支持中间件，中间件参数为 paramObj
    middleware.run(fnName, paramObj);
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

  function back () {
    window.history.back();
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


  function throw404(){
    var fnName = 'viewNotFound';
    middleware.run(fnName);
  };

  function getViewByViewName(viewName){
    return mainViewport.views[viewName];
  }

  function getScopeKeyByViewName(viewName) {
    var dom = activeView.getDom();
    var subViewDom = dom.querySelector('view[name="' + viewName + '"]');
    return subViewDom && subViewDom.getAttribute('b-scope-key') || '';
  }

  function loadView(viewName, options){
    showLoading();
    var env = memCache.get('env');
    var curRouter = router.get(viewName);
    var sign = curRouter.sign || '';
    var extPath = sign ? '_' + sign : '';
    var templatePath = env.$templatePath + viewName + extPath + '.html';
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
          hideLoading();
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
  }

  function triggerOnHide(curView, toView) {
    var viewName = curView.getViewName();
    curView && curView.hide();
    beacon(curView).on(curView.events.onHide, {
      to: toView
    });
    var $scope = scopeManager.getScope(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function triggerOnShow(curView, lastViewName) {
    var viewName = curView.getViewName();
    beacon(curView).on(curView.events.onShow, {
      from: lastViewName
    });
    var $scope = scopeManager.getScope(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function showLoading(){}

  function hideLoading(){}

  function getActive(){
    return activeView;
  }

  api = {
    init : init,
    goTo : goTo,
    back : back,
    addMiddleware : middleware.add,
    removeMiddleware : middleware.remove,
    showLoading : showLoading,
    hideLoading : hideLoading,
    getActive : getActive,
    getScopeKeyByViewName: getScopeKeyByViewName
  }

  return api;
});
;Air.Module("B.controller.run", function(require){
  var memCache = require('B.data.memCache');
  var run = function(controllerName, controller){
    var scopeManager = require("B.scope.scopeManager");
    var viewManager = require("B.view.viewManager");
    var EVENTS = require('B.event.EVENTS');
    var scopeKey = viewManager.getScopeKeyByViewName(controllerName);
    var scope = scopeManager.getScope(scopeKey || controllerName);

    if (scopeKey) {
      var controllerMap = memCache.get('controllerMap');
      if (!controllerMap) {
        controllerMap = {};
        memCache.set('controllerMap', controllerMap);
      }

      controllerMap[controllerName] = controller;
      memCache.set('controllerMap', controllerMap);
    }

    // TODO 需要在run之后再显示view
    Air.run(controller, false, scope);
    Air.run(function(){
      beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      beacon(scope).on(EVENTS.RUN_COMPLETE);
    })
  }

  return run;
});
;Air.Module("B.TDK.TDK", function() {
  var docHead = document.head || document.getElementsByTagName('head')[0];
  function setTitle(title) {
    document.title = title || document.title;
    return document.title;
  }

  function setDescription(description) {
    var descElement = getMetaElement('description')
    descElement.content = description || descElement.content;
    return descElement.content;
  }

  function setKeywords(keywords) {
    var keywordElement = getMetaElement('keywords')
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
  }
  return api;
});
;/**
 * @author baishuiz@gmail.com, xuemengfei@gmail.com
 * @version v0.2.0
 */
Air.run(function(require){
  var viewManager   = require("B.view.viewManager"),
      router = require("B.router.router"),
      memCache = require('B.data.memCache'),
      run = require('B.controller.run'),
      serviceFactory = require('B.service.serviceFactory');
      TDK = require('B.TDK.TDK');
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : viewManager, // ViewManager
      router   : router, // Router
      service  : serviceFactory,
      utility  : null,

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
      bridge   : {
        run: function(){},
        isHybrid: false,
        isInApp: false
      },
      ready    : function(callback){
        callback = typeof callback === 'function' ? callback : function(){};
        Air.domReady(function(){
          callback();
        });
      }
    };
    window[FRAMEWORK_NAME] = api;
  }()
});