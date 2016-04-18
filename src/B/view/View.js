Air.Module("B.view.View", function(require){
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
