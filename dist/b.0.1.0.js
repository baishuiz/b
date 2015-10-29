;(function (global) {

    var _beancon = global.beacon;
    
    // beacon 天赋技能：为对象进行能力加持
    function Avatar(obj) {
        this.target = obj;
    }

    // 苗正根红的 beacon， core.init之后吸收影分身正式踏入战场。
    var beacon = function (obj) {
        if(this !== global){
            beacon.blend(this,beacon); // 是使被扩展方法能够通过call 或 apply 进行继承
        }
        return new Avatar(obj);
    };
    
    beacon.toString = function () { return "baishuiz@gmail.com"};

    // beacon 能力之源
    var core = {
        base : preBeacon,
        avatarCore: Avatar.prototype,
        self: preBeacon,
        init: function () {
            var freeze = Object.freeze;
            global.beacon = beacon;
            core.merge(beacon, preBeacon);
            delete global.beacon.base; // 保护内核，杜绝外部访问
            freeze && freeze(beacon); 
        },
        login:function(){
            global.beacon = beacon;
        },
        logoff:function(){
            global.beacon = _beancon;
        }
    };
    
    
    var preBeacon = {base:core}; // 创建影分身
    global.beacon = preBeacon; // 影分身修行开始， 开始各种能力加持，稍后将在 core.init 后被 beacon 吸收。
    
})(this);;
;(function (beacon) {
    var base = beacon.base || {};
    var _base = {
        /**
        * @name beacon.base.merge
        * @class [merge 将其他对象赋到mainObj上]
        * @param  {Object} mainObj [merge对象到mainObj上]
        * @param  {Object} p1,p2,p3... [支持一次merge多个对象，从第二个参数开始]
        * @return {Object}         [返回merge之后的对象]
        * @example 
        * NEG.base.merge({x:1,y:1},{z:1},{a:1})
        * 结果：返回 {x:1,y:1,z:1,a:1}
        */
        merge: function (mainObj) {
            var argLength = arguments.length ;
            for (var index = 0; index < argLength; index++) {
                var sourceObj = arguments[index];
                for (var item in sourceObj) {
                    mainObj[item] = sourceObj[item];
                }
            }
            return mainObj;
        },
        
        
        // options : --cover , --mergePrototype
        blend : function(mainObj,attrSource,options) {
            var _options = {
                cover:true,
                mergePrototype:false
            };
            options = options ? _base.merge(_options,options): _options;
            attrSource = [].concat(attrSource);
            var sourceLength = attrSource.length ;
            for (var index = 0; index < sourceLength; index++) {
                var sourceObj = attrSource[index];
                for (var item in sourceObj) {
                    var rule1 = options.mergePrototype || sourceObj.hasOwnProperty(item);
                    var rule2 = options.cover || !mainObj[item];
                    if(rule1 && rule2) {
                         mainObj[item] = sourceObj[item];
                    } 
                }
            }
            return mainObj;            
            
        },
        
        
        
        
       isType : function(obj,type){
            //return Object.toString.call(obj).indexOf('[object ' + type) == 0 || !!(obj instanceof Number);
            return (type === "Null" && obj === null) ||
                (type === "Undefined" && obj === void 0 ) ||
                (type === "Number" && isFinite(obj)) ||
                 Object.prototype.toString.call(obj).slice(8,-1) === type;
        },        
        
        
        
        
        
        /**
        * @name beacon.base.ArrayIndexOf
        * @class [返回对象存在数组的index,不存在返回-1]
        * @param {Array} array [操作的数组]
        * @param {Object} el [查找的对象]
        * @returns {number} [返回对象存在数组的Index,不存在返回-1]
        * @example
        * beacon.base.ArrayIndexOf([1,2,3,5],3);
        * 结果：返回 2
        */
        //ToDO：改为两分法快速查找
        arrayIndexOf: function(array, el) {
            _base.arrayIndexOf = Array.prototype.indexOf ? 
                        function(array, el){
                            array = [].slice.call(array,0);
                            return array.indexOf(el);
                        } :
                        function(array, el){
                            array = [].slice.call(array,0);
                            for (var i = array.length; i>=0; i-- ) {
                                if (array[i] === el) {
                                    return i;
                                }
                            }
                            return i;
                        };
            return _base.arrayIndexOf(array, el);
        },
         

       
       
       //ToDO： 增加一个可选参数进行深度each
       each : function(array,fn){
            if(!array) return;
            array = [].concat(array);
            for (var i = array.length - 1; i >= 0; i--) {
                fn.call(array[i],i,array[i]);
            }
        }
    };
    _base.blend(base, _base);
})(beacon);;/*
 * @module  EventStructure
 * MIT Licensed
 * @author  baishuiz@gmail.com
 */
;(function (beacon) {
    var base = beacon.base;

    var EventStructure  = function(target) {
       var arrayIndexOf = base.arrayIndexOf;
       var events = [];
       
       function getEventName(event){
            var eventIndex = arrayIndexOf(events, event);
            if(eventIndex < 0){
                eventIndex = events.push(event)-1;
            }
            var eventAlias = "event_" + eventIndex;
            var eventName = (event.toString() === event) ? event : eventAlias;
            return eventName;
       }
       
       var api = {
           dom : target,
           target : target
          ,attachEvent : function (event, eventHandle) {
              var eventName = getEventName(event);
              events[eventName] = events[eventName] || [];
              events[eventName].push(eventHandle);
          }
          
         ,removeEvent : function (event, eventHandle) {
              var result;
              var eventName = event && getEventName(event);
              var eventHandles = eventName && events[eventName];
              // if(!eventHandles){return}
              if(event && eventHandle) {
                  var handleIndex = arrayIndexOf(eventHandles, eventHandle);
                  result = events[eventName].splice(handleIndex, 1);
              } else if(event && !eventHandle) {
                  result = events[eventName];
                  events[eventName] = [];
              } else if(!event && !eventHandle) {
                  result = events;
                  events = [];
              }
              return result;
          }
          
         ,getEventList : function(event){
             var eventName = getEventName(event);
             var result = event ? events[eventName] : events.slice(0);
             return result;
         }
       }
       return api
    }

    base.EventStructure = EventStructure;
}) (beacon);;/*
 * @module  EventStore
 * MIT Licensed
 * @author  baishuiz@gmail.com
 */
;(function (beacon) {
    var eventList = [];
    var base = beacon.base;
    var EventStructure = base.EventStructure;
    
    function createEventStructure(target) {
        var structure = new EventStructure(target);
        eventList.push(structure);
        return structure;
    }
    
    function registEvent(target, eventName, eventHandle) {
        var activeStructure = getEventList(target) || createEventStructure(target);
        activeStructure.attachEvent(eventName, eventHandle);
    }

    function registCombinationEvent(target, event, eventHandle){
        var handleProxy = event.registEvent(eventHandle);
        var eventList = event.getEventList();
        base.each(eventList, function(index){
            registEvent(target, eventList[index], handleProxy);
        });
    }
    
    function removeEvent(target, eventName, eventHandle) {
        var structureList = target ? (getEventList(target) || []) : eventList;
        base.each(structureList, function(index, activeStructure) {
            activeStructure.removeEvent(eventName, eventHandle);     
        });
    }
    
    function removeCombinationEvent(target, event, eventHandle) {
        var handleProxyList = event.removeEvent(eventHandle);
        base.each(handleProxyList, function(i){
            var handleProxy = handleProxyList[i];
            var eventList = event.getEventList();
            base.each(eventList, function(index, eventName) {
                removeEvent(target, eventName, handleProxy);    
            });
        });    
    }
    
    function getEventList(target) {
        if(!target){
            return eventList.slice(0);
        }
        for(var i=0; i<eventList.length; i++) {
            var activeEventList = eventList[i];
            if(activeEventList.dom === target ) {
                return  activeEventList;        
            }
        }
    }
    
    var api = {
        registEvent : registEvent,
        registCombinationEvent : registCombinationEvent,
        removeEvent : removeEvent,
        removeCombinationEvent : removeCombinationEvent,
        getEventList : getEventList
    };
    base.eventStore = api;
}) (beacon);;;(function(beacon){
    var base = beacon.base;
    function CombinationalEvent(){
        
        if(this instanceof CombinationalEvent) {
            return this;
        }
        
        var handleList = [];
        var handleProxyList = [];
        var originalEvents = [].slice.call(arguments, 0);
        var events = originalEvents.slice(0);
        
        var Fn = function() {
            function  resetEventList(){
                events = originalEvents.slice(0);
                return events;
            }
            
            var attachHandleProxy = function(handle, handleProxy){
                var index = base.arrayIndexOf(handleList,handle)
                if(index < 0){
                    handleList.push(handle);
                    handleProxyList.push(handleProxy);
                }
            };
            
            var getHandleProxy = function(handle) {
                var index = base.arrayIndexOf(handleList,handle);
                var handleProxy = handleProxyList[index];
                return handle ? handleProxy : handleProxyList.slice(0) ;
            }
            
            this.resetEventList = resetEventList;
            this.getEventList = function(){
                return originalEvents.slice(0);
            };
            
            
            this.registEvent = function (eventHandle){
                
                var indexOf = base.arrayIndexOf;
                var events = originalEvents.slice(0);
                var handleProxy = function(eventObject, eventBody){
                    var target = this;
                    var eventIndex = indexOf(events,eventObject.eventType);
                    if (eventIndex >= 0) {
                        events.splice(eventIndex, 1);
                    }
                
                    if (events.length === 0) {
                        eventHandle.call(target, eventBody);
                        events = resetEventList();
                    }
                };
                attachHandleProxy(eventHandle, handleProxy);
                return handleProxy;
            };
            
            
            this.removeEvent = function(eventHandle) {
                var handleProxy = [].concat(getHandleProxy(eventHandle));
                return handleProxy;
            }            
        }
        
        Fn.prototype = new CombinationalEvent();
        return new Fn();
    }
    
    base.combinationalEvent = CombinationalEvent;
})(beacon);;/*
 * @module  EventDispatcher
 * MIT Licensed
 * @author  baishuiz@gmail.com
 */
