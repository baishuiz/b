Air.Module("B.view.View", function(require){
  var scopeManager = require('B.scope.scopeManager');
  var EVENTS =  require('B.event.events');

  window.statsEvents || (window.statsEvents = {});
  statsEvents.PAGE_SHOW = EVENTS.PAGE_SHOW;
  statsEvents.PAGE_HIDE = EVENTS.PAGE_HIDE;

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

    beacon(this).on(events.onShow, function () {
      beacon.on(statsEvents.PAGE_SHOW, [location.href, viewName]);
    });
    beacon(this).on(events.onHide, function () {
      beacon.on(statsEvents.PAGE_HIDE, [location.href, viewName]);
    });

    this.show = function (){
      dom.setAttribute('active','true');

      // IE8 不渲染
      if(typeof DOMParser === 'undefined'){
        dom.style.borderBottom = '1px solid transparent';
        setTimeout(function(){
          dom.style.borderBottom = 'none';
        }, 0);
      }
    };

    this.hide = function(){
      dom.removeAttribute('active');
    };

    this.getDom = function (){
      return dom;
    };

    this.getViewName = function (){
      return viewName;
    };

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
