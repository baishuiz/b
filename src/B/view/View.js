Air.Module("B.view.View", function(require){
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');

  function createDomByString(templeteString){
    var div = document.createElement('div');
    div.innerHTML = templeteString;
    return div;
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

  function splitJS(domWrapper){
      var scripts = domWrapper.querySelectorAll('script');
      scripts = [].slice.call(scripts);
      return scripts
  }

  function View(viewName, dom, options){
    options = options || {};
    // TODO 本地模板需要解析script上的{{}}
    if (beacon.isType(dom, 'String')) {
      var domWrapper = createDomByString(dom);
      dom = domWrapper.querySelector('view[name="' + viewName + '"]');
      var scopeList = splitJS(domWrapper);
      var scriptScope = scopeManager.parseScope(viewName + 'script', { childNodes: scopeList });

      beacon(scriptScope).once(EVENTS.DATA_CHANGE, function(){
        loadScript(scopeList, dom, options.initCallback);
      })

      beacon(scriptScope).on(EVENTS.DATA_CHANGE);
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
