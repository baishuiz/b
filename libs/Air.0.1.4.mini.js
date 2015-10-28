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
})(Air);