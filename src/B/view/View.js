Air.Module("B.view.View", function(){

  function createDomByString(templeteString){
    var div = document.createElement('div');
    div.innerHTML = templeteString;
    var dom = div.childNodes[0];
    return dom;
  }

  function loadScript(dom, fn) {
    var jsList = splitJS(dom);
    runJS(jsList);
    fn && fn();
  }

  function runJS(scripts){
    for (var scriptIndex = scripts.length - 1; scriptIndex >= 0; scriptIndex--) {
      var activeScript = scripts[scriptIndex];

      var tmpScript = document.createElement('script');
      if (activeScript.src) {
        tmpScript.src = activeScript.src;
      } else {
        tmpScript.text = activeScript.text;
      }
      view.appendChild(tmpScript);

      activeScript.parentNode.removeChild(activeScript);
    };
  }

  function splitJS(dom){
      var scripts = dom.querySelectorAll('script');
      scripts = [].slice.call(scripts);
      return scripts
  }

  function View(viewName, dom, options){
    options = options || {};
    if (beacon.isType(dom, 'String')) {
      dom = createDomByString(dom);
      // TODO: IE 8 不支持直接innerHTML加载样式
      loadScript(dom, options.initCallback);
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

  }

  return View;

});
