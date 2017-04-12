!function(a){function b(a){this.target=a}var c=a.beacon,d=function(c){return this!==a&&d.blend(this,d),new b(c)};d.toString=function(){return"baishuiz@gmail.com"};var e={base:f,avatarCore:b.prototype,self:f,init:function(){var b=Object.freeze;a.beacon=d,e.merge(d,f),delete a.beacon.base,b&&b(d)},login:function(){a.beacon=d},logoff:function(){a.beacon=c}},f={base:e};a.beacon=f}(this),function(a){var b=a.base||{},c={merge:function(a){for(var b=arguments.length,c=1;b>c;c++){var d=arguments[c];for(var e in d)a[e]=d[e]}return a},blend:function(a,b,d){var e={cover:!0,mergePrototype:!1,reset:!1};if(d=d?c.merge(e,d):e,b=[].concat(b),d.reset)for(var f in a)b[0][f]||(b[0][f]=void 0);for(var g=b.length,h=0;g>h;h++){var i=b[h];for(var j in i){var k=d.mergePrototype||i.hasOwnProperty(j),l=d.cover||!a[j];k&&l&&(a[j]=i[j])}}return a},isType:function(a,b){return"Null"===b&&null===a||"Undefined"===b&&void 0===a||"Number"===b&&isFinite(a)||Object.prototype.toString.call(a).slice(8,-1)===b},arrayIndexOf:function(a,b){return c.arrayIndexOf=Array.prototype.indexOf?function(a,b){return a=[].slice.call(a,0),a.indexOf(b)}:function(a,b){a=[].slice.call(a,0);for(var c=a.length;c>=0;c--)if(a[c]===b)return c;return c},c.arrayIndexOf(a,b)},each:function(a,b){if(a){a=[].concat(a);for(var c=0;c<a.length;c++)b.call(a[c],c,a[c])}}};c.blend(b,c)}(beacon),function(a){var b=a.base,c=function(a){function c(a){var b=e(f,a);0>b&&(b=f.push(a)-1);var c="event_"+b,d=a.toString()===a,g=d?a:c;return g}function d(a){var b=e(f,a);return 0>b?null:c(a)}var e=b.arrayIndexOf,f=[],g={dom:a,target:a,attachEvent:function(a,b){var d=c(a);f[d]=f[d]||[],f[d].push(b)},removeEvent:function(a,b){var d,e=a&&c(a),g=e&&f[e];if(a&&b)for(var h=g.length-1;h>=0;h--){var i=g[h];i===b&&(d=f[e].splice(h,1))}else a&&!b?(d=f[e],f[e]=[]):a||b||(d=f,f=[]);return d},getEventList:function(a){var b;if(!a)return f.slice(0);var c=d(a);return c&&(b=a?f[c]:f.slice(0)),b}};return g};b.EventStructure=c}(beacon),function(a){function b(a){var b=new j(a);return h.push(b),b}function c(a,c,d){var e=g(a)||b(a);e.attachEvent(c,d)}function d(a,b,d){var e=b.registEvent(d),f=b.getEventList();i.each(f,function(b){c(a,f[b],e)})}function e(a,b,c){var d=h.slice(0),e=a?g(a)||[]:h.slice(0);i.each(e,function(a,e){if(e.removeEvent(b,c),!b&&!c||0==e.getEventList().length){var a=i.arrayIndexOf(h,e);d.splice(a,1)}}),h=d}function f(a,b,c){var d=b.removeEvent(c);i.each(d,function(c){var f=d[c],g=b.getEventList();i.each(g,function(b,c){e(a,c,f)})})}function g(a){if(!a)return h.slice(0);for(var b=0;b<h.length;b++){var c=h[b];if(c.target===a)return c}}var h=[],i=a.base,j=i.EventStructure,k={registEvent:c,registCombinationEvent:d,removeEvent:e,removeCombinationEvent:f,getEventList:g};i.eventStore=k}(beacon),function(a){function b(){if(this instanceof b)return this;var a=[],d=[],e=[].slice.call(arguments,0),f=e.slice(0),g=function(){function b(){return f=e.slice(0)}var g=function(b,e){var f=c.arrayIndexOf(a,b);0>f&&(a.push(b),d.push(e))},h=function(b){var e=c.arrayIndexOf(a,b),f=d[e];return b?f:d.slice(0)};this.resetEventList=b,this.getEventList=function(){return e.slice(0)},this.registEvent=function(a){var d=c.arrayIndexOf,f=e.slice(0),h=function(c,e){var g=this,h=d(f,c.eventType);h>=0&&f.splice(h,1),0===f.length&&(a.call(g,e),f=b())};return g(a,h),h},this.removeEvent=function(a){var b=[].concat(h(a));return b}};return g.prototype=new b,new g}var c=a.base;c.combinationalEvent=b}(beacon),function(a){var b=a.base,c=b.eventStore,d=c.registCombinationEvent,e=c.registEvent,f=c.removeCombinationEvent,g=c.removeEvent,h=c.getEventList,i={hostProxy:{},attachActionEvent:function(a,c,d){var e=a.desc,f=b.isType(a.desc,"Function");f&&e(c,d);var g=["touchmove","mousemove"];b.each(g,function(b,c){f&&window.beacon(document).on(c,function(b){i.publicDispatchEvent(a,b)})})},attachEvent:function(a,c){var f=this,g=a instanceof b.combinationalEvent?d:e;i.attachActionEvent(a,f,c),g(f,a,c)},fireEvent:function(a,c){var d=this,e=h(d);if(e){var f=e.getEventList(a),g=b.isType(a.desc,"Function"),i=g&&a.desc(c);!!i==!!g&&b.each(f,function(b,e){var f={eventType:a};e.call(d,f,c)})}},publicDispatchEvent:function(a,c){var d=h(),e=b.isType(a.desc,"Function");e&&a.desc(c),b.each(d,function(b){var e=d[b].dom;i.fireEvent.call(e,a,c)})},removeEvent:function(a,c){var d=this,e=a instanceof b.combinationalEvent?f:g;e(d,a,c)}},j=function(){var a=function(){};return a.prototype=i,b.blend(a,i),a}();b.Event=j}(beacon),function(a){var b=a.base,c=function(){return this}(),d=b.EventStructure,e={structures:[],getStructure:function(a){for(var b,c,d=0;d<e.structures.length;d++){b=e.structures[d];try{c=b.dom===a}catch(f){b.dom=window.document,c=b.dom===a}if(c)return b}},add:function(a,b,c){var f=e.getStructure(a);f||(f=new d(a),e.structures.push(f)),f.attachEvent(b,c)},remove:function(a,b,c){var d=e.getStructure(a);return d&&d.removeEvent(b,c)}},f={attachEvent:function(a,b){var d,e=this,g=function(a,b){var c=this;c.addEventListener(a,b,!1)},h=function(a,b){var c=this;c.attachEvent("on"+a,b)},i=function(a,b){var c=this,d=c["on"+a];c["on"+a]=function(){d.call(c),b.call(c)}};return c.addEventListener?(g.call(e,a,b),d=g):c.attachEvent?(h.call(e,a,b),d=h):(i.call(e,a,b),d=i),f.attachEvent=d},fireEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style;var d=document.createEvent("Event");d.initEvent(a,b.bubbles,b.cancelable),b.state&&(d.state=b.state),c.dispatchEvent(d)},f=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style,a="on"+a;var d=document.createEventObject();d.cancelBubble=b.cancelable,c.fireEvent(a,d)};return document.createEvent&&d.dispatchEvent?(e.call(d,a,b),c=e):document.createEventObject&&d.fireEvent&&(f.call(d,a,b),c=f),c},removeEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;c.removeEventListener(a,b,!1)},g=function(a,b){var c=this;c.detachEvent("on"+a,b)};return d.removeEventListener?(e.call(d,a,b),c=e):d.detachEvent&&(g.call(d,a,b),c=g),f.removeEvent=c}},g={attachEvent:function(a,b){var c=this;e.add(c,a,b),f.attachEvent.call(c,a,b)},fireEvent:function(a,b){var c=this;g.fireEVent=f.fireEvent.call(c,a,b)},removeEvent:function(a,c){var d=this;if(a&&c)f.removeEvent.call(d,a,c);else if(a&&!c){var h=e.remove(d,a);h&&b.each(h,function(){var b=this;g.removeEvent.call(d,a,b)})}else if(!a&&!c){var i=e.remove(d);i&&b.each(i,function(){var a=this;a&&b.each(i[a],function(){var b=this;g.removeEvent.call(d,a,b)})})}},isHTMLElement:function(a){var b=a==document||a==window,c=function(a){var b=a&&a.nodeName;return b&&a.nodeType};return b||c(a)},isEventSupported:function(a,c){if(!g.isHTMLElement(a)||!b.isType(c,"String"))return!1;var d=!1;if(a===window||a===document){d="on"+c in a;var e=!!window.ActiveXObject,f=e&&!!document.documentMode;if(!d&&f)return!1;if(d)return!0;var h=document.createElement("iframe");h.style.display="none",document.body.appendChild(h);var i=a===window?h.contentWindow:h.contentDocument;g.attachEvent.call(i,c,function(){d=!0}),g.fireEvent.call(i,c),h.parentNode.removeChild(h)}else{var j=a.tagName,c="on"+c;a=document.createElement(j),d=c in a,d||(a.setAttribute(c,"return;"),d="function"==typeof a[c]),a=null}return d}};b.DOMEvent=g}(beacon),function(a){var b=a.base,c={on:function(){var b=a.base,c=b.isType,d=b.Event.hostProxy,e=b.Event.publicDispatchEvent,f=b.Event.attachEvent,g=function(a,b){var g=[].slice.call(arguments,0);b&&c(b,"Function")?f.apply(d,g):e.apply(d,g)};return g}(a),once:function(a,b){var d=function(e,f){c.off(a,d),b.call({},e,f)};c.on(a,d)},off:function(){var b=a.base,c=b.Event.hostProxy,d=function(){var a=[].slice.call(arguments,0);b.Event.removeEvent.apply(c,a)};return d}(),blend:b.blend,NS:b.NS,arrayIndexOf:b.ArrayIndexOf,isType:b.isType,Enum:b.Enum,loginGlobal:b.login,logoffGlobal:b.logoff,utility:b,createEvent:function(){var a,c=[].slice.call(arguments,0);return a=arguments.length>1?b.combinationalEvent.apply(this,c):{desc:c[0]}}},d={on:function(b,c){var d=[].slice.call(arguments,0),e=this.target,f=a.base,g=f.DOMEvent.isHTMLElement(e),h=f.DOMEvent.isEventSupported(e,b),i=g&&h?f.DOMEvent.fireEvent:f.Event.fireEvent,j=g&&h?f.DOMEvent.attachEvent:f.Event.attachEvent;c&&f.isType(c,"Function")?f.each(e,function(a,b){j.apply(b,d)}):f.each(e,function(a,b){i.apply(b,d)})},once:function(a,b){var c=this,e=function(f,g){d.off.call(c,a,e),b.call(c,f,g)};d.on.call(c,a,e)},off:function(a,c,d){var e=this.target,f=b.DOMEvent.isHTMLElement(e),g=a&&b.DOMEvent.isEventSupported(e,a);f&&g?b.DOMEvent.removeEvent:b.Event.removeEvent,b.each(e,function(e,g){var h=a&&b.DOMEvent.isEventSupported(g,a);f&&b.DOMEvent.removeEvent.call(g,a,c,d),h||b.Event.removeEvent.call(g,a,c,d)})}};b.blend(b.avatarCore,d),b.blend(a,c),b.init()}(beacon),function(a){function b(a){this.target=a}var c=function(a){return new b(a)};c.toString=function(){return"baishuiz@gmail.com"};var d=document.getElementsByTagName("script"),e=d[d.length-1],f={avatarCore:b.prototype,plugins:{},attach:function(a,b){f.plugins[a]=b},baseURL:e.src.replace(/\/[^\/]+$/,"/"),URLMap:{},CDNTimestamp:e.getAttribute("data-CDNTimestamp")||"",isDebug:!1,init:function(b){a.Air=f.plugins.merge(c,b)}},g={base:f};a.Air=g}(this),function(a){var b={NS:function(a,b){for(var c=a.split("."),d=b||window||{},b=d,e=0,f=c.length;f>e;e++)d[c[e]]=void 0===d[c[e]]?{}:d[c[e]],d=d[c[e]];return d},beacon:beacon,merge:beacon.utility.merge,setBaseURL:function(b){return beacon.isType(b,"Object")?(a.base.URLMap=b,a.base.baseURL=b.base||a.base.baseURL):a.base.baseURL=b||a.base.baseURL}};b.merge(a.base.plugins,b)}(Air),function(a){function b(){try{document.documentElement.doScroll("left")}catch(a){return void setTimeout(b,1)}g()}function c(a){return 1==d?void a():void e.push(a)}var d=!1,e=[],f=a.base.plugins.beacon,g=(a.base.plugins,function(){f(document).off("readystatechange",h),f(document).off("DOMContentLoaded",g),f(window).off("load",g);for(var a;a=e.shift();)d||a();d=!0}),h=function(){(/loaded|complete/.test(document.readyState)||1==d)&&g()};f(document).on("readystatechange",h),f(document).on("DOMContentLoaded",g),f(window).on("load",g),document.documentElement.doScroll&&b(),a.base.attach("DOMReady",c)}(Air),function(a,b){function c(a,b){var c=1;this.loadJS=function(){if(/\bArray\b/.test(Object.prototype.toString.call(a))){c=a.length;for(var d=c-1;d>=0;d--)e(a[d],function(){--c||b()})}else e(a,b)}}function d(){function a(){b.currentJs||(b.currentJs=b.shift(),b.currentJs&&b.currentJs.loadJS())}var b=[];b.currentJs=null,this.loadJS=function(d,e){var f=function(){b.currentJs=null,e&&e(),a()};return b.push(new c(d,f)),a(),this}}function e(a,c){var d,e=document.getElementsByTagName("head")[0],f=document.createElement("script"),g=!1,h=b.base.plugins.beacon,i=function(){g=!0,h(f).off("load"),h(f).off("readystatechange"),i=function(){},c&&c()},j=function(){/loaded|complete/.test(f.readyState)&&0==g&&i()};f.async=!0,f.setAttribute("type","text/javascript"),f.src=a,h(f).on("load",i),h(f).on("readystatechange",j),h(f).on("error",i);for(var k=document.getElementsByTagName("script"),l=0,m=k.length;!d&&m>l;l++)d=a==k[l].getAttribute("src");d||e.appendChild(f)}function f(a,b){var c=new d;return c.loadJS(a,b),c}b.base.attach(a,f)}("loadJS",Air),function(a){function b(b,d){"use strict";function e(){var e=i.toLowerCase(),f=h.toLowerCase(),g=a.base,j=g.plugins.beacon,k=g.plugins.NS,l=g.plugins.NS(h.toLowerCase(),g)[e],m=d(g.Require,g.run);l?"function"==typeof m?k(f,g)[e]=g.plugins.merge(m,l):g.plugins.merge(l,m):k(f,g)[e]=m,c[b.toLowerCase()]=!0,j.on(a.base.Require.Event.LOADED,{moduleName:b})}var f=a.base.plugins;f.beacon.on(a.base.Require.Event.REQUIREING,{moduleName:b});var g=b.match(/(^.*)\.(\w*)$/),h=g[1],i=g[2],j=d.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");j=j.replace(/(['"\/])[\w\W]*?\1|((['"\/])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var k=j.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(j,""),l=k&&new RegExp("\\b"+k+"\\s*\\(([^\\)]+)\\)","gm"),m=[];l&&j.replace(l,function(b,d){var e,f,g=/['" ]/g,h=d.split(",");h.length>1?(e=h[0].replace(g,""),f=h[1].replace(g,"")):e=d.replace(g,"");var i=e.toLowerCase();c[i]||(m[i]=m.push(i)-1),a.base.Require(e,f)});var n=new String(b);m.length&&beacon(n).on(a.base.Require.Event.LOADED,function(b,c){var d=c.moduleName.toLowerCase();m.hasOwnProperty(d)&&(delete m[d],m.splice(m[d],1)),m.length<=0&&(beacon(n).off(a.base.Require.Event.LOADED),e())}),m.length||e()}var c={};a.base.Module=b}(Air),function(a){function b(a){if(a)return g.moduleLoaded[a];for(var b=0,c=g.requireQueue.length;c>b;b++){var d=g.requireQueue[b];if(!g.moduleLoaded[d])return!1}return!0}function c(){d.on(f.COMPLETE),d(document).on("readystatechange"),c=function(){d.on(f.COMPLETE)}}var d=a.base.plugins.beacon,e=d.createEvent,f={COMPLETE:e("require_complete"),LOADED:e("require_loaded"),REQUIREING:e("require_requireing")},g={requiring:{},required:{},moduleLoaded:{},requireQueue:[]};d(g).on(f.REQUIREING,function(a,b){var c=b.moduleName.toLowerCase();g.requireQueue[c]||g.requireQueue.push(c),g.required[c]=!0});var h=function(d,e){function f(b){var c=b.match(/(^.*)(\.\w*)$/),d=(c[1],c[2],a.base.CDNTimestamp||"");return d=d&&"?"+d,a.base.baseURL+b.replace(/\./gi,"/")+".js"+d}function h(d){i(d)||(g.requiring[d]=!0,a.base.plugins.loadJS(e,function(){if(!g.required[d])throw new Error("module ["+d+"] is undefined! @"+e);b()&&c()}))}function i(a){return g.required[a]||g.requiring[a]||g.moduleLoaded[a]}var j=d;if(d=d.toLowerCase(),g.required[d]||g.requiring[d]||g.moduleLoaded[d])return a.base.plugins.NS(d,a.base);if(e){var k=a.base.URLMap||{};e=e.replace(/{{(.+)}}/g,function(b,c){return k[c]||a.base.baseURL})}return e=e||f(j),d=d.toLowerCase(),g.requireQueue[d]=!0,g.requireQueue.push(d),h(d),a.base.plugins.NS(d,a.base)};d.on(f.LOADED,function(a,d){var e=d.moduleName.toLowerCase();g.required[e]=!0,g.moduleLoaded[e]=!0,b()&&c()}),h.Event=f,h.isRequireComplete=b,a.base.Require=h}(Air),function(a){function b(){for(;function(){var a=c.shift();return a&&a(),c.length}(););}var c=[],d=a.base.plugins.beacon,e=a.base.Require.Event;d.on(e.COMPLETE,b);var f=function(){function f(){for(var b=0;b<h.length;b++){var c=h[b];if(!h[c]&&!a.base.Require.isRequireComplete(c))return!1}return!0}var g,h=[];this.runNow&&d.on(e.LOADED,function(a,b){var c=b.moduleName.toLowerCase();h[c]=!0,beacon.utility.arrayIndexOf(h,c)>=0&&f()&&g&&g()}),this.run=function(d){g=d,this.runNow?f()&&d():(c.push(d),a.base.Require.isRequireComplete()&&b())},this.require=function(b,c){if(a.base.Require(b,c),b=b.toLowerCase(),h.push(b),!c){var d=b.match(/(^.*)\.(\w*)$/),e=d[1],f=d[2];a.base.plugins.NS(e,a.base)[f]}var g=a.base.plugins.NS(b,a.base);return g}},g=function(a,b){"use strict";var c=g;if(!(this instanceof c))return new c(a,b,arguments);var d=[].slice.call(arguments[2]).slice(2),e=this;e.runNow=b,f.call(e);var h=a.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");h=h.replace(/(['"\/])[\w\W]*?\1|((['"\/])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var i=h.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/,function(a,b){return b}).replace(h,""),j=i&&new RegExp("\\b"+i+"\\s*\\(([^\\)]+)\\)","gm");j&&h.replace(j,function(a,b){var c,d,f=/['" ]/g,g=b.split(",");g.length>1?(c=g[0].replace(f,""),d=g[1].replace(f,"")):c=b.replace(f,""),e.require(c,d)}),e.run(function(){var b=[e.require].concat(d);a.apply(this,b)})};a.base.attach("run",g)}(Air),function(a){var b=a.base.plugins,c={run:b.run,iRun:function(a){b.run(a,!0)},loadJS:b.loadJS,Module:a.base.Module,merge:a.base.merge,NS:b.NS,Enum:a.base.Enum,domReady:b.DOMReady,moduleURL:b.setBaseURL,setCDNTimestamp:a.base.setCDNTimestamp};a.base.init(c)}(Air);;Air.Module('B.util.middleware', function(){
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
      var rootParent = root.parent;
      var nsPath = pathString.split("."),
          ns = root || window || {},
          root = ns;
      // 如果不是最后一个为undefined，则赋值为空数组，避免Observe绑定失败
      for (var i = 0, len = nsPath.length; i < len; i++) {
          if(!ns || (ns[nsPath[i]] === undefined)){
              return  rootParent && util.getData(pathString, rootParent);
          } else {
              ns = ns[nsPath[i]];
          }
      };
      return ns ;
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
      // if ($scope.parent) {
      //   return getParentScope($scope.parent);
      // }
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
  var api = function(target, scopeStructure, watchData) {
    var isShowElement = node(target).hasAttribute(attribute);
    isShowElement && processShowElement(target, scopeStructure, watchData);
  }
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
;Air.Module('B.directive.style', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-style';
  var api = function(target, scopeStructure, watchData) {
    var isStyleElement = node(target).hasAttribute(attribute);
    isStyleElement && processStyleElement(target, scopeStructure, watchData);
  }

  function processStyleElement(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var attrNode = target.getAttributeNode(attribute);

    // attrNode.nodeValue = '{{' + attrNode.nodeValue + '}}';

    var tags = attrNode.nodeValue.match(/{{.*?}}/g) || [];

    // 遍历节点内所有数据标签
    for(var i = 0; i < tags.length; i++){
      var activeTag = tags[i];
      // watchData(activeTag, node, currentScopeIndex);
      watchData(activeTag, attrNode, scopeIndex, watchElement);
    }



    function watchElement(displayStatus) {
      target.style.cssText = displayStatus;
    }
  }


  var elemdisplay = {};
  return api;
});
;Air.Module('B.directive.property', function(require) {
  var node = require('B.util.node'),
    EVENTS = require('B.event.events'),
    util = require('B.util.util');

  var attribute = 'b-property';
  var api = function(target, scopeStructure, watchData) {
    var hasPropertyAttr = node(target).hasAttribute(attribute);
    hasPropertyAttr && setProperty(target, scopeStructure, watchData);
  }

  function setProperty(target, scopeStructure, watchData) {
    var $scope = scopeStructure.scope;
    var scopeIndex = scopeStructure.name;
    var attrNode = target.getAttributeNode(attribute);

    var ruleStr = target.getAttribute(attribute);
    var propertyList = getPropertyList(ruleStr);

    for (var i = 0; i < propertyList.length; i++) {
      var activeProperty = propertyList[i];
      (function(dataPath, name){
        // 设置初始值
        var value = util.getData(dataPath, $scope);
        if (value !== undefined) {
          target[name] = value;
        }

        var bindPath = '{{' + dataPath + '}}';
        watchData(bindPath, attrNode, scopeIndex, function() {
          var value = util.getData(dataPath, $scope);
          target[name] = value;
        });
      })(activeProperty.dataPath, activeProperty.name);
    }
  }

  function getPropertyList(ruleStr) {
    var reg = /(\w+)\s*:\s*([^,}\s]+)/g
    var result = [];
    ruleStr.replace(reg, function(matchRule, propertyName, dataPath) {
      var item = {
        name: propertyName,
        dataPath: dataPath
      }
      result.push(item);
    })
    return result;
  }



  return api;
});
;Air.Module('B.directive.model', function(require) {
  var nodeUtil = require('B.util.node'),
    util = require('B.util.util'),
    EVENTS = require("B.event.events");

  var attrName = 'b-model';

  function getTargetIndex(checkedList, target, selector, context) {
    context = context || document;
    var targetGroup = context.querySelectorAll(selector);
    for (var i = 0; i < targetGroup.length; i++) {
      var activeTarget = targetGroup[i];
      if (beacon.utility.arrayIndexOf(checkedList, activeTarget.value) >= 0) {
        activeTarget.checked = true;
      } else {
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
    } else {
      scope[lastNode] = value;
    }
    var result = {
      prefixPath: prefixPath,
      lastNode: lastNode
    }　　　
    return result;

  }



  var api = function(target, scopeStructure, watchData) {
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
          } else {
            itemIndex >= 0 && value.splice(itemIndex, 1);
          }

          var selector = target.nodeName.toLowerCase() + '[name=' + target.getAttribute('name') + ']';
          var context = b.views.getActive().getDom();
        } else {
          value = target.checked
        }
      } else {
        value = target.value
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
        return
      };
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
          } else {
            target.checked = result;
            target.value = result;
          }

        }
      }
    }
  }
  api.key = attrName;
  return api;
})
;Air.Module('B.scope.Scope', function(require) {
  var EVENTS = require('B.event.events');
  var util = require('B.util.util');
  var Scope = function(parent) {
    this.parent = parent;
  }

  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <textNode> 文本节点或属性节点.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(textNode, value, callback, scope, dataPath) {
    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },

      set: function(val) {
        var hasChanged = value !== val;
        var isArray = beacon.utility.isType(val, 'Array');
        var isObject = beacon.utility.isType(val, 'Object');
        var isPathNode = beacon.utility.isType(value, 'Array') || beacon.utility.isType(value, 'Object');
        if (hasChanged) {
          if (isPathNode) {
            // value = value ||  {};
            value = value || (isArray　? [] : {});

            if(isObject){
              for(var aa in value){
                if(!(aa in val)){
                  val[aa] = undefined;
                }
              }
            }

            beacon.utility.merge(value, val);
          } else {
            value = beacon.utility.isType(val, 'Undefined') ? '' : val;
            callback && callback();
          }
        }
      }
    }
    return descriptor;
  }

  var api = function(parent) {
    Scope.prototype = parent || {};
    Scope.prototype.constructor = Scope;
    return new Scope(parent);
  }
  return api;
});
;Air.Module('B.scope.ScopeTreeManager', function(require) {
  var Scope = require('B.scope.Scope');

  /**
   *作用：节点管理器类
   *参数：根 scope数据对象
   *返回：节点管理器 API
   *TODO: 考虑改为单例模式
   **/
  function ScopeTreeManager(rootScope) {
    var scopeTree = []; // scope 栈
    var scopeMap = {};
    var structure = function() {
      return {
        scope: null,
        // mScope : null,
        pn: null,
        name: null
      }
    }

    var getScope = function(index) {
      return scopeTree[index] || null;
    }

    /**
     *作用：更新根scope
     *参数：scope 新数据对象
     *返回：undefind
     **/
    var setRootScope = function(scope) {
      var rootScope = scopeTree[0] || structure();
      rootScope.scope = rootScope.scope || {};
      beacon.utility.merge(rootScope.scope, scope);
      scopeTree[0] = rootScope;
    }

    /**
     *作用：生成新的scope结构，该结构内含 scope 及 对应的中间scope（mscope）
     *参数：父级scope结构的索引值
     *返回：生成的scope结构的索引值
     **/
    var addScope = function(parentIndex, scopeName) {
      var parentScopeStructure = getScope(parentIndex);
      var newScope = structure();
      // var scopeIndex = scopeTree.push(newScope) - 1;
      scopeTree[scopeName] = newScope
      var scopeIndex = scopeTree.push(newScope) - 1;
      newScope.scope = new Scope(parentScopeStructure.scope);
      newScope.pn = parentIndex;
      newScope.name = scopeName;
      scopeMap[scopeName] = newScope;
      return scopeName;
    }

    var getScopeByName = function(scopeName) {
      return scopeMap[scopeName];
    }

    var getScopeInstanceByName = function(scopeName) {
      var scopeStructure = scopeMap[scopeName] || {};
      return scopeStructure.scope;
    }

    // 初始化根 scope
    setRootScope(rootScope);

    var api = {
      addScope: addScope,
      getScope: getScope,
      getScopeByName: getScopeByName,
      getScopeInstanceByName: getScopeInstanceByName,
      setRootScope: setRootScope
    };

    return api;
  }

  return ScopeTreeManager;
});
;Air.Module('B.directive.Repeater', function(require) {
  var attrName = 'b-repeat';
  var util = require('B.util.util');


  function getTemplateStr(str, idx, dataPath, dataPrefix) {
    var reg = new RegExp("\\b\(" + dataPrefix + "\)\\b", 'g');
    // var repeatIndexREG = new RegExp('\\b' + dataPath + '\\[\\d+\\]\\.\\$index\\b');
    var repeatIndexREG = new RegExp('\\b' + dataPath + '\\.\\d+\\.\\$index\\b', 'g');
    var repeatIndexREG2 = new RegExp('{{\\b' + dataPath + '\\.\\d+\\.\\$index\\b}}', 'g');

    var result = str.replace(/\{\{.*?\}\}|b-show\s*=\s*"[^"]*?"|b-model\s*=\s*"[^"]*?"|b-property\s*=\s*"[^"]*"|b-repeat\s*=\s*"[^"]*"/g, function(tag) {
      // return tag.replace(reg, dataPath + '[' + idx + ']');
      return tag.replace(reg, dataPath + '.' + idx);
    });
    result = result.replace(repeatIndexREG2, idx);
    result = result.replace(repeatIndexREG, idx);

    return result;
  }


  function fixSelectElement(placeholder, target) {
    if (target.nodeName.toLowerCase() == 'option') {
      setTimeout(function() {
        placeholder.parentNode.value = placeholder.parentNode.initValue;
      }, 0);
    }
  }

  /**
   *作用：repeat模板控制器类
   *参数: <template> repeat模板引用.
   *参数: <scope> 当前 repeat 元素所处的作用域.
   *返回：Repeater 实例
   **/
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
    var containerTagName = parentNode.tagName.toLowerCase();
    parentNode.removeChild(template);

    function generatePlaceholder(target) {
      if (target.placeholder) {
        return target.placeholder;
      }
      var placeholder = document.createComment('repeat placeholder ' + target.getAttribute(attrName));
      target.parentNode.insertBefore(placeholder, target);
      target.placeholder = placeholder;
      return placeholder;
    }

    var getCount = function() {
      var data = util.getData(dataPath, scope) || [];
      var count = data.length || 0;
      return count;
    }

    var getDataPrefix = function() {
      return dataPrefix;
    }

    var addUI = function(num) {

      // var templateStr = template.outerHTML;

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
        // newFirstNode = newFirstNode || ((i === 0) && targetNode);
        newNodeList.push(targetNode)
      }

      // 如果是 select 变动，则将 option 赋值后恢复 select 的选中值
      var isSelect = containerTagName === 'select';
      var initValue;
      var parentNode = tag.parentNode;
      if (isSelect) {
        initValue = parentNode.initValue;
      }

      parentNode.insertBefore(elementContainer, tag);

      if (isSelect) {
        setTimeout(function(){
          parentNode.value = initValue;
        }, 0);
      }

      fixSelectElement(tag, targetNode)
      elementContainer = null;
      docContainer = null;
      uiElementCount += num;
      return newNodeList;
    }

    var getPreviousElement = function(elm) {
      var e = elm.previousSibling;
      while (e && 1 !== e.nodeType) {
        e = e.previousSibling;
      }
      return e;
    }

    var removeUI = function(num) {
      num = Math.abs(num);
      for (var i = 0; i < num; i++) {
        var previousSibling = getPreviousElement(tag);
        if (previousSibling) {
          tag.parentNode.removeChild(previousSibling);
        }
      }
      uiElementCount -= num;
    }

    var updateUI = function() {
      var repeatCount = getCount();
      var num = repeatCount - uiElementCount;
      var isRemove = num < 0;
      var isAdd = num > 0;
      isRemove && removeUI(num);
      var newFirstNode = isAdd && addUI(num);
      return newFirstNode;
    }

    var descriptorList = [];

    /**
     *作用：监听 repeat 元素数据源变动
     *参数: <repeater> repeat ui 控制器
     *参数: <dataPath> 数据源路径
     *返回：undefind
     **/
    function bindRepeatData(repeater, dataPath) {
      var activePath = '';
      var pathNodes = dataPath.split('.') || [];
      // (template, currentScopeIndex, scopeStructure, parseTemplate)
      for (var i = 0; i < pathNodes.length; i++) {
        // var nextPathNode = pathNodes.shift();
        var nextPathNode = pathNodes[i];

        var activeObj = activePath ? util.getData(activePath, scope) : scope;
        activeObj = activeObj || Air.NS(activePath, scope);
        var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);

        // 如果之前绑定过，缓存起来，供 descriptor 回调
        var existDescriptor = Object.getOwnPropertyDescriptor(activeObj, nextPathNode);
        if (existDescriptor) {
          descriptorList.push(existDescriptor);
        };

        var descriptor = createRepeatDataDescriptor.call(activeObj, repeater, nextObj);
        Object.defineProperty(activeObj, nextPathNode, descriptor);
        activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
      }
    }

    /**
     *作用：创建 repeat 数据源的描述符
     *参数: <repeater> 模板 UI 控制器.
     *参数: <scope> 模板当前所处作用域.
     *返回：repeat 数据源的描述符
     **/
    function createRepeatDataDescriptor(repeater, value) {
      var oldLength = 0;
      value = value || [];
      var descriptor = {
        enumerable: true,
        configurable: true,
        get: function() {
          // 数组push操作等，会触发get，此时拿到的length是push之前的，所以要延迟
          setTimeout(function() {
            var length = value && value.length || 0;
            if (oldLength !== length) {
              var nodes = repeater.updateUI();
              // node && parseTemplate(node, currentScopeIndex);
              for (var i = 0; i < nodes.length; i++) {
                var activeNode = nodes[i];
                activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex)
              }

              for (var i = 0; i < descriptorList.length; i++) {
                descriptorList[i] && descriptorList[i].get && descriptorList[i].get();
              }
            }
            oldLength = length;
          }, 0);
          return value;
        },

        set: function(val, isSub) {
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

            for(var key in value){
              if(!val[key]){
                val[key] = undefined;
              }
            }

            // 子回调不赋值，只处理 dom
            if (!isSub) {
              beacon.utility.merge(value, val);
            }
          } else if (isArray) {
            value = value || [];

            // 子回调不赋值，只处理 dom
            if (!isSub) {
              var oldLen = value.length;
              var newLen = val.length;

              if (newLen < oldLen) {
                value.splice(newLen - oldLen, oldLen - newLen);
                oldLength = newLen;
              }

              for(var key in value){
                var keyNum = parseInt(key, 10);
                var isNumKey = beacon.utility.isType(keyNum, 'Number') && !isNaN(keyNum);
                if(!isNumKey && !val[key]){
                  val[key] = undefined;
                }
              }

              beacon.utility.merge(value, val);
            }

            var nodes = repeater.updateUI();
            for (var i = 0; i < nodes.length; i++) {
              var activeNode = nodes[i];
              activeNode && parseTemplate(activeNode, currentScopeIndex, currentScopeIndex)
            }
          }

          for (var i = 0; i < descriptorList.length; i++) {
            descriptorList[i] && descriptorList[i].set && descriptorList[i].set(val, true);
          }

        }
      }
      return descriptor;
    }

    var api = {
      updateUI: updateUI,
      getDataPrefix: getDataPrefix
    }

    bindRepeatData(api, dataPath);

    return api;
  }

  return Repeater;
});
;Air.Module('B.scope.tagManager', function(require) {
  var util = require('B.util.util');
  var nodeMap = [];

  /**
   *作用：新增 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *参数: <node> 文本节点|属性节点
   *返回：array  文本节点|属性节点列表
   **/
  function addNode(scopeIndex, token, node, callback){
    nodeMap[scopeIndex] = nodeMap[scopeIndex] || {};
    nodeMap[scopeIndex][token] = nodeMap[scopeIndex][token]  || [];
    nodeMap[scopeIndex][token].push({
      element : node,
      template : node.$template,
      callback : callback
    });
  }

  /**
   *作用：获取 token 相关文本节点|属性节点
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function getNodes(scopeIndex, token){
    var node = nodeMap[scopeIndex];
    var nodeList = node && node[token]  || [];
    return nodeList;
  }

  /**
   *作用：更新相关文本节点|属性节点值
   *参数: <scopeIndex> token 所在作用域编号
   *参数: <token> 数据路径
   *返回：array  文本节点|属性节点列表
   **/
  function updateNodeValue(scopeIndex, scope, token, callback){
    var nodes = getNodes(scopeIndex, token);
    for(var i = 0; i< nodes.length; i++){
      var activeNode = nodes[i];
      var newValue = activeNode.element.$template.replace(/{{(.*?)}}/g, function(tag, expression){
        return eval(expression) || '';
      });

      // 修正 select 开始
      // ToDo: 代码外移    （这段逻辑好像没什么用？xmf 20160927）
      var ownerElement = activeNode.element.ownerElement;
      if(ownerElement && ownerElement.nodeName.toLowerCase() === 'option' && ownerElement.parentNode){
        setTimeout(function(){
          if (ownerElement.parentNode) {
            ownerElement.parentNode.value = ownerElement.parentNode.initValue;
          }
        },0);
      }
      // 修正 select 结束

      activeNode.element.nodeValue = newValue;
      activeNode.callback && activeNode.callback(newValue);
    }
  }




  var api = {
        addNode : addNode,
        getNodes : getNodes,
        updateNodeValue : updateNodeValue
  };
  return api;
});
;Air.Module('B.scope.scopeManager', function(require) {
  var rootScope = {};
  var ScopeTreeManager = require('B.scope.ScopeTreeManager');
  var initModel = require('B.directive.model');
  var eventDirective = require('B.directive.event');
  var showDirective = require('B.directive.show');
  var styleDirective = require('B.directive.style');
  var propertyDirective = require('B.directive.property');
  var Repeater = require('B.directive.Repeater');
  var tagManager = require('B.scope.tagManager');

  var util = require('B.util.util');
  var nodeUtil = require('B.util.node');
  var memCache = require('B.data.memCache');

  var scopeTreeManager = new ScopeTreeManager(rootScope);

  var trim = function(str) {
    str = str || ''
    return str.trim ? str.trim() : str.replace(/^\s+|\s+^/, '');
  }

  function parseScope(scopeName, dom, needScope) {
    var scopeStructure = scopeTreeManager.getScopeByName(scopeName);
    if (!scopeStructure) {
      parseTemplate(dom, scopeName, null, null, needScope);
      scopeStructure = scopeTreeManager.getScopeByName(scopeName) || {};
    }

    return scopeStructure.scope;
  }

  function isHTML(node) {
    return node ? node.nodeType === nodeUtil.type.HTML : false;
  }

  function isView(node) {
    var isHTMLElement = isHTML(node);
    return isHTMLElement && (node.nodeName.toUpperCase() == 'VIEW');
  }

  function isRepeat(node) {
    var isHTMLElement = isHTML(node);
    return isHTMLElement && (node.hasAttribute('b-repeat'));
  }

  // DOM 树遍历回溯栈
  var backtrackingPoints = [];

  /**
   *作用：获取模板标签
   *参数: <content> 文本节点值/属性节点值
   *返回：array  模板标签列表
   **/
  function getDataPath(content) {
    return content.match(/{{.+?}}/g) || [];
  }

  /**
   *作用：监听文本节点或属性节点的数据源变动
   *参数: <dataPath> 数据源路径（有效 token）
   *参数: <currentScopeIndex> 当前作用域索引值
   *返回：undefined
   **/
  function bindObjectData(dataPath, currentScopeIndex, callback) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    var scope = scopeStructure.scope
    var activePath = '';
    // dataPath = dataPath.replace(/\.\d+$/,'')
    var pathNodes = dataPath.split('.') || [];
    for (var i = 0; i < pathNodes.length; i++) {
      // var nextPathNode = pathNodes.shift();
      var nextPathNode = pathNodes[i];
      var activeObj = activePath ? util.getData(activePath, scope) : scope;
      activeObj = activeObj || Air.NS(activePath, scope);
      var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);

      nextPathNode && (!Object.getOwnPropertyDescriptor(activeObj, nextPathNode) || /^\d+$/.test(nextPathNode) || (i === pathNodes.length - 1)) &&
        Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex, callback));
      activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
    }
  }



  /**
   *作用：监听文本节点|属性节点的数据变化
   *参数: <tag>  数据标签
   *参数: <node> 文本节点|属性节点
   *参数: <scopeIndex> 数据标签所在作用域索引值
   *返回：undefind
   **/
  function watchData(tag, node, scopeIndex, callback, callbackNow){
     var scope = scopeTreeManager.getScope(scopeIndex);
     var tokens = getTokens(tag, node, scopeIndex);
     for(var i = 0; i < tokens.length; i++){
       var activeToken = tokens[i];

      //  var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
      //  var scope = scopeStructure.scope
       callback && callbackNow && callback(util.getData(activeToken, scope.scope));

       tagManager.addNode(scopeIndex, activeToken, node, callback);
       bindObjectData(activeToken, scopeIndex, callback);
     }

  }


  /**
   *作用：获得有效 token 列表
   *参数: <tag> 数据标签
   *返回：有效 token 列表
   **/
  function getTokens(tag, node, scopeIndex) {
    node.$template = node.$template || node.nodeValue;
    var scope = scopeTreeManager.getScope(scopeIndex);
    // var tokens = tag.match(/(['"])?\s*([$a-zA-Z\._0-9\s\-]+)\s*\1?/g) || [];
    var tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = trim(tokens[i]);
      if (!(/^\d+$/.test(token) || /^['"]/.test(token) || token == '' || token === 'true' || token === 'false')) {
        var tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')', 'g');
        var lastTagStr = (node.$tag || tag);
        var tagStr = lastTagStr.replace(tokenReg, function($0, $1, $2) {
          if ($0.indexOf('util.getData("' + token) >= 0) {
            return $0
          } else {
            return $0.replace($2, 'util.getData("' + token + '", scope)')
          }
        });
        node.$template = node.$template.replace(lastTagStr, tagStr);
        node.$tag = tagStr;

        result.push(token);
      }
    }
    return result;
  }

  /**
   *作用：解析文本|属性节点，监听数据变化
   *参数: <node> 文本节点|属性节点
   *参数: <currentScopeIndex> 数据标签所在作用域索引值
   *返回：undefind
   **/
  function parseTEXT(node, currentScopeIndex) {
    var tags = node.nodeValue.match(/{{.*?}}/g) || [];
    var scope = scopeTreeManager.getScope(currentScopeIndex).scope;

    // 遍历节点内所有数据标签
    for (var i = 0; i < tags.length; i++) {
      var activeTag = tags[i];
      watchData(activeTag, node, currentScopeIndex);
      if (node.$tag) {
        var val = eval(node.$tag.replace(/(^{{)|(}}$)/g, '')) || '';
        node.nodeValue = node.nodeValue.replace(activeTag, val);
        node.$tag = '';
      }
    }
  }

  function tryGenerateSubViewScope(node, scopeStructure, currentScopeIndex) {
    if (node.tagName.toLowerCase() === 'view') {
      var scopeKey = node.getAttribute('b-scope-key');
      var viewName = node.getAttribute('name');
      var subScopeName = scopeKey || viewName;
      var subScope = scopeTreeManager.getScopeByName(subScopeName);
      if (!subScope) {
        var subScopeIndex = scopeTreeManager.addScope(currentScopeIndex, subScopeName);
        subScope = scopeTreeManager.getScope(subScopeIndex);
      }

      scopeStructure = subScope;

      if (scopeKey) {
        var controllerMap = memCache.get('controllerMap') || {};
        var controller = controllerMap[viewName];

        if (controller) {
          setTimeout(function() {
            b.run(viewName, controller);
          }, 0);
        }
      }
    }

    return scopeStructure;
  }

  /**
   *作用：遍历属性节点
   *参数: <node> HTML引用.
   *参数: <currentScopeIndex> 当前作用域索引值.
   *返回：undefind
   **/
  function parseHTML(node, currentScopeIndex) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    scopeStructure = tryGenerateSubViewScope(node, scopeStructure, currentScopeIndex);
    var scope = scopeStructure.scope;

    initModel(node, scopeStructure, watchData);
    eventDirective(node, scope);
    showDirective(node, scopeStructure, watchData);
    styleDirective(node, scopeStructure, watchData);
    propertyDirective(node, scopeStructure, watchData);

    var attributes = [].concat.apply([], node.attributes);
    for (var i = 0; i < attributes.length; i++) {　
      var activeAttribute = attributes[i];
      if ([initModel.key, showDirective.key].indexOf(activeAttribute.name) !== -1) {
        continue;
      }
      parseTEXT(activeAttribute, currentScopeIndex);
    }
  }


  /**
   *作用：模板解析
   *参数: <node> 模板引用.
   *参数: [currentScopeIndex] 模板当前所处作用域索引值.
   *返回：undefind
   **/
  function parseTemplate(node, scopeName, currentScopeIndex, isSub, needScope) {

    if (!node) {
      return
    }

    if (!isSub) {
      backtrackingPoints = [];
    }
    currentScopeIndex = currentScopeIndex || 0;

    var popPoints = function(nextNode, scopeName) {
      return {
        nextNode: nextNode,
        scopeName: scopeName
      }
    }


    var goOn = function(nextNode, scopeName) {
      if (!nextNode && isSub) {
        var lastNode = backtrackingPoints.pop();
        nextNode = lastNode && lastNode.nextSibling;
        var targetScopeIndex = isView(lastNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex
        scopeName = isView(lastNode) && targetScopeIndex;
      }

      return parseTemplate(nextNode, scopeName, targetScopeIndex || currentScopeIndex, true);
    }

    if (isView(node) || needScope) {
      // view scope 压栈
      scopeName = node.getAttribute('b-scope-key') || node.getAttribute('name');
      currentScopeIndex = scopeTreeManager.addScope(currentScopeIndex, scopeName);
      // scopeName = currentScopeIndex;
    } else if (isRepeat(node)) { // view 不允许进行 repeat
      var nextNode = isSub && node.nextSibling;
      var repeatNode = createRepeatNodes(node, currentScopeIndex);
      if (!repeatNode) {
        // repeat 元素没有下一个节点时退栈，统一放到 goOn 中处理
        return goOn(nextNode, scopeName);
      } else {
        node = repeatNode;
      }
    }



    // 回溯点压栈
    if (isSub && node.nextSibling && node.firstChild) { backtrackingPoints.push(node) };

    switch (node.nodeType) {
      case nodeUtil.type.HTML:
        parseHTML(node, currentScopeIndex);
        break;
      case nodeUtil.type.TEXT:
      case nodeUtil.type.ATTR:
        parseTEXT(node, currentScopeIndex);
        break;
      default:
    }

    var nextNode = node.firstChild || (isSub && node.nextSibling);

    return goOn(nextNode, scopeName);
  }


  /**
   *作用：基于 repeat 模板生成对应 UI元素
   *参数: <template> repeat模板引用.
   *参数: <scope> 当前 repeat 元素所处的作用域.
   *返回：使用 repeat 模板生成的第一个元素
   **/
  function createRepeatNodes(template, currentScopeIndex) {
    var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
    var repeater = new Repeater(template, currentScopeIndex, scopeStructure, parseTemplate);
    var newFirstNode = repeater.updateUI()[0];
    return newFirstNode;
  }

  /**
   *作用：创建文本节点或属性节点数据源的描述符
   *参数: <value> 模板标签初始值.
   *参数: <dataPath> 数据路径（标签模板内的有效 token）
   *参数: <scope> 当前标签所在的作用域id.
   *返回：文本节点或属性节点数据源的描述符
   **/
  function createDescriptor(value, dataPath, scopeIndex, callBack) {
    var scope = scopeTreeManager.getScope(scopeIndex);
    var oldLength = 0;

    var descriptor = {
      enumerable: true,
      configurable: true,
      get: function() {
       var isArray = beacon.utility.isType(value, 'Array');
       if(isArray){
         // 数组push操作等，会触发get，此时拿到的length是push之前的，所以要延迟
         setTimeout(function() {
           if (oldLength !== value.length) {
             callBack && callBack();
           }
           oldLength = value.length;
         }, 0);
       }

        return value;
      },

      set: function(val) {
        var hasChanged = value !== val;
        var isArray = beacon.utility.isType(val, 'Array');
        var isObject = beacon.utility.isType(val, 'Object');
        var isPathNode = isArray || isObject;
        if (hasChanged && isPathNode) {
          value = value || (isArray　? [] : {});
          if (isArray) {
            var oldLen = value.length;
            var newLen = val.length;

            if (newLen < oldLen) {
              value.splice(newLen - oldLen, oldLen - newLen);
            }
          }

          if(isObject){
            for(var aa in value){
              if(!(aa in val)){
                val[aa] = undefined;
              }
            }
          }

          beacon.utility.merge(value, val);
          // beacon.utility.blend(value, val, {reset:true});
          isArray && callBack && callBack();
        } else {
          if (value !== val) {
            value = val;
            tagManager.updateNodeValue(scopeIndex, scope.scope, dataPath);
          }
        }
      }
    }
    return descriptor;
  }


  return {
    parseScope: parseScope,
    getScope: scopeTreeManager.getScopeByName,
    setRoot: scopeTreeManager.setRootScope,
    getScopeInstance: scopeTreeManager.getScopeInstanceByName,
    watchData: watchData
  }
});
;Air.Module('B.network.HTTP', function() {

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
          callAfterQueryMiddleware({xhr: http.xhr, data: responseData, requestParam: requestOptions, errorCode: ERROR_CODE.parse}, function(isError) {
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
          });
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
    var domList = splitDom(domWrapper, tagName) || [];
    domList = [].concat.apply([], domList);

    for (var i = 0; i < domList.length; i++) {
      // TODO : scope 命名 修改为 viewName::tagname 以 避免与view命名冲突
      var needScope = true;
      var tagScope = scopeManager.parseScope(viewName + tagName, domList[i], needScope);

      fn && fn(domList);
    }
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
    var paramObj = { viewName: viewName, options: options };
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

    if(options.isComponent){return;} // 全屏组件不切换 URL，也不需要更新URL参数
    var $scope = scopeManager.getScopeInstance(viewName);
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
    showLoading();
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
    var $scope = scopeManager.getScopeInstance(viewName);
    beacon($scope).on(EVENTS.DATA_CHANGE);
  }

  function triggerOnShow(curView, lastViewName) {
    var viewName = curView.getViewName();
    beacon(curView).on(curView.events.onShow, {
      from: lastViewName
    });
    var $scope = scopeManager.getScopeInstance(viewName);
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
    getScopeKeyByViewName: getScopeKeyByViewName,
    getTemplate : getTemplate

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
      scopeManager = require('B.scope.scopeManager'),
      router = require("B.router.router"),
      memCache = require('B.data.memCache'),
      run = require('B.controller.run'),
      serviceFactory = require('B.service.serviceFactory'),
      HTTP = require('B.network.HTTP'),
      TDK = require('B.TDK.TDK');
  void function main(){
    var FRAMEWORK_NAME = "b";
    var api = {
      views    : viewManager, // ViewManager
      router   : router, // Router
      scopeManager　:　scopeManager,
      service  : serviceFactory,
      utility  : {
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
      },
      setModuleURL: function(url) {
        Air.moduleURL(url);
      }
    };
    window[FRAMEWORK_NAME] = api;
  }()
});
