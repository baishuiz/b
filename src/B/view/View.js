Air.Module("B.view.View", function(require){
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');

  function createDomByString(templeteString){
    var div = document.createElement('div');
    div.innerHTML = templeteString;
    return div;
  }

  function loadStyle(styleList, dom) {
    for (var i = 0, len = styleList.length, style; i < len; i++) {
      style = styleList[i];
      dom.appendChild(style);
    }
  }

  function loadScript(scopeList, dom, fn) {
    runJS(scopeList, dom);
    fn && fn();
  }

  function runJS(scripts, dom){
    for (var scriptIndex = scripts.length - 1; scriptIndex >= 0; scriptIndex--) {
      var activeScript = scripts[scriptIndex];

      var tmpScript = document.createElement('script');
      if (activeScript.src) {
        tmpScript.src = activeScript.src;
      } else {
        tmpScript.text = activeScript.text;
      }
      dom.appendChild(tmpScript);

      activeScript.parentNode.removeChild(activeScript);
    };
  }

  function splitDom(domWrapper, selector){
      var scripts = domWrapper.querySelectorAll(selector);
      scripts = [].slice.call(scripts);
      return scripts
  }

  function parseTag(tagName, viewName, dom, domWrapper, fn) {
    var domList = splitDom(domWrapper, tagName);
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
    // var dom = null,
    var templete = null,
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
    },

    this.hide = function(){
      dom.removeAttribute('active');
    },

    this.init = function (){},

    this.onInit = function (){},

    this.onShowBefore = function (){},

    this.onShowAfter = function (){},

    this.onHide = function (){},

    this.getTemplete = function (){},

    this.runcontroller = function (){}

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
