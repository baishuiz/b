Air.Module("B.view.View", function(require){
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');

  function createDomByString(templeteString){
    var div = document.createElement('div');
    if(typeof DOMParser === 'undefined'){
      div.innerHTML = 'X<div></div>' + templeteString; // 兼容 IE8
    } else {
      div.innerHTML = templeteString;
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
    runJS(scopeList, dom);
    fn && fn();

  }

  function runJS(scripts, dom){
    for (var scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
      var activeScript = scripts[scriptIndex];
      var tmpScript = document.createElement('script');
      if (activeScript.src) {
        Air.loadJS(activeScript.src);
      } else {
        tmpScript.text = activeScript.text;
        dom.appendChild(tmpScript);
      }
      activeScript.parentNode && activeScript.parentNode.removeChild(activeScript);
    };
  }

  function splitDom(domWrapper, selector){
    //var scripts = domWrapper.querySelectorAll(selector);
    var scripts = domWrapper.getElementsByTagName(selector); // 兼容IE8 自定义tag
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
      if(typeof DOMParser === 'undefined'){
        dom = dom.replace(/<(\/?)\s*(view)[^>]*>/g,"<$1cjia:$2>") // 兼容IE8 自定义tag
      }

      var domWrapper = createDomByString(dom);
      //dom = domWrapper.querySelector('view[name="' + viewName + '"]');

      // 兼容 ie 8 自定义 tag
      // TODO : 精简代码
      dom = domWrapper.querySelector('view[name="' + viewName + '"]') || domWrapper.getElementsByTagName('cjia:view')[0] || domWrapper.getElementsByTagName('view')[0];

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