;(function (beacon) {
    var base        = beacon.base,
        eventStore  = base.eventStore;

    var registCombinationEvent = eventStore.registCombinationEvent,
        registEvent            = eventStore.registEvent,
        removeCombinationEvent = eventStore.removeCombinationEvent,
        removeEvent            = eventStore.removeEvent,
        getEventList           = eventStore.getEventList;

    var event = {
       hostProxy : {}

       ,attachActionEvent : function(eventName, target, eventHandle) {
            var actionEvent = eventName.desc;
            var isActionEvent = base.isType(eventName.desc, 'Function');
            isActionEvent && actionEvent(target, eventHandle);
            var eventList = ['touchmove', 'mousemove'];

            base.each(eventList,function(i, activeEvent){
              isActionEvent && window.beacon(document).on(activeEvent, function(e){
                event.publicDispatchEvent(eventName, e);
              });
            })

       }

       ,attachEvent : function(eventName, eventHandle) {
            var target   = this;
            var regEvent = (eventName instanceof base.combinationalEvent)
                           ? registCombinationEvent
                           : registEvent;

            event.attachActionEvent(eventName, target, eventHandle);
            regEvent(target, eventName, eventHandle);
        }

       ,fireEvent : function(eventName, eventBody){
            var target        = this;
            var eventList     = getEventList(target);
if(!eventList) {
	return
}

            var eventHandles  = eventList.getEventList(eventName);
            var isActionEvent = base.isType(eventName.desc, 'Function');
            var actioniResult = isActionEvent && eventName.desc(eventBody);

            (!!actioniResult == !!isActionEvent) &&
            base.each(eventHandles, function(index, activeEventHandle){
                var eventObject = {
                    eventType:eventName
                };
                activeEventHandle.call(target, eventObject, eventBody);
            });
        }

       ,publicDispatchEvent : function(eventName, eventBody){
            var targetList    = getEventList();
            var isActionEvent = base.isType(eventName.desc, 'Function');
            var actioniResult = isActionEvent && eventName.desc(eventBody);

            base.each(targetList, function(i){
                var activeTarget = targetList[i].dom;
                event.fireEvent.call(activeTarget, eventName, eventBody);
            });

       }


       ,removeEvent: function(eventName,eventHandle){
            var target = this;
            var removeFnProxy = (eventName instanceof base.combinationalEvent)
                                ?  removeCombinationEvent
                                :  removeEvent;
            removeFnProxy(target, eventName, eventHandle);
       }
    };


    var Event = (function(){
            var Event = function(){};
            Event.prototype = event;
            base.blend(Event, event);
            return Event;
    }());

    base.Event = Event;
}) (beacon);
;/*
 * @module  DOMEvent
 * MIT Licensed
 * @author  baishuiz@gmail.com
 */
