!function(a){function b(a){this.target=a}var c=a.beacon,d=function(c){return this!==a&&d.blend(this,d),new b(c)};d.toString=function(){return"baishuiz@gmail.com"};var e={base:f,avatarCore:b.prototype,self:f,init:function(){var b=Object.freeze;a.beacon=d,e.merge(d,f),delete a.beacon.base,b&&b(d)},login:function(){a.beacon=d},logoff:function(){a.beacon=c}},f={base:e};a.beacon=f}(this),function(a){var b=a.base||{},c={merge:function(a){for(var b=arguments.length,c=0;b>c;c++){var d=arguments[c];for(var e in d)a[e]=d[e]}return a},blend:function(a,b,d){var e={cover:!0,mergePrototype:!1};d=d?c.merge(e,d):e,b=[].concat(b);for(var f=b.length,g=0;f>g;g++){var h=b[g];for(var i in h){var j=d.mergePrototype||h.hasOwnProperty(i),k=d.cover||!a[i];j&&k&&(a[i]=h[i])}}return a},isType:function(a,b){return"Null"===b&&null===a||"Undefined"===b&&void 0===a||"Number"===b&&isFinite(a)||Object.prototype.toString.call(a).slice(8,-1)===b},arrayIndexOf:function(a,b){return c.arrayIndexOf=Array.prototype.indexOf?function(a,b){return a=[].slice.call(a,0),a.indexOf(b)}:function(a,b){a=[].slice.call(a,0);for(var c=a.length;c>=0;c--)if(a[c]===b)return c;return c},c.arrayIndexOf(a,b)},each:function(a,b){if(a){a=[].concat(a);for(var c=a.length-1;c>=0;c--)b.call(a[c],c,a[c])}}};c.blend(b,c)}(beacon),function(a){var b=a.base,c=function(a){function c(a){var b=d(e,a);0>b&&(b=e.push(a)-1);var c="event_"+b,f=a.toString()===a?a:c;return f}var d=b.arrayIndexOf,e=[],f={dom:a,target:a,attachEvent:function(a,b){var d=c(a);e[d]=e[d]||[],e[d].push(b)},removeEvent:function(a,b){var f,g=a&&c(a),h=g&&e[g];if(a&&b){var i=d(h,b);f=e[g].splice(i,1)}else a&&!b?(f=e[g],e[g]=[]):a||b||(f=e,e=[]);return f},getEventList:function(a){var b=c(a),d=a?e[b]:e.slice(0);return d}};return f};b.EventStructure=c}(beacon),function(a){function b(a){var b=new j(a);return h.push(b),b}function c(a,c,d){var e=g(a)||b(a);e.attachEvent(c,d)}function d(a,b,d){var e=b.registEvent(d),f=b.getEventList();i.each(f,function(b){c(a,f[b],e)})}function e(a,b,c){var d=a?g(a)||[]:h;i.each(d,function(a,d){d.removeEvent(b,c)})}function f(a,b,c){var d=b.removeEvent(c);i.each(d,function(c){var f=d[c],g=b.getEventList();i.each(g,function(b,c){e(a,c,f)})})}function g(a){if(!a)return h.slice(0);for(var b=0;b<h.length;b++){var c=h[b];if(c.dom===a)return c}}var h=[],i=a.base,j=i.EventStructure,k={registEvent:c,registCombinationEvent:d,removeEvent:e,removeCombinationEvent:f,getEventList:g};i.eventStore=k}(beacon),function(a){function b(){if(this instanceof b)return this;var a=[],d=[],e=[].slice.call(arguments,0),f=e.slice(0),g=function(){function b(){return f=e.slice(0)}var g=function(b,e){var f=c.arrayIndexOf(a,b);0>f&&(a.push(b),d.push(e))},h=function(b){var e=c.arrayIndexOf(a,b),f=d[e];return b?f:d.slice(0)};this.resetEventList=b,this.getEventList=function(){return e.slice(0)},this.registEvent=function(a){var d=c.arrayIndexOf,f=e.slice(0),h=function(c,e){var g=this,h=d(f,c.eventType);h>=0&&f.splice(h,1),0===f.length&&(a.call(g,e),f=b())};return g(a,h),h},this.removeEvent=function(a){var b=[].concat(h(a));return b}};return g.prototype=new b,new g}var c=a.base;c.combinationalEvent=b}(beacon),function(a){var b=a.base,c=b.eventStore,d=c.registCombinationEvent,e=c.registEvent,f=c.removeCombinationEvent,g=c.removeEvent,h=c.getEventList,i={hostProxy:{},attachEvent:function(a,c){var f=this,g=a instanceof b.combinationalEvent?d:e;g(f,a,c)},fireEvent:function(a,c){var d=this,e=h(d),f=e.getEventList(a);b.each(f,function(b,e){var f={eventType:a};e.call(d,f,c)})},publicDispatchEvent:function(a,c){function d(){b.each(e,function(b){var d=e[b].dom;i.fireEvent.call(d,a,c)})}var e=h(),f=b.isType(a.desc,"Function"),g=f&&a.desc();g==f&&d()},removeEvent:function(a,c){var d=this,e=a instanceof b.combinationalEvent?f:g;e(d,a,c)}},j=function(){var a=function(){};return a.prototype=i,b.blend(a,i),a}();b.Event=j}(beacon),function(a){var b=a.base,c=function(){return this}(),d=b.EventStructure,e={structures:[],getStructure:function(a){for(var b,c=0;c<e.structures.length;c++)if(b=e.structures[c],b.dom===a)return b},add:function(a,b,c){var f=e.getStructure(a);f||(f=new d(a),e.structures.push(f)),f.attachEvent(b,c)},remove:function(a,b,c){var d=e.getStructure(a);return d.removeEvent(b,c)}},f={attachEvent:function(a,b){var d,e=this,g=function(a,b){var c=this;c.addEventListener(a,b,!1)},h=function(a,b){var c=this;c.attachEvent("on"+a,b)},i=function(a,b){var c=this,d=c["on"+a];c["on"+a]=function(){d.call(c),b.call(c)}};return c.addEventListener?(g.call(e,a,b),d=g):c.attachEvent?(h.call(e,a,b),d=h):(i.call(e,a,b),d=i),f.attachEvent=d},fireEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style;var d=document.createEvent("Event");d.initEvent(a,b.bubbles,b.cancelable),c.dispatchEvent(d)},f=function(a,b){var c=this;b=b||{bubbles:!0,cancelable:!0},b.ieHack=c.all&&c.all.toString(),b.ieHack=c.style,a="on"+a;var d=document.createEventObject();d.cancelBubble=b.cancelable,c.fireEvent(a,d)};return document.createEvent&&d.dispatchEvent?(e.call(d,a,b),c=e):document.createEventObject&&d.fireEvent&&(f.call(d,a,b),c=f),c},removeEvent:function(a,b){var c,d=this,e=function(a,b){var c=this;c.removeEventListener(a,b,!1)},g=function(a,b){var c=this;c.detachEvent("on"+a,b)};return d.removeEventListener?(e.call(d,a,b),c=e):d.detachEvent&&(g.call(d,a,b),c=g),f.removeEvent=c}},g={attachEvent:function(a,b){var c=this;e.add(c,a,b),f.attachEvent.call(c,a,b)},fireEvent:function(a,b){var c=this;g.fireEVent=f.fireEvent.call(c,a,b)},removeEvent:function(a,c){var d=this;if(a&&c)f.removeEvent.call(d,a,c);else if(a&&!c){var h=e.remove(d,a);h&&b.each(h,function(){var b=this;g.removeEvent.call(d,a,b)})}else if(!a&&!c){var i=e.remove(d);i&&b.each(i,function(){var a=this;a&&b.each(i[a],function(){var b=this;g.removeEvent.call(d,a,b)})})}},isHTMLElement:function(a){var b=a==document||a==window,c=function(a){var b=a&&a.nodeName;return b&&document.createElement(b).constructor===a.constructor};return b||c(a)},isEventSupported:function(a,b){if(!g.isHTMLElement(a))return!1;var c=!1;if(a===window||a===document){var d=document.createElement("iframe");d.style.display="none",document.body.appendChild(d);var e=a===window?d.contentWindow:d.contentDocument;g.attachEvent.call(e,b,function(){c=!0}),g.fireEvent.call(e,b),d.parentNode.removeChild(d)}else{var f=a.tagName,b="on"+b;a=document.createElement(f),c=b in a,c||(a.setAttribute(b,"return;"),c="function"==typeof a[b]),a=null}return c}};b.DOMEvent=g}(beacon),function(a){var b=a.base,c={on:function(){var b=a.base,c=b.isType,d=b.Event.hostProxy,e=b.Event.publicDispatchEvent,f=b.Event.attachEvent,g=function(a,b){var g=[].slice.call(arguments,0);b&&c(b,"Function")?f.apply(d,g):e.apply(d,g)};return g}(a),once:function(a,b){var d=function(){c.off(a,b)};c.on(a,b),c.on(a,d)},off:function(){var b=a.base,c=b.Event.hostProxy,d=function(){var a=[].slice.call(arguments,0);b.Event.removeEvent.apply(c,a)};return d}(),blend:b.blend,NS:b.NS,arrayIndexOf:b.ArrayIndexOf,isType:b.isType,Enum:b.Enum,loginGlobal:b.login,logoffGlobal:b.logoff,utility:b,createEvent:function(){var a,c=[].slice.call(arguments,0);return a=arguments.length>1?b.combinationalEvent.apply(this,c):{desc:c[0]}}},d={on:function(b,c){var d=[].slice.call(arguments,0),e=this.target,f=a.base,g=f.DOMEvent.isHTMLElement(e),h=f.DOMEvent.isEventSupported(e,b),i=g&&h?f.DOMEvent.fireEvent:f.Event.fireEvent,j=g&&h?f.DOMEvent.attachEvent:f.Event.attachEvent;c&&f.isType(c,"Function")?j.apply(e,d):i.apply(e,d)},once:function(a,b){var c=this;d.on.call(c,a,b),d.on.call(c,a,function(){d.off.call(c,a,b)})},off:function(a,c,d){{var e=this.target,f=b.DOMEvent.isHTMLElement(e),g=a&&b.DOMEvent.isEventSupported(e,a);f&&g?b.DOMEvent.removeEvent:b.Event.removeEvent}b.each(e,function(e,g){f&&b.DOMEvent.removeEvent.call(g,a,c,d),b.Event.removeEvent.call(g,a,c,d)})}};b.blend(b.avatarCore,d),b.blend(a,c),b.init()}(beacon),function(a){function b(a){this.target=a}var c=function(a){return new b(a)};c.toString=function(){return"baishuiz@gmail.com"};var d=document.getElementsByTagName("script"),e=d[d.length-1],f={avatarCore:b.prototype,plugins:{},attach:function(a,b){f.plugins[a]=b},baseURL:e.src.replace(/\/[^\/]+$/,"/"),CDNTimestamp:e.getAttribute("data-CDNTimestamp")||"",isDebug:!1,init:function(b){a.Air=f.plugins.merge(c,b)}},g={base:f};a.Air=g}(this),function(a){var b={NS:function(a,b){for(var c=a.split("."),d=b||window||{},b=d,e=0,f=c.length;f>e;e++)d[c[e]]=d[c[e]]||{},d=d[c[e]];return d},beacon:beacon,merge:beacon.utility.merge,setBaseURL:function(b){return a.base.baseURL=b||a.base.baseURL}};b.merge(a.base.plugins,b)}(Air),function(a){function b(){try{document.documentElement.doScroll("left")}catch(a){return void setTimeout(b,1)}g()}function c(a){return 1==d?void a():void e.push(a)}var d=!1,e=[],f=a.base.plugins.beacon,g=(a.base.plugins,function(){f(document).off("readystatechange",h),f(document).off("DOMContentLoaded",g),f(window).off("load",g);for(var a;a=e.shift();)d||a();d=!0}),h=function(){(/loaded|complete/.test(document.readyState)||1==d)&&g()};f(document).on("readystatechange",h),f(document).on("DOMContentLoaded",g),f(window).on("load",g),document.documentElement.doScroll&&b(),a.base.attach("DOMReady",c)}(Air),function(a,b){function c(a,b){var c=1;this.loadJS=function(){if(/\bArray\b/.test(Object.prototype.toString.call(a))){c=a.length;for(var d=c-1;d>=0;d--)e(a[d],function(){--c||b()})}else e(a,b)}}function d(){function a(){b.currentJs||(b.currentJs=b.shift(),b.currentJs&&b.currentJs.loadJS())}var b=[];b.currentJs=null,this.loadJS=function(d,e){var f=function(){b.currentJs=null,e&&e(),a()};return b.push(new c(d,f)),a(),this}}function e(a,c){var d,e=document.getElementsByTagName("head")[0],f=document.createElement("script"),g=!1,h=b.base.plugins.beacon,i=function(){g=!0,h(f).off("load"),h(f).off("readystatechange"),i=function(){},c&&c()},j=function(){/loaded|complete/.test(f.readyState)&&0==g&&i()};f.async=!0,f.setAttribute("type","text/javascript"),f.src=a,h(f).on("load",i),h(f).on("readystatechange",j),h(f).on("error",i);for(var k=document.getElementsByTagName("script"),l=0,m=k.length;!d&&m>l;l++)d=a==k[l].getAttribute("src");d||e.appendChild(f)}function f(a,b){var c=new d;return c.loadJS(a,b),c}b.base.attach(a,f)}("loadJS",Air),function(a){function b(b,d){"use strict";function e(){var e=i.toLowerCase(),f=h.toLowerCase(),g=a.base,j=g.plugins.beacon,k=g.plugins.NS,l=g.plugins.NS(h.toLowerCase(),g)[e],m=d(g.Require,g.run);l?"function"==typeof m?k(f,g)[e]=g.plugins.merge(m,l):g.plugins.merge(l,m):k(f,g)[e]=m,c[b.toLowerCase()]=!0,j.on(a.base.Require.Event.LOADED,{moduleName:b})}var f=a.base.plugins;f.beacon.on(a.base.Require.Event.REQUIREING,{moduleName:b});var g=b.match(/(^.*)\.(\w*)$/),h=g[1],i=g[2],j=d.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");j=j.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var k=j.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i,function(a,b){return b}).replace(j,""),l=k&&new RegExp("\\b"+k+"\\s*\\(([^\\)]+)\\)","igm"),m=[];l&&j.replace(l,function(b,d){var e=d.replace(/['"]/g,""),f=e.toLowerCase();c[f]||(m[f]=m.push(f)-1),a.base.Require(e)});var n=new String(b);m.length&&beacon(n).on(a.base.Require.Event.LOADED,function(b,c){var d=c.moduleName.toLowerCase();m.hasOwnProperty(d)&&(delete m[d],m.splice(m[d],1)),m.length<=0&&(beacon(n).off(a.base.Require.Event.LOADED),e())}),m.length||e()}var c={};a.base.Module=b}(Air),function(a){function b(a){if(a)return g.moduleLoaded[a];for(var b=0,c=g.requireQueue.length;c>b;b++){var d=g.requireQueue[b];if(!g.moduleLoaded[d])return!1}return!0}function c(){d.on(f.COMPLETE),d(document).on("readystatechange"),c=function(){d.on(f.COMPLETE)}}var d=a.base.plugins.beacon,e=d.createEvent,f={COMPLETE:e("require_complete"),LOADED:e("require_loaded"),REQUIREING:e("require_requireing")},g={requiring:{},required:{},moduleLoaded:{},requireQueue:[]};d(g).on(f.REQUIREING,function(a,b){var c=b.moduleName.toLowerCase();g.requireQueue[c]||g.requireQueue.push(c),g.required[c]=!0});var h=function(d,e){function f(b){var c=b.match(/(^.*)(\.\w*)$/),d=(c[1],c[2],a.base.CDNTimestamp||"");return d=d&&"?"+d,a.base.baseURL+b.replace(/\./gi,"/")+".js"+d}function h(d){i(d)||(g.requiring[d]=!0,a.base.plugins.loadJS(e,function(){if(!g.required[d])throw new Error("module ["+d+"] is undefined! @"+e);b()&&c()}))}function i(a){return g.required[a]||g.requiring[a]||g.moduleLoaded[a]}var j=d;return d=d.toLowerCase(),g.required[d]||g.requiring[d]||g.moduleLoaded[d]?a.base.plugins.NS(d,a.base):(e=e||f(j),d=d.toLowerCase(),g.requireQueue[d]=!0,g.requireQueue.push(d),h(d),a.base.plugins.NS(d,a.base))};d.on(f.LOADED,function(a,d){var e=d.moduleName.toLowerCase();g.required[e]=!0,g.moduleLoaded[e]=!0,b()&&c()}),h.Event=f,h.isRequireComplete=b,a.base.Require=h}(Air),function(a){function b(){for(;function(){var a=c.shift();return a&&a(),c.length}(););}var c=[],d=a.base.plugins.beacon,e=a.base.Require.Event;d.on(e.COMPLETE,b);var f=function(){function f(){for(var b=0;b<h.length;b++){var c=h[b];if(!h[c]&&!a.base.Require.isRequireComplete(c))return!1}return!0}var g,h=[];this.runNow&&d.on(e.LOADED,function(b,c){var d=c.moduleName.toLowerCase();h[d]=!0,a.base.ArrayIndexOf(h,d)>=0&&f()&&g&&g()}),this.run=function(d){g=d,this.runNow?f()&&d():(c.push(d),a.base.Require.isRequireComplete()&&b())},this.require=function(b,c){if(a.base.Require(b,c),b=b.toLowerCase(),h.push(b),!c){var d=b.match(/(^.*)\.(\w*)$/),e=d[1],f=d[2];a.base.plugins.NS(e,a.base)[f]}var g=a.base.plugins.NS(b,a.base);return g}},g=function(a,b){"use strict";var c=g;if(!(this instanceof c))return new c(a,b);var d=this;d.runNow=b,f.call(d);var e=a.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//gim,"");e=e.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g,function(a,b){return b?a:""});var h=e.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i,function(a,b){return b}).replace(e,""),i=h&&new RegExp("\\b"+h+"\\s*\\(([^\\)]+)\\)","igm");i&&e.replace(i,function(a,b){var c=b.replace(/['"]/g,"");d.require(c)}),d.run(function(){a(d.require,d.run)})};a.base.attach("run",g)}(Air),function(a){var b=a.base.plugins,c={run:b.run,iRun:function(a){b.run(a,!0)},loadJS:b.loadJS,Module:a.base.Module,merge:a.base.merge,NS:b.NS,Enum:a.base.Enum,domReady:b.DOMReady,moduleURL:b.setBaseURL,setCDNTimestamp:a.base.setCDNTimestamp};a.base.init(c)}(Air);;Air.Module("core.event", function(){
  var events = {
    DATA_CHANGE : beacon.createEvent("data change"),
    REPEAT_DATA_CHANGE : beacon.createEvent("repeat data change")
  }
  return events;
});
;Air.Module("utility.node", function(){
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
      HTML : 1
  }
  return node;
});
;Air.Module("directive.repeat", function(require){
	var node      = require("utility.node");
  var EVENTS    = require("core.event");

  var directive = "ng-repeat";

  var api = function(target, $scope){
    var mstart = document.createComment("repeat");
    var mend = document.createComment(" end repeat ");

         var needRepeat = node(target).hasAttribute(directive);
         needRepeat && init();
         var cloneNode = needRepeat && clone();
        // needRepeat && parseScope(target.getAttribute(directive));
         var container = needRepeat && document.createDocumentFragment();


         function init(){
           target.parentElement.insertBefore(mstart, target);
           target.parentElement.insertBefore(mend, target);
           mend.parentElement.removeChild(target);
         }

         function bind(cloneNode){
           beacon({target:target, oldNode:cloneNode})
           .on(EVENTS.DATA_CHANGE, function(){
             var node      = require("utility.node");
             var needRepeat = node(this.oldNode).hasAttribute(directive);
             if(!needRepeat) return;
             var node = this.oldNode;
             var target = this.target;
             parseScope(target.getAttribute(directive));
           })
         }


         function repeat ($scope){
             // var newNode = cloneNode.cloneNode(true);
             // container.
         }

         function clone($scope){
           // var container = document.createDocumentFragment();
           var cloneNode = target.cloneNode(true);
            bind(cloneNode);
           return cloneNode;
         }




         function parseScope(condition){
              var container = document.createDocumentFragment();
              var group = condition.replace(/\w+\s+in\s+(\w+)/ig, "$1");
              for(var item in $scope[group]) {
                //repeat(item);
                var newNode = cloneNode.cloneNode(true);
                newNode.removeAttribute(directive);

                //parentElement.remove(a)


                beacon.on('hi', {
                  dom : [newNode],
                  $scope : {book:$scope[group][item]}
                })

                container.appendChild(newNode);

              }


               mend.parentElement.insertBefore(container,mend);

              //generateScopeTree(container, {book:$scope[group][item]})



         }
         return needRepeat;
	}
	return api;
})
;Air.Module("core.scope", function(){
	var Scope = function(parent){
    
	}

	var api = function(parent){
        Scope.prototype = parent || {};
        return new Scope(parent);    
	}
	return api;
});Air.Module("core.scopeList", function(require){
    var scopeList = {};
    return scopeList;
});Air.Module("core.scopeTree", function(require){
  var Scope = require("core.scope");
  var node = require("utility.node");
  var EVENTS    = require("core.event");
  var repeatFilter = require("directive.repeat");
  var nodeType = node.type;

  var key = {
    module : "cjia-module",
      app    : "ng-app",
      controller : "ng-controller"
  }

  function isEmpty(obj) {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }

      return true;
  }

beacon.on("hi", function(e, data){
  generateScopeTree(data.dom , data.$scope)
  beacon.on(EVENTS.REPEAT_DATA_CHANGE);

})

  function generateScopeTree(childNodes , $scope){
      var scopeList = require('core.scopeList');

      //var childNodes = rootDom.childNodes;
      var childCount = childNodes.length;
      for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
           var child = childNodes[childIndex];
           if(child.nodeType == nodeType.TEXT){
              var tag = child.nodeValue;
              beacon({target:child, oldvalue:child.nodeValue})
              .on(EVENTS.DATA_CHANGE, txtNodeDataChange);

              beacon({target:child, oldvalue:child.nodeValue})
              .on(EVENTS.REPEAT_DATA_CHANGE, txtNodeDataChange);

                function txtNodeDataChange(e, data){
                    var textNode = this.target;
                    var text     = this.oldvalue;
                    var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
                    for (var i = markups.length - 1; i >= 0; i--) {
                        var markup   = markups[i];
                        var dataPath = markup.replace(/{{|}}/ig,"");
                        // var data = JSON.stringify(Air.NS(dataPath, $scope)).replace(/{}/ig,'')
                        var data = Air.NS(dataPath, $scope);
                        data = isEmpty(data) ? '' : data;
                        text = text.replace(markup, data)


                    };
                    text.replace(/{{.*?}}/ig, '');
                     textNode.nodeValue = text

                }
           } else if (child.nodeType == nodeType.HTML) {

               var needRepeat = node(child).hasAttribute("ng-repeat");
               if(needRepeat) {
                   var newNodes = repeatFilter(child, $scope);
                   for (var i = 0; i < newNodes.length; i++) {
                     var repeadNode = newNodes[i];
                     generateScopeTree(repeatNode.node, repeatNode.$scope);
                   }
               } else {

                     var isController = child.attributes.getNamedItem('ng-controller');
                     if(isController){
                         var controllerName = child.getAttribute(key.controller)
                         $scope = new Scope($scope);
                         scopeList[controllerName] = $scope;
                     }

                     //var repeatFilter = require("directive.repeat");


                     generateScopeTree(child.childNodes, $scope);
               }




           }
      }
  }