;(function (beacon) {
    var base = beacon.base;
    var host = (function(){return this}());
    
    var EventStructure  = base.EventStructure;

    var eventMap = {
        structures : []
       ,getStructure : function(dom) {
           var activeStructure;
           for(var i = 0; i < eventMap.structures.length; i++) {
               activeStructure = eventMap.structures[i];
               if (activeStructure.dom === dom) {
                   return activeStructure;
               }
           }
       }
       
       ,add : function (dom, eventName, eventHandle) {
           var activeStructure = eventMap.getStructure(dom);
           if(!activeStructure) {
             activeStructure = new EventStructure(dom);
             eventMap.structures.push(activeStructure);
           } 
           activeStructure.attachEvent(eventName, eventHandle);
           
       }
       
      ,remove : function (dom, eventName, eventHandle) {
          var activeStructure = eventMap.getStructure(dom);
          return activeStructure.removeEvent(eventName, eventHandle);
      }
    }
    
    
    var help = {
        attachEvent : function (eventName, eventHandle) {
            var dom = this;
            
            var addEventListener = function (eventName, eventHandle) {
                var dom = this;
                dom.addEventListener(eventName, eventHandle, false);
            };
            
            var attachEvent = function(eventName, eventHandle){
                var dom = this;
                dom.attachEvent("on" + eventName, eventHandle);
            };
            
            var otherFn = function(eventName, eventHandle) {
                var dom = this;
                var oldHandle = dom["on" + eventName];
                dom["on" + eventName] = function() {
                    oldHandle.call(dom);
                    eventHandle.call(dom);
                };
            };
            
            var proxy;
            if (host.addEventListener) {
                addEventListener.call(dom, eventName, eventHandle);
                proxy = addEventListener;
            } else if (host.attachEvent) {
                attachEvent.call(dom, eventName, eventHandle);
                proxy = attachEvent;
            }else {
                otherFn.call(dom, eventName, eventHandle);
                proxy = otherFn;
            }
            return help.attachEvent = proxy;
        }
       
       ,fireEvent   : function (eventType, option) {
            var dom = this;
            var dispatchEvent = function(eventType, option) {
                    var dom = this;
                    option = option || {bubbles:true,cancelable:true};
                    option.ieHack = dom.all && dom.all.toString(); // 规避 IE 异常，当 dom 不在DOM树时，IE9下 fireEVent会抛出异常；此处采用赋值操作以避免js压缩时清除冗余语句；
                    option.ieHack = dom.style; // 规避 IE 异常，当 dom 不在DOM树时，IE9下 fireEVent 不会触发事件；此处采用赋值操作以避免js压缩时清除冗余语句；
                
                    var evt = document.createEvent("Event");
                    evt.initEvent(eventType, option.bubbles, option.cancelable);
                    dom.dispatchEvent(evt);
           };
           
           var fireEvent = function (eventType, option) {
                var dom = this;
                option = option || {bubbles:true, cancelable:true};
                option.ieHack = dom.all && dom.all.toString(); // 规避 IE 异常，当 dom 不在DOM树时，IE7下 fireEVent会抛出异常；此处采用赋值操作以避免js压缩时清除冗余语句；
                option.ieHack = dom.style; // 规避 IE 异常，当 dom 不在DOM树时，IE8下 fireEVent 不会触发事件；此处采用赋值操作以避免js压缩时清除冗余语句；
                
                eventType = 'on' + eventType;
                var evt = document.createEventObject();
                evt.cancelBubble = option.cancelable;
                dom.fireEvent(eventType, evt);
           };
           
            var proxy;
            if (document.createEvent && dom.dispatchEvent) {
                dispatchEvent.call(dom, eventType, option);
                proxy = dispatchEvent;
            } else if (document.createEventObject && dom.fireEvent) {
                fireEvent.call(dom, eventType, option);
                proxy = fireEvent;
            }
            return proxy;
       }
        
       ,removeEvent : function (eventType, eventHandle) {
            var dom = this;
            var removeEventListener = function(eventType, eventHandle) {
                    var dom = this;
                    dom.removeEventListener(eventType, eventHandle, false);
           };
           
           var detachEvent = function (eventType, eventHandle) {
                var dom = this;
                dom.detachEvent('on' + eventType, eventHandle);
           };
           
            var proxy;
            if (dom.removeEventListener) {
                removeEventListener.call(dom, eventType, eventHandle);
                proxy = removeEventListener;
            } else if (dom.detachEvent) {
                detachEvent.call(dom, eventType, eventHandle);
                proxy = detachEvent;
            }
            return help.removeEvent = proxy;           
       }   
    };
    
    var event = {
        attachEvent : function(eventName, eventHandle){
            var dom = this;
            eventMap.add(dom, eventName, eventHandle);
            help.attachEvent.call(dom, eventName, eventHandle);
        }
       
       ,fireEvent : function(eventType, option) {
            var dom = this;
            event.fireEVent = help.fireEvent.call(dom, eventType, option);
       }
       
      ,removeEvent : function(eventType, eventHandle) {
          var dom = this;
          if(eventType && eventHandle) {
              help.removeEvent.call(dom, eventType, eventHandle);
          } else if (eventType && !eventHandle) {
              var eventHandles = eventMap.remove(dom, eventType) 
              eventHandles && base.each(eventHandles, function(){
                 var activeHandle = this;
                 event.removeEvent.call(dom, eventType, activeHandle);
              });
          } else if (!eventType && !eventHandle) {
              var eventTypes = eventMap.remove(dom) 
              eventTypes && base.each(eventTypes, function(){
                  var activeEventType = this;
                  activeEventType && base.each(eventTypes[activeEventType], function(){
                      var activeEventHandle = this;  
                      event.removeEvent.call(dom, activeEventType, activeEventHandle);
                  });
                  
              });              
          }     
      }
       
      ,isHTMLElement : function (obj) {
            var _isHTMLElement = obj==document || obj == window;
            var testNodeName = function(target){
                var nodeName = target && target.nodeName;
                
                return nodeName && 
                    document.createElement(nodeName).constructor === target.constructor
            };
            return _isHTMLElement || testNodeName(obj);
        }
        
       ,isEventSupported : function(dom, eventType){
            if(!event.isHTMLElement(dom) || !base.isType(eventType, 'String')){ return false}
        	
            var isSupported = false;
            if(dom === window || dom === document) {
                isSupported = "on"+eventType in dom;
                 var isIE = !!window.ActiveXObject;
                 var isIE8 = isIE && !!document.documentMode; 
                if(!isSupported && isIE8){
                    return false
                } else if(isSupported) {
                  return true
                }
                var ifm = document.createElement('iframe');
                ifm.style.display='none';
                document.body.appendChild(ifm);
                
                var dummyElement = dom === window ? 
                                     ifm.contentWindow : 
                                     ifm.contentDocument;
                event.attachEvent.call(dummyElement, eventType, function(){
                    isSupported = true;
                });
                event.fireEvent.call(dummyElement, eventType);
                ifm.parentNode.removeChild(ifm)
            } else {
            
            	var elementName = dom.tagName;
            	var eventType = 'on' + eventType;
            	dom = document.createElement(elementName);
            	
            	isSupported  = (eventType in dom);
            	
                if ( !isSupported ) {
                    dom.setAttribute(eventType, "return;");
                    isSupported = typeof dom[eventType] === "function";
                }
                dom = null;
            }
        
            return isSupported;
       }

    };

    base.DOMEvent = event;
}) (beacon);;;(function (beacon) {
    var base = beacon.base;
    var openAPI = {

        /**
        * @name beacon.on
        * @class [全局事件监听及广播]
        * @param {Object} eventName   [事件名]
        * @param {*} option [事件句柄 或 事件处理参数]
        */
        on : (function(){

                var base = beacon.base;
                var isType = base.isType;
                var hostProxy = base.Event.hostProxy;
                var publicDispatchEvent = base.Event.publicDispatchEvent;
                var addEventListener = base.Event.attachEvent;

                var _on = function(eventName, option){
                    var args = [].slice.call(arguments, 0);
                    if (option && isType(option, 'Function')) {
                        //args.unshift(hostProxy);
                        addEventListener.apply(hostProxy, args);
                    } else {
                        publicDispatchEvent.apply(hostProxy, args);
                    }
                };
                return _on;
        }(beacon))

        , once : function(eventName, eventHandle){
            var handleProxy = function(){
                 openAPI.off(eventName, eventHandle);
            }
            openAPI.on(eventName, eventHandle);
            openAPI.on(eventName, handleProxy);
        }

        , off : (function(){
            var base = beacon.base;
            var hostProxy = base.Event.hostProxy;
            var _off = function(eventName, eventHandle){
                    var args = [].slice.call(arguments,0);
                    base.Event.removeEvent.apply(hostProxy,args);

                };
                return _off;
        }())

        , blend:base.blend
        , NS : base.NS
        , arrayIndexOf : base.ArrayIndexOf
        , isType : base.isType

        , Enum : base.Enum
        ,loginGlobal  : base.login
        ,logoffGlobal : base.logoff
        ,utility : base
        ,createEvent : function(){
            var args = [].slice.call(arguments,0);
            var event;
            if(arguments.length>1){
                event = base.combinationalEvent.apply(this, args)    ;
            } else {
                event = {desc:args[0]};
            }
            return event;
        }

    },




    avatarAPI = {
       /**
       * @name beacon(target).on
       * @class [具体对象的事件绑定]
       * @param {Object} eventName   [事件名]
       * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
       * @param {Object} option      [配置选项]
       * @example
       * beacon("body").on("load",function(){console.info("i am ready");},{});
       * 结果：在onload时间后 输出 i am ready
       */
       on: function (eventType, option) {
         var args = [].slice.call(arguments,0);
         var target = this.target
            , base = beacon.base

         var isHTMLElement = base.DOMEvent.isHTMLElement(target);
         var isEventSupported = base.DOMEvent.isEventSupported(target, eventType);
         var dispatchEvent = isHTMLElement && isEventSupported ?
                                 base.DOMEvent.fireEvent :
                                 base.Event.fireEvent;

         var addEventListener = isHTMLElement && isEventSupported ?
                                    base.DOMEvent.attachEvent :
                                    base.Event.attachEvent;

         if(option && base.isType(option, 'Function')){
            base.each(target,function(i,target){
                addEventListener.apply(target, args);
            });
         } else {
             base.each(target,function(i,target){
                dispatchEvent.apply(target, args);
            });
         }
       },



       once : function(eventName, eventHandle){
            var targetHost = this;
            avatarAPI.on.call(targetHost, eventName, eventHandle);
            avatarAPI.on.call(targetHost,eventName, function(){
                avatarAPI.off.call(targetHost,eventName, eventHandle);
            })
       },


       /**
       * @name beacon(target).off
       * @class [具体对象 事件移除]
       * @param {Object} eventName   [事件名]
       * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
       * @param {Object} option      [配置选项]
       * @example
       * var fn=function(){};
       * beacon("body").off("load",fn,{});
       */
       off: function (eventType, eventHandle, option) {
           //if(arguments.length<=0){return}
           var target = this.target;
           var isHTMLElement = base.DOMEvent.isHTMLElement(target);
           var isDomEvent = eventType && base.DOMEvent.isEventSupported(target, eventType);

           var removeEventListener = isHTMLElement && isDomEvent ?
                                         base.DOMEvent.removeEvent :
                                            base.Event.removeEvent;

            base.each(target,function(i,target){
                var isDomEvent = eventType && base.DOMEvent.isEventSupported(target, eventType);
                //removeEventListener.call(target, eventType, eventHandle, option);
                isHTMLElement && base.DOMEvent.removeEvent.call(target, eventType, eventHandle, option);
                isDomEvent || base.Event.removeEvent.call(target, eventType, eventHandle, option);
            });
       }
   };
    base.blend(base.avatarCore, avatarAPI);
    base.blend(beacon, openAPI);
    base.init();
})(beacon);


;;(function (global) {
    
    function Avatar(obj) {
        this.target = obj;
    }

    var air = function (obj) {
        return new Avatar(obj);
    };
    
    air.toString    = function () { return "baishuiz@gmail.com"};
    var scripts     = document.getElementsByTagName("script")
    var selfElement = scripts[scripts.length-1];

    var core = {
            avatarCore   : Avatar.prototype,
            plugins      : {},
            attach       : function(key, fn){
                               core.plugins[key] = fn;
                           },
            baseURL      : selfElement.src.replace(/\/[^\/]+$/, '/'),
            CDNTimestamp : selfElement.getAttribute('data-CDNTimestamp') || '',
            isDebug      : false,
            init         : function (openAPI) {
               global.Air = core.plugins.merge(air, openAPI);
               //core.isDebug || delete global.Air.base;
           }
    }

    var _air   = {base:core};
    global.Air = _air;
})(this);;;(function (Air) {

    var _base = {
        /**
        * @name NEG.base.NS
        * @class [创建命名空间]
        * @param {String} NSString [要创建的命名空间，以点号隔开(Biz.Common)]
        * @param {Object} root [参数NSString的根节点，(默认是window)]
        * @return {Object} [返回创建的对象，若已存在则直接返回]
        * @example
        * NEG.base.NS("Biz.Common").ConsoleOne=function(){console.log(1);};
        * Biz.Common.ConsoleOne();
        * 结果：输出 1
        */
        NS: function (NSString, root) {
            var nsPath = NSString.split("."), ns = root || window || {}, root = ns;
            for (var i = 0, len = nsPath.length; i < len; i++) {
                ns[nsPath[i]] = ns[nsPath[i]] || {};
                ns = ns[nsPath[i]];
            };
            return ns;
        },

        beacon : beacon,
        merge  : beacon.utility.merge,

        setBaseURL: function(url){
            return Air.base.baseURL = url || Air.base.baseURL;
        }
    };
    _base.merge(Air.base.plugins, _base);
})(Air);;;(function (Air) {
    // 此方法待重构
    var isReady = false;
    var readyHandleQueue = [];
    var beacon = Air.base.plugins.beacon;
    var base   = Air.base.plugins;
    var readyHandle = function () {
        beacon(document).off("readystatechange", ieReadyHandle);
        beacon(document).off("DOMContentLoaded", readyHandle);
        beacon(window).off("load", readyHandle);


        //readyHandle = function () { };
        
        //fn();
        var acctiveHandle;
        while (acctiveHandle = readyHandleQueue.shift()) {
            isReady || acctiveHandle();
        }
        isReady = true;
    }

    var ieReadyHandle = function () {
        if (/loaded|complete/.test(document.readyState) || isReady == true) {
            readyHandle();
        }
    };
    beacon(document).on("readystatechange", ieReadyHandle);
    beacon(document).on("DOMContentLoaded", readyHandle);
    beacon(window).on("load", readyHandle);
    document.documentElement.doScroll && checkDoScroll();

    function checkDoScroll() {
        try {
            document.documentElement.doScroll("left");
        } catch (err) {
            setTimeout(checkDoScroll, 1);
            return
        }
        readyHandle();
    }

    function _domReady(fn) {
        if (isReady == true) {
            fn();
            return
        }
        readyHandleQueue.push(fn);

    }


    Air.base.attach("DOMReady",  _domReady);
})(Air);;;(function (moduleName, Air) {
    
    function Loader(jsURL, completeHandle){
        var jscount = 1;
        this.loadJS = function(){
            if(/\bArray\b/.test(Object.prototype.toString.call(jsURL))){
                jscount = jsURL.length;
                for (var i = jscount - 1; i >= 0; i--) {
                    _loadJs(jsURL[i], function(){
                        --jscount || completeHandle();
                    });
                };
            }else{
                _loadJs(jsURL, completeHandle);
            }
        };
    }

    function JSLoader(){
        var jsQueue = [];
        jsQueue.currentJs = null;

        this.loadJS = function(jsURL, completeHandle){
            var fixHandle = function(){
                jsQueue.currentJs = null;
                completeHandle && completeHandle();
                startLoad();
            };                
            jsQueue.push(new Loader(jsURL, fixHandle));
            startLoad();            
            return this;
        };

        function startLoad(){
            if(!jsQueue.currentJs){
                jsQueue.currentJs = jsQueue.shift();
                jsQueue.currentJs && jsQueue.currentJs.loadJS();
            }        
        }        

    }


    function _loadJs(jsURL, completeHandle) {
        var head = document.getElementsByTagName('head')[0]
           , jsLoader = document.createElement('script')
           , isComplate = false
           , beacon = Air.base.plugins.beacon
           , isExisted
           , loadCompleteHandle = function () {
               isComplate = true;
               beacon(jsLoader).off('load');
               beacon(jsLoader).off('readystatechange');
               loadCompleteHandle = function () { };
               completeHandle && completeHandle();
           }
           , readyHandle = function () {
               if (/loaded|complete/.test(jsLoader.readyState) && isComplate == false) {                 
                    loadCompleteHandle();                 
               }
           };
        jsLoader.async = true;
        jsLoader.setAttribute("type", "text/javascript");
        jsLoader.src = jsURL;
        beacon(jsLoader).on('load', loadCompleteHandle);
        beacon(jsLoader).on('readystatechange', readyHandle);
        beacon(jsLoader).on('error', loadCompleteHandle);


        //var jsList = [].slice.call(document.getElementsByTagName("script"));
        var jsList = document.getElementsByTagName("script");
        for (var i = 0, len = jsList.length; !isExisted && i < len; i++) {
            isExisted = jsURL == jsList[i].getAttribute("src");
        };

        isExisted || head.appendChild(jsLoader);
    };

    function loadJs(jsURL, completeHandle){
        var jsLoader = new JSLoader();
        jsLoader.loadJS(jsURL, completeHandle);
        return jsLoader;
    }



    /**
    * @name Air.base.BOM.LoadJS
    * @class [JS 加载器]
    * @name Air.Loader
    * @param {String} jsURL [js地址（暂时只支持绝对地址）]
    * @param {Function} completeHandle [回调函数]
    */
    Air.base.attach(moduleName, loadJs);
})("loadJS", Air);;;(function(Air) {
    /**
    * @name Air.Module
    * @class [Air 模块构造器]
    * @param {String} nsString [模块命名空间]
    * @param {Function} module [模块逻辑代码]
    */
    var loaded = {}
    function _module(nsString,module) {
        "use strict"
        var _base = Air.base.plugins;
        //发布消息：模块开始构造，但未构造完成
        _base.beacon.on(Air.base.Require.Event.REQUIREING, { moduleName: nsString });

        //获得模块文件相对路径及文件名
        var ns = nsString.match(/(^.*)\.(\w*)$/);
        var nsPath = ns[1];
        var moduleName = ns[2];



        //remove multi-line comment
        var fnBody = module.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//igm, '');

        //remove single line comment
        fnBody = fnBody.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g, function (str, isString) {
            return isString ? str : ''
        });


        var requireName = fnBody.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i, function(fnbody, reqName){
                              return reqName ;
                            }).replace(fnBody,'');

        var reg = requireName && new RegExp("\\b" + requireName + "\\s*\\(([^\\)]+)\\)","igm");


        var requireQueue = [];
        reg && fnBody.replace(reg, function(requireString,nsPath){
            var dependence = nsPath.replace(/['"]/g, '');
            var idependence = dependence.toLowerCase();
            loaded[idependence] || (requireQueue[idependence] = requireQueue.push(idependence) - 1);
            Air.base.Require(dependence);
        });

        var target = new String(nsString);
        requireQueue.length && beacon(target).on(Air.base.Require.Event.LOADED, function (e,data) {
            var moduleName = data.moduleName.toLowerCase();
            if(requireQueue.hasOwnProperty(moduleName)) {
               delete requireQueue[moduleName];
               requireQueue.splice(requireQueue[moduleName], 1);
            }
            if(requireQueue.length<=0){
              beacon(target).off(Air.base.Require.Event.LOADED);
              action();
            }
        });

        requireQueue.length || action();

        function action(){
            var
                _module      = moduleName.toLowerCase(),
                _nsPath      = nsPath.toLowerCase(),
                _base        = Air.base,
                beacon       = _base.plugins.beacon,
                ns           = _base.plugins.NS,
                activeModule = _base.plugins.NS(nsPath.toLowerCase(),_base)[_module],
                moduleAPI    = module(_base.Require,_base.run)
            ;


            if(activeModule) { //如果当前模块已作为父级节点存在
                if( typeof(moduleAPI) === 'function') {
                    ns(_nsPath,_base)[_module] = _base.plugins.merge(moduleAPI, activeModule);
                } else {
                    _base.plugins.merge(activeModule, moduleAPI);
                }
            } else {
                ns(_nsPath, _base)[_module] = moduleAPI;
            }

            //登记已经构造好的模块，并广播通知
            loaded[nsString.toLowerCase()] = true;
            beacon.on(Air.base.Require.Event.LOADED,{moduleName:nsString});
        }

    }
    Air.base.Module = _module;
})(Air);
;;(function(Air) {
    var beacon = Air.base.plugins.beacon;
    var createEvent = beacon.createEvent;
    //定义事件
    var requireEvent = {
            COMPLETE   : createEvent('require_complete'),
            LOADED     : createEvent('require_loaded'),
            REQUIREING : createEvent('require_requireing')
        };

    //定义队列    
    var queue = {
            requiring    : {} //正在加载的模块
           ,required     : {}  //已加载完毕但未构造的模块
           ,moduleLoaded : {} //加载并构造完毕的模块
           ,requireQueue : []  //模块加载意向清单
        };


    //监听模块加载状态，当模块通过 require 方法以外的其他形式加载时，应通过此事件通知require 记录
    beacon(queue).on(requireEvent.REQUIREING, function (e, data) {
        var moduleName = data.moduleName.toLowerCase();
        queue.requireQueue[moduleName] || queue.requireQueue.push(moduleName);
        queue.required[moduleName] = true;
    });



    //判断预期加载的模块是否已全部构造完毕
    function isRequireComplete(moduleName) {
        var result;
        if (moduleName) {
            return queue.moduleLoaded[moduleName]
        }

        for (var i = 0,len = queue.requireQueue.length; i < len; i++) {
            var module = queue.requireQueue[i];    
            if(!queue.moduleLoaded[module]){    
                return false;
            }
        };
        return true;
    }

     
    function publicDispatchCompleteEvent() { //此方法待重构
        beacon.on(requireEvent.COMPLETE);
        beacon(document).on('readystatechange'); //for 蓝线与红线之间的Air.domReady 
        publicDispatchCompleteEvent = function () {
            beacon.on(requireEvent.COMPLETE);
        }
    }

    /**
    * @name require
    * @class [Air 模块加载器]
    * @param {String} module [模块命名空间]
    * @param {String} url [可选，模块文件路径]
    */
    var require = function(module,url){
        //缓存原始命名空间名
        var _module = module;

        //去除命名空间大小写敏感
        module = module.toLowerCase();

        // 跳过已加载的模块
        if(queue.required[module]  || queue.requiring[module] || queue.moduleLoaded[module]){
            //return true;
            return Air.base.plugins.NS(module,Air.base);
        }   

        //获取模块URL，实参优先级高于模块命名空间解析（此处URL需要区分大小写）
        url = url || parseModule(_module);

        
        module = module.toLowerCase();

        //记录模块加载意向
        queue.requireQueue[module] = true;
        queue.requireQueue.push(module);

        // parse module
        function parseModule(module){
            var ns = module.match(/(^.*)(\.\w*)$/);
            var nsPath = ns[1];
            var moduleName = ns[2];
            var CDNTimestamp = Air.base.CDNTimestamp || '';
            CDNTimestamp = CDNTimestamp && '?' + CDNTimestamp;
            return Air.base.baseURL + module.replace(/\./ig,'/') + '.js' + CDNTimestamp;
        }


        //压入require队列，开始加载URL
        function startLoad(module) {
            if(!isRequire(module)){
                queue.requiring[module] = true;  //注册正在加载的模块
                Air.base.plugins.loadJS(url, function () {
                    // queue.required[module] = true; //注册已加载完毕的模块
                    // 校验模块有效性
                    if (!queue.required[module]) {
                        throw new Error("module [" + module + "] is undefined! @" + url);
                    }
                    
                    isRequireComplete() && publicDispatchCompleteEvent(); //如果所有预期加载的模块都已构造完毕，则广播COMPLETE事件
                });
            }      
        }



        //判断模块是否已经加载过
        // return : ture 为已加载过， false 为尚未加载
        function isRequire(module){
            return queue.required[module] || queue.requiring[module] || queue.moduleLoaded[module];
        }


        
        startLoad(module); //尝试启动加载
        return Air.base.plugins.NS(module,Air.base);
    };


    //监听模块加载状态，当模块加载并构造完毕时出发回调
    beacon.on(requireEvent.LOADED, function (e, data) {
        var moduleName = data.moduleName.toLowerCase();
        queue.required[moduleName] = true;
        queue.moduleLoaded[moduleName] = true;
        isRequireComplete() && publicDispatchCompleteEvent();
    });

    require.Event = requireEvent;
    require.isRequireComplete = isRequireComplete;
    Air.base.Require = require;
})(Air);;;(function (Air) {
    var runnerQueue = [];
    var eventer = Air.base.plugins.beacon;
    var requireEvent = Air.base.Require.Event;
    function runnerAction() {
        while (function () {
            var activeRunner = runnerQueue.shift();
            activeRunner && activeRunner();
            return runnerQueue.length;
        }()) { };
    };
    eventer.on(requireEvent.COMPLETE, runnerAction);

    var _run = function () {
        var requireOfRun = [];
        var runBody;
        function isRequireComplete() {
            for (var i = 0; i < requireOfRun.length; i++) {
                var moduleName = requireOfRun[i];
                if (!requireOfRun[moduleName] && !Air.base.Require.isRequireComplete(moduleName)) {
                    return false;
                }
            }
            return true;
        }

        //监听模块加载状态，当模块加载并构造完毕时出发回调
        this.runNow && eventer.on(requireEvent.LOADED, function (e, data) {
            var moduleName = data.moduleName.toLowerCase();
            requireOfRun[moduleName] = true;
            Air.base.ArrayIndexOf(requireOfRun, moduleName)>=0 && isRequireComplete() && runBody && runBody();
        });

        this.run = function (runner) {
            runBody = runner;
            

            if (this.runNow) {
                isRequireComplete() && runner();
            } else {
                runnerQueue.push(runner);
                Air.base.Require.isRequireComplete() && runnerAction();
            }
        };

        this.require = function (module,url) {
            Air.base.Require(module,url);

            module = module.toLowerCase();
            requireOfRun.push(module);
            if(!url){
                var ns = module.match(/(^.*)\.(\w*)$/);
                var nsPath = ns[1];
                var moduleName = ns[2];
                Air.base.plugins.NS(nsPath,Air.base)[moduleName];
            }

            
            var moduleBody = Air.base.plugins.NS(module,Air.base);
            return  moduleBody;
        };
     

    }

    var run = function (fn, runNow) {
        "use strict"
        var me = run;
        if (!(this instanceof me)) {
            return new me(fn, runNow, arguments);
        }
        
        var params = [].slice.call(arguments[2]).slice(2);
        var context = this;
        context.runNow = runNow;
        _run.call(context);

        //remove multi-line comment
        var fnBody = fn.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//igm, '');

        //remove single line comment
        fnBody = fnBody.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g, function (str, isString) {
            return isString ? str : ''
        });

        var requireName = fnBody.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i, function(fnbody, reqName){
                              return reqName ;
                            }).replace(fnBody,'');
        var reg = requireName && new RegExp("\\b" + requireName + "\\s*\\(([^\\)]+)\\)","igm");
        var requireQueue = [];
        reg && fnBody.replace(reg, function(requireString,nsPath){
            var moduleName = nsPath.replace(/['"]/g, '');
            context.require(moduleName);
        });

        
        context.run(function(){
            //fn(context.require, context.run);
            var _params = [context.require].concat(params);
            fn.apply(this, _params);
        });
        
    };

    /**
    * @name Air.base.run
    * @class [Air的沙箱环境]
    * @param  {Fcuntion} fn [函数句柄]
    * @example 
    */
    Air.base.attach("run", run);
})(Air);;;(function (Air) {
    var base = Air.base.plugins;
    var openAPI = {
          run: base.run
        , iRun: function (fn) { base.run(fn,true) }
        , loadJS: base.loadJS
        , Module:Air.base.Module
        , merge:Air.base.merge
        , NS : base.NS
        , Enum : Air.base.Enum
        , domReady: base.DOMReady
        , moduleURL: base.setBaseURL
        , setCDNTimestamp: Air.base.setCDNTimestamp
    };
    //Air.base.merge(Air.base.avatarCore, avatarAPI);
    //base.merge(base, openAPI);
    //beacon.logoff();
    Air.base.init(openAPI);
})(Air);;Air.Module("core.directive", function(){
  var directive = {
        //module     : "cjia-module",
        app        : "ng-app",
        controller : "ng-controller"
  };
  var api = {
    signup : function(key, value){
      if(directive[key]) {
        return directive[key];
      } else {
        directive[key] = value;
        return directive[key]
      }
    },

    key : directive
  }
  return api;
})
;Air.Module("core.event", function(){
  var events = {
    DATA_CHANGE        : beacon.createEvent("data change"),
    REPEAT_DATA_CHANGE : beacon.createEvent("repeat data change"),
    REPEAT_DONE        : beacon.createEvent("repeat done"),
    URL_CHANGE         : beacon.createEvent("url change")
    
  }
  return events;
});
;Air.Module('core.config', function(){
  var configs = {};
  var api = {
    get : function(key){
      return configs[key] ;
    },

    set : function(key, value){
      configs[key] = value;
      return configs[key];
    }
  };
  return api;
});
;Air.Module('core.network.request', function(){

    var state = {
      unInit : 0,
      opend  : 1,
      sended : 2,
      receiving : 3,
      complete : 4
    }

    var events = {
      REQUEST_COMPLETE   : beacon.createEvent("request complete")
    };

    function XHR(){
        var xhr = new XMLHttpRequest();
        var request = this;
        xhr.onreadystatechange = function(){
          if(xhr.readyState === state.complete) {
            if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
                beacon(request).on(events.REQUEST_COMPLETE, {data:xhr.responseText});
            } else {
                beacon(request).on(events.REQUEST_COMPLETE, {err:xhr.status});
            }
          }
        };
        this.xhr = xhr;
    }

     XHR.prototype = {


         request : function(options){
            this.xhr.open(options.method, options.url, true);
            for (var key in options.header){
              this.xhr.setRequestHeader(key, options.header[key]);
            }
            this.xhr.send(options.data);
         },

         get  : function(url,data){
              this.request({
                    method: 'GET',
                    url   : url,
                    data  : data
              });
         }
     }
    XHR.EVENTS  = events
    return XHR;
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
      HTML : 1,
      ATTR : 2
  }
  return node;
});
;Air.Module('utility.query', function(require) {
    var query = {
        getQuerys: function (url) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
            while(match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            return params;
        },
        getQueryString: function (url) {
            var queryObj = query.getQuerys(url);
            var queryString = [];
            for (var key in queryObj) {
                queryString.push(key + '=' + queryObj[key]);
            }
            return queryString.length ? ('?' + queryString.join('&')) : '';
        }
    };

    return query;
});
;Air.Module('utility.util', function(){
  var util = {
    isEmpty :   function (obj) {
          var isObject = beacon.utility.isType(obj, 'Object');
          var isArray = beacon.utility.isType(obj, 'Array');
          if(!isObject && !isArray){
            return false;
          }
          for(var prop in obj) {
              if(obj.hasOwnProperty(prop)){
                return false;
              }
          }
          return true;
      },

    enums : function(keys){
      var result = {};
      for (var i = keys.length - 1; i >= 0; i--) {
        result[keys[i]]=keys[i];
      };
      return result;
    }  
  };
  return util;
});
;Air.Module('core.router', function(require){
  // var routers = [
  //    {
  //       rule: reg,
  //       viewName : "viewName",
  //       sign   : "ABCDEF"
  //    }
  // ]

  var signs = {};
  var routers = [];
  var rules  = {};
  var query = require('utility.query');



  var router = function(rule){
      // routers = crateRouter(rule);
      // for (var rule in rules) {
      //   if (object.hasOwnProperty(rule)) {
      //     createReg(rule);
      //   }
      // }
  };

  router.param = {};
  function parseRouter(rule){
    var paramIndex = 0;
    var params = []
    var regStr = rule.router.replace(/\//ig,"\/")
                 .replace(/:\w+/ig, function(param){
                    // params[param] = paramIndex++;
                    params.push(param.replace(":",""));
                    return "(\\w+)"
                  });
    var reg = new RegExp("^" + regStr + "$","i");

    rule.rule = reg;
    rule.params = params;
    return rule;
  }

  router.set = function(rule){
    routers.push(parseRouter(rule));
    signs[rule.viewName] = rule.sign;
    rules[rule.viewName] = rule.router;
  };

  router.getParams = function(pathname){
    var matchedRouter = router.match(pathname || location.pathname) || {};
    return matchedRouter.params || {};
  }

  router.getQuerys = function (url) {
    return query.getQuerys(url || location.href);
  }

  router.getQueryString = function (url) {
    return query.getQueryString(url || location.href);
  }

  router.getRule = function(viewName){
    return rules[viewName];
  }

  router.getSign = function(viewName){
    return signs[viewName] || '';
  }


  router.match = function(pathName){
    for (var i = 0; i < routers.length; i++) {
      var activeRouter = routers[i];
      var result = pathName.match(activeRouter.rule);
      if(result){
        for (var paramIndex = 1; paramIndex < result.length; paramIndex++) {
          var paramName = activeRouter.params[paramIndex-1];
          activeRouter.params[paramName] = result[paramIndex]
        }
        return activeRouter;
      }
    }


  }
  return router;
})
;Air.Module('direcitve.event', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      EVENTS    = require("core.event");

  directive.signup('event', 'ng-event');
  var reg = /(\((.*?)\))/;
  var api = function(target, $scope){
    if(!node(target).hasAttribute(directive.key.event)){
      return;
    }

    var cmd = target.getAttribute(directive.key.event);

    var cmdList = cmd.split(";")

    for (var i = 0; i < cmdList.length; i++) {
      bind(cmdList[i], i);
    };


    function bind(cmd, eventIndex){
      var eventName = cmd.match(/^\s*(\w+)\s+/)[1];

      beacon(target).on(eventName, function (e){
          //var eventCMD = this.getAttribute(directive.key.event).split(/\s/);
          var cmd = target.getAttribute(directive.key.event);
          var cmdList = cmd.split(";")
          var handleStr = cmdList[eventIndex].replace(eventName,'')
          var eventHandle = handleStr.replace(reg,'').replace(/\s/g,'');
          var eventParam = handleStr.match(reg)[2]
          var params = eval("["+eventParam+"]");
          params.unshift(e);
          this.$index = $scope.$index;
          var scope = $scope.$parentScope || $scope;
          scope.$event[eventHandle].apply(this, params);
          beacon(scope).on(EVENTS.DATA_CHANGE, scope);
      });
    }


  }

  return api;
})
;Air.Module('direcitve.module', function(require){
  var directive = require('core.directive'),
      node      = require('utility.node'),
      util      = require('utility.util'),
      EVENTS    = require("core.event");

  directive.signup('module', 'ng-module');

  var api = function(target, $scope){
      if(!node(target).hasAttribute(directive.key.module)){
        return;
      }
      var dataPath = target.getAttribute(directive.key.module)
                     .replace(/{{|}}/ig,'');
      // target.value = Air.NS(dataPath, $scope);
      beacon(target).on('input', function(){
        var target = this;
        new Function('$scope','target','$scope.' + dataPath + '= target.value')($scope, target)

        beacon($scope).on(EVENTS.DATA_CHANGE, $scope);
        // beacon(target).on(EVENTS.DATA_CHANGE, $scope);
      });

      var eventHandle = (function(target){

      })(target);
      

      beacon($scope).on(EVENTS.DATA_CHANGE, function(e, $scope){
        
        var value = Air.NS(dataPath, $scope);
        target.value = !util.isEmpty(value) ? value : "";
      });
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
    var directive         = require("core.directive"),
        Scope             = require("core.scope");
    var scopeList = {};
    var shadowScopeList = {};


    function getApps(target){
        var apps = target.querySelectorAll("[" + directive.key.app + "]");
        return apps;
    }

    function init(target, generateScopeTree){
    	target = target || document	;
    	var apps      = getApps(target); // 获取所有App
    	// 遍历App 列表
        var appIndex = 0, appCount = apps.length;
        for(; appIndex < appCount; appIndex++) {
            var app         = apps[appIndex],
                appName     = app.getAttribute(directive.key.app)
                rootScope   = new Scope(); // 初始化应用rootScope
                shadowScope = new Scope();

            scopeList[appName] = rootScope;
            shadowScopeList[appName] = shadowScope;
            // generateScopeTree(app.childNodes, rootScope); // 构建 subScope
        }
        
        var appIndex = 0, appCount = apps.length;
        for(; appIndex < appCount; appIndex++) {
            var app         = apps[appIndex],
                appName     = app.getAttribute(directive.key.app)

             generateScopeTree(app.childNodes, scopeList[appName]); // 构建 subScope
        }
    }

    var api = {
    	init : init,
    	get   : function(key){
            return scopeList[key];
    	},

    	set  : function(key, parentScope) {
            var scope = new Scope(parentScope);
    		scopeList[key] = scope;
            scope.__$shadowScope__ = shadowScope;
            //shadowScopeList[key] = shadowScope;


            return scope
    	},

        dirtyCheck : function(dataPath, $scope){
            var value = Air.NS(dataPath, $scope);
            var shadowValue = Air.NS(dataPath, $scope.__$shadowScope__);

            var valueStr       = JSON.stringify(value).replace(/\{\}/g,'""');
            var shadowValueStr = JSON.stringify(shadowValue).replace(/\{\}/g,'""');
            var result = (valueStr === shadowValueStr);
            return !result
        },

        updateShadow : function(scope){
            if(!scope) return;
            var scopeStr = JSON.stringify(scope);
            scope.__$shadowScope__ = JSON.parse(scopeStr);
        }
    }

    return api;
})
;Air.Module("directive.repeat", function(require){
	var node      = require("utility.node"),
      directive = require("core.directive"),
      Scope     = require("core.scope"),
      scopeList = require("core.scopeList"),
      EVENTS    = require("core.event");

  var key       = directive.signup('repeat', 'ng-repeat');
  var  removeEvent = beacon.createEvent("cloneNodeRemove");


  function init(target, $scope){
   var placeholder   = {start : null, end : null};
   placeholder.start = document.createComment("repeat");
   placeholder.end   = document.createComment(" end repeat ");
   cloneNode         = clone(target, $scope);
   container         = document.createDocumentFragment();
   target.parentNode.insertBefore(placeholder.start, target);
   target.parentNode.insertBefore(placeholder.end, target);
   placeholder.end.parentNode.removeChild(target);
   return placeholder;
  }


  function clone(target, $scope){
   var cloneNode = target.cloneNode(true);
   bind(target, $scope);
   return cloneNode;
  }

  function bind(target, $scope){
    var dateChangeHandle = function(){
      var $scope     = this;
      var node       = require("utility.node"), // TODO : remove
         condition  = target.getAttribute(key);
         needRepeat = !!condition,
         group      = condition.replace(/\S+\s+in\s+(\S+)/ig, "$1"),
         dataChange = scopeList.dirtyCheck(group, $scope);

      if((needRepeat && dataChange) || (needRepeat && !target.repeaded)){
       repeat(target, $scope);
      }
    };
    beacon($scope).on(EVENTS.DATA_CHANGE, dateChangeHandle);
  }

  function repeat(target, $scope){
    // remove old clone node
    beacon(target).on(removeEvent, {$scope:$scope});
    parseScope(target, $scope);
    target.repeaded = true;
  }


  function parseScope(target, $scope, placeholder){
      var condition   = target.getAttribute(key),
          needRepeat  = node(target).hasAttribute(key); 
      placeholder = target.placeholder;
      var container   = document.createDocumentFragment();
      var group       = condition.replace(/\S+\s+in\s+(\S+)/ig, "$1");
      var itemName    = condition.match(/(\S+)\s+in\s+(\S+)/i)[1];
      var repeatScope = Air.NS(group, $scope);
      var nodes = [];

      for(var item=0; item< repeatScope.length; item++) {
        var newNode = target.cloneNode(true);

        beacon({target:newNode, scope:$scope}).once(removeEvent, function(e, data){
          if(data.$scope !== this.scope) return;
          this.target.parentNode.removeChild(this.target);
        });

        newNode.removeAttribute(key);
        var activeScope = new Scope($scope);
        activeScope[itemName] = repeatScope[item];
        activeScope.$index = item;
        activeScope.$parentScope = $scope;
        nodes.push({
          node : newNode.childNodes,
          $scope : activeScope
        });
        container.appendChild(newNode);
      }

      placeholder.end.parentNode.insertBefore(container,placeholder.end);
      beacon($scope).on(EVENTS.REPEAT_DONE, nodes)

      return {
            scope : repeatScope,
            nodes : nodes
      };
  }     

  
  var api = function(target, $scope){
      var needRepeat  = node(target).hasAttribute(key); 
          target.placeholder = needRepeat && init(target, $scope);
          parseScope(target, $scope)
  }
	return api;
})
;Air.Module("core.scopeTree", function(require){
  var Scope          = require("core.scope"),
      node           = require("utility.node"),
      util           = require("utility.util"),
      directive      = require("core.directive"),
      EVENTS         = require("core.event"),
      repeatFilter   = require("directive.repeat"),
      eventDirective = require("direcitve.event"),
      initModule     = require("direcitve.module");

  var nodeType = node.type,
      key      = directive.key




function bindRepeatDone($scope){
 beacon($scope).on(EVENTS.REPEAT_DONE, function(e, nodes){

    for (var i = 0; i < nodes.length; i++) {
      var repeatNode = nodes[i];
      generateScopeTree(repeatNode.node, repeatNode.$scope);
      beacon(repeatNode.$scope).on(EVENTS.REPEAT_DATA_CHANGE, repeatNode.$scope);
    }
  }) 
}

  var regMarkup = /{{.*?}}/ig;
  function generateScopeTree(childNodes , $scope){
      var scopeList = require('core.scopeList');

      //var childNodes = rootDom.childNodes;
      var childCount = childNodes.length;
      for(var childIndex = 0; childIndex < childCount; childIndex++ ) {
           var child = childNodes[childIndex];
           if(child.nodeType == nodeType.TEXT || child.nodeType == nodeType.ATTR){
              var tag = child.nodeValue;


              var text = child.nodeValue;
              var txtNodeDataChange = (function(child, template){

                return function(e, $scope){
                  var textNode = child;
                  var text     = template;
                  var markups  = text.match(/{{.*?}}/ig) || []; // TODO : 剔除重复标签

                  for (var i = markups.length - 1; i >= 0; i--) {
                      var markup   = markups[i];
                      var dataPath = markup.replace(/{{|}}/ig,"");
                      var data = Air.NS(dataPath, $scope);
                      data = util.isEmpty(data) ? '' : data;
                      text = text.replace(markup, data);
                  };


                  if( textNode.nodeValue != text){
                     textNode.nodeValue = text
                  }
                }
              })(child, child.nodeValue);

              if(text.match(regMarkup)){
                beacon($scope).on(EVENTS.DATA_CHANGE, txtNodeDataChange);
                beacon($scope).on(EVENTS.REPEAT_DATA_CHANGE, txtNodeDataChange);
              }
           } else if (child.nodeType == nodeType.HTML) {

              // generateScopeTree(child.attributes, $scope);
               var needRepeat = node(child).hasAttribute(key.repeat);
               if(needRepeat) {
                   bindRepeatDone($scope)
                   var  result = repeatFilter(child, $scope);
                   // bindRepeatDone($scope)

               } else {

                     var isController = child.attributes.getNamedItem(key.controller);
                     if(isController){
                         var controllerName = child.getAttribute(key.controller)

                         $scope = scopeList.set(controllerName, $scope);
                     }
                     generateScopeTree(child.attributes, $scope);
                     initModule(child, $scope);
                     eventDirective(child, $scope);
                     generateScopeTree(child.childNodes, $scope);
               }
           }
      }
  }

return generateScopeTree;

})
;Air.Module('core.url', function(require){
	var router = require('core.router');
	var EVENTS = require('core.event');

	//window.onpopstate = function(event) {

	var api = {
		change : function(viewName, options){
			options = options || {};
            var params = options.params || {};
            var query  = options.query || "";
            // detail/:id/:name/:price
            var routerRule = router.getRule(viewName);

            if(routerRule){
		        var urlPath = routerRule.replace(/:(\w+)/ig, function(param, key){
		                      return params[key] || ""
		            });

	            urlPath = urlPath.replace(/\/\/+/g,"/");
	            urlPath = location.origin + urlPath + query;
	            var fromURL  = location.href;
	            var stateObj = {viewName: viewName};
	            if(options.replace==true){
                    history.replaceState(stateObj, "viewName", urlPath);
	            }else{
	                history.pushState(stateObj, "viewName", urlPath);
	            }

	            beacon.on(EVENTS.URL_CHANGE, {
	            	from : fromURL,
	            	to   : urlPath
	            });


			}
		}
	};

	return api;
})
;Air.Module('core.views', function(require){
  var Request = require('core.network.request'),
      router  = require('core.router'),
      scopeList = require('core.scopeList'),
      url       = require('core.url'),
      util      = require('utility.util'),
      generateScopeTree = require("core.scopeTree"),
      config  = require('core.config');
  var api = {
    EVENTS : {
      SHOWED : beacon.createEvent("view showed")
    },
    router : router,
    count:0,
    init : function(urlPath){
      urlPath = urlPath || window.location.pathname;
      var params = util.enums(urlPath.replace(/^\/|\/$/,'').split("/"))
      var query = router.getQueryString();
      var viewport = document.querySelector("viewport[main='true']");
      if (!viewport) {
          viewport = document.createElement("viewport");
          viewport.setAttribute('main', 'true');
          document.body.appendChild(viewport);
      }
      var target = viewport.querySelector("view[active='true']");
      if(!target){
        api.count = 0
        var viewInfo = router.match(urlPath);
        if(viewInfo){
          api.goto(viewInfo.viewName, {
            params:viewInfo.params,
            query:query,
            replace:true
          });
        }
      }
    },
    goto : function(viewName, options){

          options = options || {};
          var target = document.querySelector("viewport[main='true'] view[name='"+ viewName + "']");
          var scrollTop = function () {
            setTimeout(function(){
              window.scrollTo(0, 0);
            }, 0);
          };

          if(target){
            setActive();
          } else {
            var request = new Request();
            beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
              if(data.data){
                // replace resource
                data.data = data.data.replace(/(href|src)=([\"])([^'"]+)\2/ig, function(src){
                    var result = src.replace("{{resourceUrl}}", config.get("resourceUrl") || "");
                    return result
                });

                api.active && api.active.removeAttribute('active');
                var viewport = document.querySelector("viewport[main='true']");
                var view = document.createElement("view");
                view.setAttribute("active", "true");
                view.setAttribute("name", viewName);
                view.innerHTML = data.data;


                viewport.appendChild(view);
                api.count += 1;
                api.active = view;

                // generateScopeTree(view, $scope)
                scopeList.init(view, generateScopeTree);

                // load controller
                var scripts = view.querySelectorAll('script');
                scripts = [].slice.call(scripts);
                for (var scriptIndex = scripts.length - 1; scriptIndex >= 0; scriptIndex--) {
                  var activeScript = scripts[scriptIndex];

                  if (activeScript.src) {
                    Air.loadJS(activeScript.src);
                  } else {
                    var tmpScript = document.createElement('script');
                    tmpScript.text = activeScript.text;
                    document.getElementsByTagName('head')[0].appendChild(tmpScript);
                  }

                  activeScript.parentNode.removeChild(activeScript);
                };
                options.popstate || url.change(viewName, options);
                scrollTop();
                beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
              }
            });

            var sign = router.getSign(viewName);
            sign = sign && "_" + sign;
            request.get(config.get("templatePath") + viewName + sign + ".html");

          }
          //target ? setActive : request.get("http://m.ctrip.com/webapp/hotel/");
          function setActive(){
            api.active && api.active.removeAttribute('active');
            target.setAttribute('active','true');

            api.active = target;
            options.popstate || url.change(viewName, options);
            scrollTop();
            beacon.on(api.EVENTS.SHOWED, {viewName : viewName});
          }
    },
    active : null
  }

  Air.domReady(function(){

      var views = document.querySelectorAll("viewport[main='true'] view");
      api.count = views.length;
      api.active = document.querySelector("viewport[main='true'] view[active='true']");
  });

  return api;
});
;Air.Module('core.service', function(require){
  var Request = require('core.network.request');
  var EVENTS    = require("core.event");
  var config  = require('core.config');

  var serviceConfigs = {

  }

  function getURL(configs){
      var url = configs.protocol + "://" + configs.host + configs.path;
      return url;
  }

  var serviceEvents = {
    COMPLETE : beacon.createEvent("service response complete"),
    SUCCESS : beacon.createEvent("service response success"),
    ERROR : beacon.createEvent("service response error")
  }

  var service = function(configKey){
      var baseConfigs = b.config.get("service");
      var baseCofig = baseConfigs[configKey];


      serviceAPI =  {
        set : function(configs){
              var curServiceEvents = {
                COMPLETE : beacon.createEvent("service response complete"),
                SUCCESS : beacon.createEvent("service response success"),
                ERROR : beacon.createEvent("service response error")
              }

              //serviceConfig[configKey]
              beacon.utility.blend(configs, baseCofig, {cover:false});
              var request = new Request();
              var api = {
                query : function(params, options){
                    options = options || {};
                    var defaultOptions = {
                      preserve : false,  // 保存历史数据
                      scope    : null
                    }
                    beacon.utility.blend(options, defaultOptions, {cover:false});
                    var resultData = {};
                    beacon(request).once(Request.EVENTS.REQUEST_COMPLETE, function(e, data){
                        var paseError = false;
                        try {
                            resultData.data = JSON.parse(data.data);
                        } catch (e) {
                            paseError = true;
                            resultData.data = data.data;
                            resultData.error = 'parse Error';
                            beacon.on(curServiceEvents.ERROR, resultData);
                            beacon.on(serviceEvents.ERROR, resultData);
                        }

                        if (!paseError) {
                          beacon.on(curServiceEvents.SUCCESS, resultData);
                          beacon.on(serviceEvents.SUCCESS, resultData);
                        }

                        beacon.on(curServiceEvents.COMPLETE, resultData);
                        beacon.on(serviceEvents.COMPLETE, resultData);
                        options.scope && beacon.on(EVENTS.DATA_CHANGE, options.scope);
                    });

                    request.request({
                          method: configs.method,
                          url   : getURL(configs),
                          data  : params && JSON.stringify(params) || null,
                          header: {
                            'Content-Type': 'application/json;charset=utf-8'
                          }
                    });
                    return resultData
                },
                on : beacon.on,
                off : beacon.off,
                EVENTS  : curServiceEvents
            }
            return api;
        }
      }
      return serviceAPI;
  };

  service.EVENTS = serviceEvents;
  return service;
})
;Air.Module("core.run", function(require){
    var EVENTS    = require("core.event");
    var service   = require("core.service");
    var scopeList = require("core.scopeList");

    var run = function(controllerName, controller){
        var scopeList = require("core.scopeList");
        var scope = scopeList.get(controllerName);

        beacon.on(service.EVENTS.COMPLETE, function(e, data){
          beacon(scope).on(EVENTS.DATA_CHANGE, scope);
        });

        beacon(scope).on(EVENTS.DATA_CHANGE, function(e, scope){
          scopeList.updateShadow(scope);
        });

    	  // try{  // TODO: 服务依赖需要Try来屏蔽错误
          Air.run(controller, false, scope);
          Air.run(function(){
            scopeList.updateShadow(scope);
            beacon(scope).on(EVENTS.DATA_CHANGE, scope);
            beacon.on("hi", scope); // TODO: 换名
          })

          // })




        // }catch(e){
        //   // console.log(e);
        // }
    }

    return run;
});
;Air.run(function(require){
    var Scope             = require("core.scope"),
        node              = require("utility.node"),
        generateScopeTree = require("core.scopeTree"),
        view              = require('core.views')
        directive         = require("core.directive");

    var EVENTS            = require("core.event"),
        FRAMEWORK_NAME    = 'b';



    Air.domReady(function(){

            var scopeList = require('core.scopeList');
            scopeList.init(document, generateScopeTree);
            beacon(window).on('popstate', function(e){
                b.views.goto(e.state.viewName, {popstate:true});
            })


    });

    void function main(){
        var api = {
            run : require('core.run'),
            views: view,
            config : require('core.config'),
            EVENTS  : require('core.event'),
            Module  : Air.Module,
            service : require('core.service'),
            loadJS : Air.loadJS
        };
        window[FRAMEWORK_NAME] = api;
    }();

});