return generateScopeTree;

})
;Air.Module("core.run", function(require){
    var EVENTS    = require("core.event");

    var attrKey = {
    	APP : "ng-app"
    }

    var getApps = function(){

    }




    // controller(require, $scope)
    var run = function(controllerName, controller){
    	var scopeList = require("core.scopeList");
        var scope = scopeList[controllerName];
        controller(require, scope);
        beacon.on(EVENTS.DATA_CHANGE);
    }

    return run;
});
;// Air.moduleURL("")
Air.run(function(require){
    var Scope = require("core.scope");
    var node = require("utility.node");
    var generateScopeTree = require("core.scopeTree");
    var EVENTS    = require("core.event");
    var FRAMEWORK_NAME = 'b';

    // 定义module属性名
    var key = {
    	module : "cjia-module",
        app    : "ng-app",
        controller : "ng-controller"
    }


    var nodeType = node.type;





    function getApps(){
        var apps = document.querySelectorAll("[" + key.app + "]");
        return apps;
    }

    // function generateScopeTree(rootDom , $scope){
    //     var scopeList = require('core.scopeList');
    //
    //     var childNodes = rootDom.childNodes;
    //     var childCount = childNodes.length;
    //     for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
    //          var child = childNodes[childIndex];
    //          if(child.nodeType == nodeType.TEXT){
    //             var tag = child.nodeValue;
    //             beacon({target:child, oldvalue:child.nodeValue})
    //             .on(EVENTS.DATA_CHANGE, function(e, data){
    //                 var textNode = this.target;
    //                 var text     = this.oldvalue;
    //                 var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签
    //                 for (var i = markups.length - 1; i >= 0; i--) {
    //                     var markup   = markups[i];
    //                     var dataPath = markup.replace(/{{|}}/ig,"");
    //                     // var data = JSON.stringify(Air.NS(dataPath, $scope)).replace(/{}/ig,'')
    //                     var data = Air.NS(dataPath, $scope);
    //                     data = isEmpty(data) ? '' : data;
    //                     text = text.replace(markup, data)
    //
    //
    //                 };
    //                 text.replace(/{{.*?}}/ig, '');
    //                  textNode.nodeValue = text
    //                 // this.target.nodeValue = "haha";
    //             });
    //          } else if (child.nodeType == nodeType.HTML) {
    //             var isController = child.attributes.getNamedItem('ng-controller');
    //             if(isController){
    //                 var controllerName = child.getAttribute(key.controller)
    //                 $scope = new Scope($scope);
    //                 scopeList[controllerName] = $scope;
    //             }
    //
    //             var repeatFilter = require("directive.repeat");
    //             repeatFilter(child, $scope);
    //
    //             generateScopeTree(child, $scope);
    //          }
    //     }
    // }
    //


    Air.domReady(function(){

        // 获取所有App
        var apps = getApps();

        var scopeList = require('core.scopeList');

        // 遍历App 列表
        for(var appIndex = 0, appCount = apps.length ; appIndex < appCount; appIndex++) {
            var app       = apps[appIndex];
            var appName   = app.getAttribute(key.app);

            // 初始化应用rootScope
            var rootScope = new Scope();
            scopeList[appName] = rootScope;

            // 构建 subScope
            generateScopeTree(app.childNodes, rootScope);

        }

    });

    function main(){
        var api     = {
            run : require('core.run')
        };
        window[FRAMEWORK_NAME] = api;
    }

    main();
});
;